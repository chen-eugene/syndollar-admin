import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {

    },

    mutations: {

    },

    actions: {
        async getEmployListX (store, params) {
            const response = await axios.get('/employ/list', { params })
            return response
        },

        createEmployX (store, params) {
            return axios.post('/employ/create', params)
        }
    }
}