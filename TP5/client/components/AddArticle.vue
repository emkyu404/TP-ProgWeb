<template>
    <form id="add-article-form" @submit.prevent="addArticle">
      <h2>Nouveau produit à ajouter</h2>
      <input type="text" v-model="newArticle.name" placeholder="Nom du produit" required>
      <input type="number" v-model="newArticle.price" placeholder="Prix" required>
      <textarea type="text" v-model="newArticle.description" required placeholder="Description"></textarea>
      <input type="text" v-model="newArticle.image" placeholder="Lien vers l'image">
      <button id="bouton-ajouter">Ajouter</button>
    </form>
</template>
 
<script>
module.exports = {
  data () {
    return {
        newArticle: {
          name: '',
          description: '',
          image: '',
          price: 0
      }
    }
  },
  methods: {
      addArticle () {
        this.$emit('add-article', this.newArticle)
    }
  },
  props:{
  }
}

</script>
 
<style>
  form#add-article-form{
    position : fixed;
    top : 20%;
    left : -10px;
    background-color : #333;
    border-radius : 0 20px 20px 0;
    display : flex;
    flex-direction : column;
    justify-content: space-around;
    padding : 30px;
    padding-left : 90px;
    z-index : 20;
  }

  form#add-article-form h2{
    color : white;
    margin : 0;
  }

  form#add-article-form input, form#add-article-form h2, form textarea{
    margin-bottom : 5px;
    padding :10px;
    font-family: 'Roboto', sans-serif;
  }

  form#add-article-form button{
    padding :10px;
    width : 50%;
    color :white;
    margin-left : 50%;
    background-color : cyan;
    border:none;
  }

  form#add-article-form button:hover{
    box-shadow : 0 2px 2px black;
    padding :10px;
    background-color :green;
    transition : 0.125s;
  }
</style>
