import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import store from './stores'

import axios from 'axios'
Vue.prototype.axios = axios

// 用于处理图片的
Vue.filter('setWH',(url,arg) => {
    return url.replace(/w\.h/,arg)
})

// 全局组件
import Scroller from '@/components/Scroller'
Vue.component('Scroller',Scroller)

import Loading from '@/components/Loading'
Vue.component('Loading',Loading)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
