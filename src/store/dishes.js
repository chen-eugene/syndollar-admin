import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {

    },

    mutations: {

    },

    actions: {
        async getDishesListX (store, params) {
            const response = await axios.get('/dishes/list', { params })
            return response
        },

        createDishesX (store, params) {
            return axios.post('/dishes/create', params)
        },

        discountDishesX (store, params) {
            return axios.post('/dishes/discount', params)
        },

        soldoutDishesX (store, params) {
            return axios.post('/dishes/soldout', params)
        },

        removeDishesX (store, params) {
            return axios.post('/dishes/remove', params)
        }
    }
}