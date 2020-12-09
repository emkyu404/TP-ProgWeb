<template>
    <form class="reg-log-forms" id="login-form" @submit.prevent="loginUser">
        <legend> Connexion </legend>
        <fieldset>
            <div><label for="email"> Email </label></div>
            <div><input v-model="user.email" type="email" name="email" placeholder="Email" required></div>
            <div><label for="password"> Mot de passe </label></div>
            <div><input v-model="user.password" type="password" placeholder="Mot de passe" name="password" required></div>
            <div id="buttons-form"><a v-on:click="redirectToReg"> Je ne possède pas de compte </a><input type="submit" value="Se connecter"></div>
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

<style scoped>

    #login-form{
        width : 500px;
        margin : auto;
        background-color : #333;
        color : white;
        padding : 20px;
    }

    #login-form legend{
        text-align : center;
        font-size : 24px;
    }

    #login-form fieldset{
        border:none;
        display : flex;
        flex-direction: column;
        flex-wrap : wrap;
        justify-content: space-evenly;
    }
    #login-form fieldset div{
        flex : 1;
        width : 100%;
    }

    #login-form fieldset input{
        width : 100%;
        margin : auto;
        margin-bottom : 20px;
        padding : 10px;
    }

    #login-form #buttons-form{
        display:flex;
        width : 100%;
        flex-wrap : nowrap;
        flex-direction : row;
        justify-content: space-between;
    }

    #login-form fieldset a{
        flex : 1;
        color : white;
        font-size : 12px;
        text-decoration: underline;
    }

    #login-form fieldset a:hover{
        color : cyan;
        cursor : pointer;
    }

    #login-form fieldset input[type="submit"]{
        background-color : #ccc;
        flex : 1;
        border: none;
    }

    #login-form fieldset input[type="submit"]:hover{
        background-color : cyan;
        box-shadow : 2px 2px 2px black;
        transition : 0.125s;
    }
</style>