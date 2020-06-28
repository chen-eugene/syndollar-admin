import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {},

    mutations: {},

    actions: {
        async getDishesListX(store, params) {
            return await axios.get('/dishes/list', {
                params: {
                    ...params
                }
            })
        },

        createDishesX(store, params) {
            return axios.post('/dishes/create', params)
        },

        deleteDishesX(store, params) {
            return axios.post('/dishes/remove', params)
        },

        editDishesX(store, params) {
            return axios.post('/dishes/edit', params)
        },

        discountDishesX(store, params) {
            return axios.post('/dishes/discount', params)
        },

        soldoutDishesX(store, params) {
            return axios.post('/dishes/soldout', params)
        },

        queryDishesX(store, params) {
            return axios.get('/dishes/queryDishes', {
                params: {
                    ...params
                }
            })
        }

    }
}
