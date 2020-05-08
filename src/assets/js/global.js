import { formatDate, formatMoney, getCookie, deleteCookie, addCookie, getKey, setKey, removeKey } from './utils'

export default {
    install (Vue) {
        Vue.filter('currency', formatMoney)
        Vue.filter('date', formatDate)
        Vue.filter('gender', (value) => {
            const mapping = {
                F: '女',
                M: '男'
            }
            return mapping[value]
        })
        Vue.filter('role', value => {
            const mapping = {
                'ADMIN': '管理员',
                'WAITER': '服务员'
            }
            return mapping[value]
        })

        Vue.prototype.$date = formatDate
        Vue.prototype.$currency = formatMoney

        Vue.prototype.$cookie = {
            set: addCookie,
            get: getCookie,
            remove: deleteCookie
        }

        Vue.prototype.$storage = {
            set: setKey,
            get: getKey,
            remove: removeKey
        }
    }
}
