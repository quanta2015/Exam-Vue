<template>
  <div class="login-overlay">
    <div class="login-form">
       <div class="box-title">用户登录</div>
       <div class="box-row">
            <input type="text" max="12" class="form-control  text-center" placeholder="请输入学号" v-model="username">
      </div>
      <div class="box-row">
            <input type="password" max="12" class="form-control  text-center" placeholder="请输入密码" v-model="password">
      </div>
      <div class="box-row">
            <a class="btn btn-danger" v-on:click="cancel">取消</a>
            <a class="btn btn-primary" v-on:click="login">登录</a>
      </div>
    </div>
    </div>
</template>

<script>
import api from '../api'

export default {
  props: ['show'],
  data () {
    return {
      username: '',
      password: '',
      error: false
    }
  },
  methods: {
    login (e) {
      api.login(this, this.username, this.password, resp => {
        if (resp.body.code === 0) {
          console.log('success')
          this.$parent.user = resp.body.data.userid
          this.$parent.username = resp.body.data.username
          this.$parent.online = resp.body.data.online
          this.$parent.showLogin = false
          this.$parent.isLogin = true
          if (resp.body.data.userid === 'admin') {
            this.$router.push('manage')
            this.$parent.showMsg('管理员成功登录')
          } else if (resp.body.data.online !== '3') {
            this.$socket.emit('login', this.username, resp.body.data.online)
            this.$parent.showMsg('已经进入考场！')
          } else if (resp.body.data.online === '3') {
            this.$socket.emit('login', this.username, resp.body.data.online)
            this.$parent.showMsg('您已经交卷！')
          }
        } else {
          console.log('err')
        }
      })
    },
    cancel (e) {
      console.log('cancel.')
      this.$parent.showLogin = false
    }
  }
}
</script>

<style>
  .login-overlay {
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f9f9f9;
  }


  .login-form {
    margin-top: 100px;
    width: 600px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .05);
    background-color: #fff;
    border: 1px solid #eee;
    padding: 15px;
    display: flex;
    flex-direction: column;
  }
  
.box-title {
  font: 20px/1.5 "microsoft yahei";
  text-align: center;
  color: #337ab7;
}

.box-row {
  padding: 10px;
  text-align: center;
}

</style>
