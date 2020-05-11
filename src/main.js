import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/sass/_app.scss'
import global from '@/assets/js/global'
import VueCropper from 'vue-cropper'

Vue.use(VueCropper)
Vue.use(global)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
