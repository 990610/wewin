import Vue from 'vue'
import 'normalize.css/normalize.css' // 默认重置css样式，统一各个浏览器样式
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/element-variables.scss' // Element 主题设置
import '@/assets/styles/index.scss' // 全局 css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import adaptive from './directive/el-table'
import '@/assets/icons' // icon
import '@/permission' // permission control
import { message } from '@/utils/resetMessage'
import { rewirteLog } from '@/utils/index'
import fileters from '@/utils/fileters'
// element ui 全局设置 表格内容不换行实现提示
ElementUI.TableColumn.props.showOverflowTooltip = {
  default: true,
  type: Boolean
}
Vue.use(ElementUI)
// 全局挂载提示
Vue.prototype.$message = message
Vue.prototype.msgSuccess = function(msg, duration = 2000) {
  this.$message({ showClose: true, message: msg, type: 'success', duration: duration })
}
Vue.prototype.msgWarning = function(msg, duration = 2000) {
  this.$message({ showClose: true, message: msg, type: 'warning', duration: duration })
}
Vue.prototype.msgError = function(msg, duration = 2000) {
  this.$message({ showClose: true, message: msg, type: 'error', duration: duration })
}

Vue.config.productionTip = false
// 注册过滤器
for (const key in fileters) {
  if (fileters.hasOwnProperty(key)) {
    Vue.filter(key, fileters[key])
  }
}
Vue.use(permission)
Vue.use(adaptive)
// 生产环境取消console.log
rewirteLog()
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
