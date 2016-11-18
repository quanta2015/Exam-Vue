import Vue from 'vue'
import App from './App'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import Result from 'components/Result.vue'
import Home from 'components/Home.vue'

Vue.use(VueRouter)
Vue.use(VueResource)

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
