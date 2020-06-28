import axios from '../assets/js/axios'

export default {
    namespaced: true,

    state: {},

    mutations: {},

    actions: {
        getOrderListX(store, params) {
            return axios.get('/order/list', {
                params: {
                    ...params
                }
            })
        },
        updateStatusX(store, params) {
            return axios.post('/order/update-status', params)
        },

    }
}
