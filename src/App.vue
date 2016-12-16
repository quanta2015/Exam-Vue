<template>
  <div id="app">
    
    <div class="site">
      <div class="site-title"><em>Online</em> Test   </div>
      <!-- <div class="site-login" @click="showMsg('aaa')">Show</div> -->
      <div class="site-login" v-if="!isLogin" @click="showLogin=true">Login</div>
      <div class="site-user" v-else>{{user}}</div>
      </div>

    <router-view class="view"  v-bind:user="user"></router-view>

    <login-form v-if="showLogin" v-bind:show="showLogin"></login-form>

    <Notification v-bind:show="showNotifications" v-bind:msg="msg" ></Notification>
  </div>
</template>

<script>
require('../node_modules/font-awesome/css/font-awesome.min.css')
require('../node_modules/bootstrap/dist/css/bootstrap.min.css')
import HomeView from './components/Home'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

export default {
  data () {
    return {
      user: {},
      online: {},
      showLogin: false,
      showNotifications: false,
      msg: '',
      isLogin: false,
      timer: ''
    }
  },
  components: {
    HomeView,
    LoginForm,
    Notification
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    }
  },
  methods: {
    showMsg (msg) {
      this.msg = msg
      this.showNotifications = true
    }
  }
}
</script>

<style scope>
#app {
  margin:0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}


.site {
  font: 24px/1.5 "microsoft yahei";
  padding: 10px;
  font-weight: 600;
  /*color: #fff;*/
  background: #eee;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.site-title {
  flex:1;
}

.site-title em {
  font-style: normal;
  color: #41B883;
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

.site-user {
  font-size: 16px;
  margin-right: 20px;
}


</style>
