<template>
  <div>
    <article v-for="article in articles" :key="article.id">
      <div class="article-img">
        <div :style="{ backgroundImage: 'url(' + article.image + ')' }">
        </div>
      </div>
      <div class="article-content" v-if="editingArticle.id !== article.id">
        <div class="article-title">
          <h2>{{ article.name }} - {{ article.price }}€</h2>
          <div>
          <button id="delete-button" @click="deleteArticle(article.id)">Supprimer</button>
          <button @click="editArticle(article)">Modifier</button>
          <button @click="addToPanier(article.id)" v-if="!panier.articles.some(a => a.id === article.id)">Ajouter au panier</button>
          <button @click="removeFromPanier(article.id)" v-else> Retirer du panier</button>
          </div>
        </div>
        <p>{{ article.description }}</p>
      </div>
      <div class="article-content" v-else>
        <div class="article-title">
          <div><input type="text" v-model="editingArticle.name" placeholder="Titre de l'article"> - <input type="number" v-model="editingArticle.price" placeholder="Prix"></div>
          <div>
            <button id="confirm-button" @click="sendEditArticle()">Valider</button>
            <button id="cancel-button" @click="abortEditArticle()">Annuler</button>
          </div>
        </div>
        <p><textarea v-model="editingArticle.description"></textarea></p>
        <input type="text" v-model="editingArticle.image" placeholder="Lien vers l'image">
      </div>
    </article>
    <div id="show-form" @click="showForm = !showForm">
      <img src="https://cdn0.iconfinder.com/data/icons/math-business-icon-set/93/1_1-512.png">
    </div>
    <transition name="slide-fade">
      <add-article @add-article="addArticle" v-if="showForm"></add-article>
    </transition>
  </div>
</template>

<script>
const AddArticle = window.httpVueLoader('./components/AddArticle.vue')
module.exports = {
  components: {
    AddArticle
  },
  props: {
    articles: { type: Array, default: [] },
    panier: {type: Object}
  },
  data () {
    return {
      newArticle: {
        name: '',
        description: '',
        image: '',
        price: 0
      },
      editingArticle: {
        id: -1,
        name: '',
        description: '',
        image: '',
        price: 0
      },
      showForm: false
    }
  },
  
  methods: {
    addArticle (newArticle) {
      this.$emit('add-article', newArticle)
    },
    deleteArticle (articleId) {
      this.$emit('delete-article', articleId)
    },
    editArticle (article) {
      this.editingArticle.id = article.id
      this.editingArticle.name = article.name
      this.editingArticle.description = article.description
      this.editingArticle.image = article.image
      this.editingArticle.price = article.price
    },
    sendEditArticle () {
      this.$emit('update-article', this.editingArticle)
      this.abortEditArticle()
    },
    abortEditArticle () {
      this.editingArticle = {
        id: -1,
        name: '',
        description: '',
        image: '',
        price: 0
      }
    },
    addToPanier(articleId){
      this.$emit('add-to-panier', articleId)
    },
    removeFromPanier(articleId){
      this.$emit('remove-from-panier', articleId)
    }
  }
}
</script>

<style scoped>
article {
  display: flex;
  border-bottom : 10px solid white;
}

.article-img {
  flex: 1;
}

.article-img div {
  width:  125px;
  height: 125px;
  margin : auto;
  background-size: cover;
}

.article-content {
  flex: 3;
  background-color : #ccc;
  padding: 20px;
}

.article-title {
  display: flex;
  justify-content: space-between;
}

article button{
  border : none;
  background-color : #333;
  color : white;
  padding : 10px;
  border-radius : 5px;
  margin : 5px;
}

article button:hover{
  box-shadow : 2px 2px 2px black;
  background-color : cyan;
  transform:scale(1.075);
  transition : 0.125s;
}

article button#delete-button:hover, article button#cancel-button:hover{
  background-color : red;
}

article button#confirm-button:hover{
  background-color : green;
}


article input, article textarea{
  margin-bottom : 5px;
  padding :10px;
  font-family: 'Roboto', sans-serif;
}

article textarea {
  width: 80%;
  resize : vertical;
}

#show-form{
  position : fixed;
  top : 20%;
  left : -20px;
  background-color : #333;
  color : white;
  padding :10px;
  padding-left : 20px;
  border-radius: 20px;
  width :50px;
  height : 50px;
  opacity : 0.5;
  z-index : 30;
}

#show-form img{
  width : 50px;
  height : auto;
}

#show-form:hover{
  opacity : 1;
  background-color : cyan;
  transform: scale(1.075);
  transition : .125s;
  width: fit-content;
  content : "afficher formulaire";
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

</style>
