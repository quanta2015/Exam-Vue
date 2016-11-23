import Vue from 'vue'
import App from './App'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueSocketio from 'vue-socket.io'

import Result from 'components/Result.vue'
import Home from 'components/Home.vue'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueSocketio, 'http://127.0.0.100:3000')

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/result', component: Result }
  ]
})

new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
