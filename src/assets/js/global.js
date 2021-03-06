import { formatDate, formatMoney, getCookie, deleteCookie, addCookie, getKey, setKey, removeKey, encrypt } from './utils'

// 全局组件
import components from '@/components'

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
        Vue.prototype.$encrypt = encrypt

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

        // 注册全局组件
        for (let key of Object.keys(components)) {
            Vue.component(components[key].name, components[key])
        }
    }
}
