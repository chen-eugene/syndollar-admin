import axios from '../assets/js/axios'

const GET_CATEGORY_LIST = "GET_CATEGORY_LIST"

export default {
    namespaced: true,

    state: {
        categoryList: []
    },

    mutations: {
        [GET_CATEGORY_LIST](state, data) {
            state.categoryList = data
        }
    },

    actions: {
        async [GET_CATEGORY_LIST]({commit}, params) {
            const res = await axios.get('/category/list', params)
            commit(GET_CATEGORY_LIST, res.data)
            return res
        },

        createCategoryX(store, params) {
            return axios.post('/category/create', params)
        },

    }
}
