import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import config from '@/config'

Vue.use(Router)

let BASE_URL = ''
switch (process.env.NODE_ENV) {
  case 'development':
    BASE_URL = config.publicPath.dev // 这里是本地的请求url
    break
  case 'production':
    BASE_URL = config.publicPath.pro // 生产环境url
    break
}

const router = new Router({
  routes: routes,
  // mode: 'history',
  linkActiveClass: 'active',
})
export default router