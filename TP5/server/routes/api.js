const express = require('express')
const { forEach } = require('../data/articles.js')
const router = express.Router()
const articles = require('../data/articles.js')
const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
  user : 'postgres',
  host : 'localhost',
  password : 'motdepasse1234',
  database : 'TP5'
})

client.connect()

class Panier {
  constructor () {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.articles = []
  }
}

/**
 * Dans ce fichier, vous trouverez des exemples de requêtes GET, POST, PUT et DELETE
 * Ces requêtes concernent l'ajout ou la suppression d'articles sur le site
 * Votre objectif est, en apprenant des exemples de ce fichier, de créer l'API pour le panier de l'utilisateur
 *
 * Notre site ne contient pas d'authentification, ce qui n'est pas DU TOUT recommandé.
 * De même, les informations sont réinitialisées à chaque redémarrage du serveur, car nous n'avons pas de système de base de données pour faire persister les données
 */

/**
 * Notre mécanisme de sauvegarde des paniers des utilisateurs sera de simplement leur attribuer un panier grâce à req.session, sans authentification particulière
 */
router.use((req, res, next) => {
  // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

/**
 * TP5 - Exercice 2
 * Ajout d'une nouvelle route POST /register pour l'inscription de l'utilisateur
 */
router.post('/register', (req, res) => {

  /* Question 4.a */
  const email = req.body.email
  const password = req.body.password

  console.log('email : '+ email + ' // password : ' + password)

  /* Question 4.b à 4.d*/
  register(res, email,password)


})

/**
 * Question 4.b à 4.d
 * Ajout d'une fonction asynchrone pour la réalisation de l'inscription utilisateur
 * @param {email} email 
 * @param {password} password 
 */
async function register(res, email, password){

  /* Préparation de la requête pour retourner le nombre de tuple où l'email correspond à celui indiqué dans le body */
  const sql1 = 'SELECT email FROM users WHERE email=$1'
  const result1 = await client.query({
    text : sql1,
    values : [email]
  })
  
  /* On compte le nombre de tuple renvoyer par la requête ci-dessus. Si le résultat est égal ou supérieur à 1, on renvoit une erreur */
  if(result1.rowCount >= 1){
    res.status(400).json({message : 'Utilisateur déjà enregistré avec cette adresse mail', valid:false})
  }
  /* Sinon, on insere le nouvelle utilisateur dans la table 'users' le nouvelle utilisateur  */
  else{
    const hash = await bcrypt.hash(password, 10)
    const sql2 = 'INSERT INTO users (email,password) values ($1,$2)'
    await client.query({
      text : sql2,
      values : [email, hash]
    })
    res.json({message : 'Inscription réussi', valid:true})
  }
}


/**
 * TP5 - Exercice 3
 * Ajout d'une nouvelle route POST /login pour la connexion utilisateur
 */
router.post('/login', (req, res) => {
  if(req.session.userId != null){
    res.status(401).json({message:'Utilisateur déjà connecté sur cette session', valid: false})
  }else{
    const email = req.body.email
    const password = req.body.password

    console.log('email : '+ email + ' // password : ' + password)

    login(res, req, email, password)
  }
})

async function login(res, req, email, password){
  const sql = "SELECT id, email, password from users WHERE email=$1"
  const result = await client.query({
    text : sql,
    values : [email]
  })

  if(result.rowCount == 1){
    if(await bcrypt.compare(password, result.rows[0].password)){
      req.session.userId = result.rows[0].id
      console.log(req.session)
      res.json({message: 'Connexion réussi', valid: true})
    }else{
      res.status(400).json({message: 'Mauvais mot de passe', valid: false})
    }
  }
  else{
    res.status(404).json({message: 'Utilisateur inexistant dans la base de donnée', valid: false})
  }
}


/**
 * TP5 - Exercice 4
 * Ajout d'une nouvelle route GET /me pour retourner l'utilisateur connecté
 */
router.get('/me', (req,res)=>{
  if(req.session.userId != null){
    me(res, req.session.userId)
  }else{
    res.status(401).json({message:'User not connected'})
  }
})

async function me(res, userId){
  const sql = "SELECT email FROM users WHERE id=$1"
  const result = await client.query({
    text: sql,
    values: [userId]
  })
  res.json({message : 'User connected [id : ' + userId + ', email : ' + result.rows[0].email} + ']')
}

/*
 * Cette route doit retourner le panier de l'utilisateur, grâce à req.session
 */
router.get('/panier', (req, res) => {
  res.json(req.session.panier)
})

/*
 * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
 * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
 */
router.post('/panier', (req, res) => {
  const id = parseInt(req.body.id) // contient l'id de l'article à ajouter
  const qte = parseInt(req.body.qte) // contient la quantité à ajouter
  console.log(id)

  /* existIn est une fonction que nous avons ajouté pour la vérification de l'existence d'un id dans une liste*/
  if(!existIn(articles, id)){
    res.status(404).json({message:'Article non trouvé'})
    return
  }
  else if(isNaN(qte) || qte <= 0){
    res.status(501).json({message:'Mauvaise quantité'})
    return
  }
  else{
    const article = {
      id: id,
      qte: qte
    }

    req.session.panier.articles.forEach(a => {
      if(a.id === article.id){
        res.status(400).json({message:'Article déjà présent dans le panier'})
        return
      }
    })
    req.session.panier.articles.push(article)
    res.json(article)
  }

})

/*
 * Cette route doit permettre de confirmer un panier, en recevant le nom et prénom de l'utilisateur
 * Le panier est ensuite supprimé grâce à req.session.destroy()
 */
router.post('/panier/pay', (req, res) => {
  if(req.session.userId != null){
    req.session.destroy()
    return res.json({message :'Merci pour votre achat', valid: true})
  }else{
    return res.json({message : 'Vous devez être connecté pour valider le paiement', valid: false})
  }
})

/*
 * Cette route doit permettre de changer la quantité d'un article dans le panier
 * Le body doit contenir la quantité voulue
 */
router.put('/panier/:articleId', (req, res) => {
  const id= parseInt(req.params.articleId)
  const qte= parseInt(req.body.qte)

  if(!existIn(req.session.panier.articles, id)){
    res.status(404).json({ message:"Article non trouvé"})
  }else if(isNaN(qte) || qte <= 0){
    res.status(400).json({ message:'Quantité invalide'})
  } else{
    req.session.panier.articles.find(a => a.id === id).qte = qte
    res.json(req.session.panier.articles)
  }
  
})

/*
 * Cette route doit supprimer un article dans le panier
 */
router.delete('/panier/:articleId', (req, res) => {
  const id= parseInt(req.params.articleId)
  if(!existIn(req.session.panier.articles, id)){
    res.status(404).json({ message:'Article non trouvé'})
  } else{
    var index = req.session.panier.articles.findIndex(a => a.id === id)
    console.log(index)
    req.session.panier.articles.splice(index, 1)
    res.json(req.session.panier.articles)
  }
})


/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get('/articles', (req, res) => {
  res.json(articles)
})

/**
 * Cette route crée un article.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 * NOTE: lorsqu'on redémarre le serveur, l'article ajouté disparait
 *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
 */
router.post('/article', (req, res) => {
  const name = req.body.name
  const description = req.body.description
  const image = req.body.image
  const price = parseInt(req.body.price)

  // vérification de la validité des données d'entrée
  if (typeof name !== 'string' || name === '' ||
      typeof description !== 'string' || description === '' ||
      typeof image !== 'string' || image === '' ||
      isNaN(price) || price <= 0) {
    res.status(400).json({ message: 'bad request' })
    return
  }

  const article = {
    id: articles.length + 1,
    name: name,
    description: description,
    image: image,
    price: price
  }
  articles.push(article)
  // on envoie l'article ajouté à l'utilisateur
  res.json(article)
})

/**
 * Cette fonction est appelé pour vérifier si un id d'un article est contenu dans une liste d'articles
 * param : liste => Liste d'article, id => id de l'article à rechercher
 * return : true si l'id est trouvé, false sinon
 */
function existIn(liste, id){
  var verify = false
  liste.forEach(a => {
    if(a.id === id)
      verify = true
  })
  return verify
}
/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
function parseArticle (req, res, next) {
  const articleId = parseInt(req.params.articleId)

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(articleId)) {
    res.status(400).json({ message: 'articleId should be a number' })
    return
  }
  // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
  req.articleId = articleId

  const article = articles.find(a => a.id === req.articleId)
  if (!article) {
    res.status(404).json({ message: 'article ' + articleId + ' does not exist' })
    return
  }
  // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
  req.article = article
  next()
}

router.route('/article/:articleId')
  /**
   * Cette route envoie un article particulier
   */
  .get(parseArticle, (req, res) => {
    // req.article existe grâce au middleware parseArticle
    res.json(req.article)
  })

  /**
   * Cette route modifie un article.
   * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
   * NOTE: lorsqu'on redémarre le serveur, la modification de l'article disparait
   *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
   */
  .put(parseArticle, (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const image = req.body.image
    const price = parseInt(req.body.price)

    req.article.name = name
    req.article.description = description
    req.article.image = image
    req.article.price = price
    res.send()
  })

  .delete(parseArticle, (req, res) => {
    const index = articles.findIndex(a => a.id === req.articleId)

    articles.splice(index, 1) // remove the article from the array
    res.send()
  })

module.exports = router
