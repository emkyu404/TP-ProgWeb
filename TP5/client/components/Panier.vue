<template>
  <div id="my-cart">
    <h2>Mon Panier</h2>
    <table>
      <thead>
        <th> ID </th>
        <th> Quantité </th>
      </thead>
      <tbody>
        <tr v-for="article in panier.articles">
          <td>{{article.id}}</td>
          <td> <input  @change="updateArticleQte(article)" v-model="article.qte" type="number" min="1"></td>
        </tr>
      </tbody>
    </table>
    <button @click="payCart"> Payer </button>
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    panier: { type: Object }
  },
  data () {
    return{
    }
  },
  async mounted () {
  },
  methods: {
    updateArticleQte(article){
      console.log(article)
      this.$emit('update-article-qte', article)
    },

    payCart(){
      if(this.panier.articles.length > 0){
        this.$emit('pay-cart', this.panier.articles)
      }
    }
  }
}
</script>

<style scoped>
  #my-cart{
    width :fit-content;
    margin : auto;
    margin-top : 5%;;
    background-color : #ccc;
    padding : 30px;
  }

  #my-cart h2{
    text-align : center;
  }

  #my-cart table{
    min-width :300px;
    text-align : center;
    border-collapse: collapse;
    margin-bottom : 10px;
  }

  #my-cart thead, tbody{
    border-bottom : solid 2px #333;
    margin-bottom : 10px;
  }

  #my-cart td{
    padding : 10px;
  }

  #my-cart td input{
    width : 40px;
  }

  #my-cart button{
    width : 50%;
    margin-left : 50%;
    padding :10px;
    background-color : #333;
    color : white;
    border:none;
  }

  #my-cart button:hover{
    background-color : cyan;
    transition : 0.125s;
    box-shadow : 2px 2px 2px black;
  }
  
</style>
