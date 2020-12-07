<template>
    <form @submit.prevent="registerUser">
        <legend> Inscription utilisateur </legend>
        <fieldset>
            <div><label for="email"> Email </label></div>
            <div><input v-model="newUser.email" type="email" name="email" placeholder="Votre email" required></div>
            <div><label for="password"> Mot de passe </label></div>
            <div><input v-model="newUser.password" type="password" name="password" required></div>
            <div><label for="confirmPassword"> Confirmer le mot de passe </label></div>
            <div><input v-model="confirmPassword" type="password" name="confirmPassword" required></div>
            <div><input type="submit" value="S'inscrire"></div>
        </fieldset> 
    </form>
</template>

<script>
module.export = {
    data(){
        return{
            newUser: {
                email : '',
                password: ''
            }
        }
    },

    methods: { 
        verifyPasswordMatch(){
            return this.newUser.password === this.confirmPassword
        },

        registerUser(){
            if(this.verifyPasswordMatch)
                this.$emit('register-user', this.newUser)
        }
    },

    props:{
        confirmPassword:''
    }
    
}
</script>

<style>
</style>