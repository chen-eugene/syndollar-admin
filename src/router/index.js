import Vue from 'vue'
import Router from 'vue-router'
import user from './user'
import employ from './employ'
import dishes from './dishes'

Vue.use(Router)

export default new Router({
  routes: [
    ...user,
    ...employ,
    ...dishes
  ]
})