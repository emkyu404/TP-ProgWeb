<template>
  <div>
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
</style>
