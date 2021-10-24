import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import init from 'liu-tools'
// 导入字体图标
import './assets/fonts/iconfont.css'
//引入第三地库vue-table-with-tree-grid
import treeTable from 'vue-table-with-tree-grid'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 引入进度条和对应样式(配合axios拦截器使用)在request拦截器中展示进度条Nprogress.start
// 在响应拦截器中隐藏进度条，Nprogress.done
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 设置请求根路径
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
// 设置请求拦截器
axios.interceptors.request.use(config => {
  // 显示进度条
  NProgress.start()
  //给请求头添加`Authorization`,
  config.headers.Authorization = sessionStorage.getItem('token')
  return config //必须要返回 config配置项
})
// 设置响应拦截器
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})
//给Vue原型添加axios，全局使用
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 引入格式化时间戳插件
Vue.prototype.$formatDate = init
// 注册全局组件 ：Vue.component('组件名'，要注册的组件)
Vue.component('tree-table', treeTable)
// 注册富文本编辑器
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
