<template>
    <form @submit.prevent="registerUser">
        <legend> Inscription utilisateur </legend>
        <fieldset>
            <div><label for="email"> Email </label></div>
            <div><input v-model="newUser.email" type="email" name="email" placeholder="Email" required></div>
            <div><label for="password"> Mot de passe </label></div>
            <div><input v-model="newUser.password" type="password" placeholder="Mot de passe" name="password" required></div>
            <div><label for="confirmPassword"> Confirmer le mot de passe </label></div>
            <div><input v-model="newUser.confirmPassword" type="password" placeholder="Confirmer mot de passe" name="confirmPassword" required></div>
            <div><input type="submit" value="S'inscrire"></div>
            <div><a v-on:click="redirectToLog"> Déjà inscrit ? </a>
        </fieldset> 
    </form>
</template>

<script>
module.exports = {
    data(){
        return{
            newUser: {
                email: '',
                password: '',
                confirmPassword:''
            }
        }
    },

    methods: {
        async mounted () {
        },
        verifyPasswordMatch(){
            console.log(this.newUser.password === this.newUser.confirmPassword)
            return this.newUser.password === this.newUser.confirmPassword
        },

        registerUser(){
            if(this.verifyPasswordMatch()){
                const userToRegister = {email: this.newUser.email, password : this.newUser.password}
                console.log(userToRegister)
                this.$emit('register-user', userToRegister)
            }
            else{
                window.alert("Les mots de passes ne sont pas identiques")
            }
        },

        redirectToLog(){
            router.push('/login')
        }
    },

    props:{
    }
    
}
</script>

<style>
</style>