import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'animate.css'

Vue.config.productionTip = false

/* 请求拦截器 */
Vue.axios.interceptors.request.use(config => {
  /* eslint-disable */
  /*  在发送请求时，带上token */
  if (localStorage.JWT) {
    config.headers.authorization = 'Bearer ' + localStorage.JWT
  } else {
    config.headers.authorization = 'dummy' // 为了防止spring security在响应头中加入www-authentication头，导致浏览器强制弹窗
  }
  return config
}, error => {
  // 处理error
  return Promise.reject(error.request)
})
/* 响应拦截器 */
Vue.axios.interceptors.response.use(res => {
  // 存储token
  localStorage.JWT = res.headers.authorization
  return res
}, error => {
  // 当请求是登陆请求时，将错误转交给登陆的组建自行处理
  if (error.request.responseURL.indexOf('/api/signIn') > 0) {
    return Promise.reject(error)
  } else if (error.response.status === 401 || error.response.status === 403) {
    // 其他情况，先弹窗，然后跳转到登陆页面
    // 状态码401，403
    alert('你没有权限，请重新登录')
    localStorage.JWT = undefined
    app.$router.push({ path: '/' }) // 在前台将页面路由至登录页面
  } else {
    alert('服务器内部错误')
  }
})

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
