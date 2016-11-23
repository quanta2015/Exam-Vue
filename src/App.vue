<template>
  <div id="app">
    <div class="site">
      <div class="site-title">Online Test Site</div>
      <div class="site-login" @click="showLogin=true">Login</div>
      </div>
    <div class="nav">
      <router-link to="/">测试</router-link>
      <router-link to="/result">阅卷</router-link>
    </div>

    <router-view class="view"  v-bind:user="user"></router-view>

    <login-form v-if="showLogin" v-bind:show="showLogin"></login-form>
    
  </div>
</template>

<script>
import ResultView from './components/Result'
import HomeView from './components/Home'
import LoginForm from './components/LoginForm'

export default {
  data () {
    return {
      user: {},
      showLogin: false,
      showNotifications: false
    }
  },
  components: {
    ResultView,
    HomeView,
    LoginForm
  },
  methods: {
    Login () {
      console.log('login')
    }
  }
}
</script>

<style>
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
  background: #eee;
}

.nav {
  display: flex;
  flex-direction: row;
  padding: 0;
  background: #000;
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
