import Vue from 'vue'
import App from './App'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueSocketio from 'vue-socket.io'

import Manage from 'components/Manage.vue'
import Home from 'components/Home.vue'
import Exam from 'components/Exam.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

Vue.use(VueRouter)
Vue.use(VueResource)
// Vue.use(VueSocketio, 'http://121.196.218.1:3000')
Vue.use(VueSocketio, 'http://localhost:3000')

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/manage', component: Manage },
    { path: '/exam', component: Exam }
  ]
})

new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
