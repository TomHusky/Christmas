// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import config from '@/config'
import store from './store/index.js'

import animate from 'animate.css'
Vue.use(animate);


/**
 * @description 全局注册应用配置
 */
 Vue.prototype.$config = config

// /*引入资源请求插件*/
// import VueResource from 'vue-resource'
// /*使用VueResource插件*cn/
// Vue.use(VueResource)

Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
}).$mount('#app')
