<template>
  <div id="app">
    <div class="site">
      <div class="site-title">Online Test Site  </div>
      <div class="site-login" v-if="!isLogin" @click="showLogin=true">Login</div>
      <div v-else>{{user}}</div>
      </div>

    <router-view class="view"  v-bind:user="user"></router-view>

    <login-form v-if="showLogin" v-bind:show="showLogin"></login-form>
  </div>
</template>

<script>
require('../node_modules/font-awesome/css/font-awesome.min.css')
import HomeView from './components/Home'
import LoginForm from './components/LoginForm'
// import ExamView from './components/Exam'
// import ManageView from './components/Manage'

export default {
  data () {
    return {
      user: {},
      showLogin: false,
      showNotifications: false,
      isLogin: false,
      timer: ''
    }
  },
  components: {
    // ManageView,
    // ExamView
    HomeView,
    LoginForm
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    }
  }
}
</script>

<style>
html,body {
  height: 100vh
}

#app {
  margin:0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.site {
  font: 24px/1.5 "microsoft yahei";
  padding: 10px;
  font-weight: 600;
  color: #fff;
  background: #ff6600;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.site-title {
  flex:1;
}

.site-login {
  width: 100px;
  background: #00aa66;
  height: 30px;
  color: #fff;
  text-align: center;;
  font-size: 16px;
  font-weight: 500;
  padding: 2px;
  cursor: pointer;
  font-weight: 600
}

.site-login:hover {
  background: #009966;
}



.nav a{
  padding:5px 20px;
  text-decoration: none;
  cursor: pointer;
  color:#fff;
}

.nav a:hover{
  color: #ff6600;
}

</style>
