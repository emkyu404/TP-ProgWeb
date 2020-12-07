<template>
    <form @submit.prevent="loginUser">
        <legend> Connexion utilisateur </legend>
        <fieldset>
            <div><label for="email"> Email </label></div>
            <div><input v-model="user.email" type="email" name="email" placeholder="Email" required></div>
            <div><label for="password"> Mot de passe </label></div>
            <div><input v-model="user.password" type="password" placeholder="Mot de passe" name="password" required></div>
            <div><input type="submit" value="Se connecter"></div>
            <div><a v-on:click="redirectToReg"> Je ne possède pas de compte </a>
        </fieldset> 
    </form>
</template>

<script>
module.exports = {
    data(){
        return{
            user: {
                email: '',
                password: ''
            }
        }
    },

    methods: {
       loginUser(){
           this.$emit('login-user', this.user)
       },
       redirectToReg(){
           router.push('/register')
       }
    },

    props:{
    }
    
}
</script>

<style>
</style>