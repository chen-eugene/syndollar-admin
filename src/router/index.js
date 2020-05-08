import Vue from 'vue'
import Router from 'vue-router'
import user from './user'
import employ from './employ'

Vue.use(Router)

export default new Router({
  routes: [
    ...user,
    ...employ
  ]
})