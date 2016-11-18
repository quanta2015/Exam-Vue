<template>
  <div id="app">
    <div class="site">
      <div class="site-title">Online Test Site</div>
      <div class="site-login"></div>
      </div>
    <div class="nav">
      <router-link to="/">测试</router-link>
      <router-link to="/result">阅卷</router-link>
    </div>

    <router-view class="view"></router-view>

  </div>
</template>

<script>
import ResultView from './components/Result'
import HomeView from './components/Home'

export default {
  components: {
    ResultView,
    HomeView
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
  background: #666;
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
