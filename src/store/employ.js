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
        },

        updateEmployX (store, params) {
            return axios.post('/employ/update', params)
        },

        removeEmployX (store, params) {
            return axios.post('/employ/remove', params)
        },

        resetEmployX (store, params) {
            return axios.post('/employ/reset', params)
        }
    }
}