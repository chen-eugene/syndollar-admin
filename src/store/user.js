import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {

    },

    mutations: {

    },

    actions: {
        async userLoginX (store, params) {
            const response = await axios.post('/login', params)
            if (response.code === 200) {
                return response
            }
        } 
    }
}