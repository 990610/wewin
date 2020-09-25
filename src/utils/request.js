import axios from 'axios'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import { ToPathStr } from '@/utils/index'
import router from '../router'
import md5 from 'js-md5'
import { message } from '@/utils/resetMessage'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    // 接口请求验签
    config.headers['signature'] = ''
    if (config.data) {
      config.headers['signature'] = md5(md5(JSON.stringify(config.data)))
    } else if (config.hasOwnProperty('params') && config.params) {
      // console.log(ToPathStr(config.params))
      config.headers['signature'] = md5(md5(ToPathStr(config.params)))
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return res.result
    } else if (res.code === 500) {
      message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else if (res.code === 401) {
      removeToken()
      router.push('/login')
      message({
        message: res.message,
        type: 'error',
        duration: 5000
      })
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
export var backendIP = process.env.VUE_APP_BASE_API
export var mockIP = 'http://service.wewin.com.cn:8071/api/5f34e300c4557651c8ad2034/pc'// 模拟IP地址
