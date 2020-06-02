import axios from '../assets/js/axios'
import { isEmptyObject, setKey, getKey } from '../assets/js/utils'

export default {
    namespaced: true,

    state: {
        userInfo: {}
    },

    mutations: {
        setUserInfo (state, params) {
            state.userInfo = params || {}
            setKey('userInfo', params)
        }
    },

    actions: {
        async userLoginX ({ commit }, params) {
            const response = await axios.post('/login', params)
            if (response.code === 200) {
                commit('setUserInfo', response.data.userInfo)
                return response
            }
        },

        async getUserInfoX ({ commit }) {
            const userInfo = getKey('userInfo')
            if (!isEmptyObject(userInfo)) {
                commit('setUserInfo', userInfo)
            }
        }
    }
}