// import '@babel/polyfill'
// 在main.js的头部
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'
import Vue from 'vue'
// 默认重置css样式，统一各个浏览器样式
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/element-variables.scss' // global css
import '@/assets/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import '@/assets/icons' // icon
import '@/permission' // permission control
import { message } from '@/utils/resetMessage'
// element ui 全局设置
ElementUI.Table.props.showOverflowTooltip = {
  default: true,
  type: Boolean
}
ElementUI.TableColumn.props.showOverflowTooltip = {
  default: true,
  type: Boolean
}
// console.log(ElementUI)

Vue.prototype.$message = message
Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}
Vue.prototype.msgWarning = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'warning', duration: 2000 })
}
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(permission)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
