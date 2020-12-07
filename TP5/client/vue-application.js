const Home = window.httpVueLoader('./components/Home.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/panier', component: Panier },
  { path: '/register', component: Register}, 
  { path: '/login', component: Login}
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    articles: [],
    panier: {
      createdAt: null,
      updatedAt: null,
      articles: []
    }
  },
  async mounted () {
    const res = await axios.get('/api/articles')
    this.articles = res.data
    const res2 = await axios.get('/api/panier')
    this.panier = res2.data
  },
  methods: {
    async addArticle (article) {
      const res = await axios.post('/api/article', article)
      this.articles.push(res.data)
    },
    async updateArticle (newArticle) {
      await axios.put('/api/article/' + newArticle.id, newArticle)
      const article = this.articles.find(a => a.id === newArticle.id)
      article.name = newArticle.name
      article.description = newArticle.description
      article.image = newArticle.image
      article.price = newArticle.price
    },
    async deleteArticle (articleId) {
      await axios.delete('/api/article/' + articleId)
      const index = this.articles.findIndex(a => a.id === articleId)
      this.articles.splice(index, 1)
    },
    async addToPanier(articleId){
      const article = {id: articleId, qte: 1}
      await axios.post('/api/panier',article)
      this.panier.articles.push(article)
      console.log("Article ajouté au panier")
    },
    async removeFromPanier(articleId){
      await axios.delete('/api/panier/' + articleId)
      const index = this.panier.articles.findIndex(a => a.id === articleId)
      this.panier.articles.splice(index, 1)
      console.log("Article retiré du panier")
    },
    
    async updateArticleQte(article){
      await axios.put('/api/panier/'+article.id, article)
      const newQte = article.qte
      const articleToModify = this.panier.articles.find(a => a.id === article.id)
      articleToModify.qte = newQte
      console.log("Mise à jour de la quantité")
    },

    async registerUser(newUser){
      await axios.post('/api/register', newUser)
    },

    async loginUser(user){
      await axios.post('/api/login', user)
    },

    async payCart(articles){
      await axios.post('/api/panier/pay').then(function(res) {
        if(res.data.valid){
          alert(res.data.message)
        }else{
          alert(res.data.message)
          router.push('/login')
        }
      })
    }
  }
})
