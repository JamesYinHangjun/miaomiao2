import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import store from './stores'

import axios from 'axios'
Vue.prototype.axios = axios

// 用于处理图片的(自定义宽高的)  
Vue.filter('setWH',(url,arg) => {
    return url.replace(/w\.h/,arg)   // 把w.h 替换成我们传入的arg(就是自己设置的宽高)
})

// 全局组件
// 滚动
import Scroller from '@/components/Scroller'
Vue.component('Scroller',Scroller)

// 加载
import Loading from '@/components/Loading'
Vue.component('Loading',Loading)

Vue.config.productionTip = false

new Vue({
  router,
  store,               // 注入到每一个子组件中
  render: h => h(App)
}).$mount('#app')
