import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import employ from './employ'
import dishes from './dishes'
import category from './category'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        employ,
        dishes,
        category
    }
})
