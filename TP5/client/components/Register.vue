<template>
    <form id="register-form" @submit.prevent="registerUser">
        <legend> Inscription </legend>
        <fieldset>
            <div><label for="email"> Email </label></div>
            <div><input v-model="newUser.email" type="email" name="email" placeholder="Email" required></div>
            <div><label for="password"> Mot de passe </label></div>
            <div><input v-model="newUser.password" type="password" placeholder="Mot de passe" name="password" required></div>
            <div><label for="confirmPassword"> Confirmer le mot de passe </label></div>
            <div><input v-model="newUser.confirmPassword" type="password" placeholder="Confirmer mot de passe" name="confirmPassword" required></div>
            <div id="buttons-form"><a v-on:click="redirectToLog"> Déjà inscrit ? </a><input type="submit" value="S'inscrire"></div>
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

<style scoped>
    #register-form{
        width : 500px;
        margin : auto;
        background-color : #333;
        color : white;
        padding : 20px;
    }

    #register-form legend{
        text-align : center;
        font-size : 24px;
    }

    #register-form fieldset{
        border:none;
        display : flex;
        flex-direction: column;
        flex-wrap : wrap;
        justify-content: space-evenly;
    }
    #register-form fieldset div{
        flex : 1;
        width : 100%;
    }

    #register-form fieldset input{
        width : 100%;
        margin : auto;
        margin-bottom : 20px;
        padding : 10px;
    }

     #register-form #buttons-form{
        display:flex;
        width : 100%;
        flex-wrap : nowrap;
        flex-direction : row;
        justify-content: space-between;
    }

    #register-form fieldset a{
        flex : 1;
        color : white;
        font-size : 12px;
        text-decoration: underline;
    }

    #register-form fieldset a:hover{
        color : cyan;
        cursor : pointer;
    }

    #register-form fieldset input[type="submit"]{
        background-color : #ccc;
        flex : 1;
        border: none;
    }

    #register-form fieldset input[type="submit"]:hover{
        background-color : cyan;
        box-shadow : 2px 2px 2px black;
        transition : 0.125s;
    }

</style>