import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router from '../router'
import md5 from 'js-md5'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})
service.interceptors.request.use(
  config => {
    console.log(config)
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    config.headers['signature'] = ''
    if (config.data) {
      config.headers['signature'] = md5(md5(JSON.stringify(config.data)))
    } else if (config.hasOwnProperty('params') && config.params) {
      config.headers['signature'] = md5(md5(JSON.stringify(config.params)))
    }
    // const time = new Date().getTime()
    // config.params['time'] = time
    //

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
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else if (res.code === 401) {
      removeToken()
      router.push('/login')
      Message({
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
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
// export var backendIP = process.env.VUE_APP_BASE_API
export var backendIP = 'http://192.168.11.164:8088'
export var mockIP = 'http://service.wewin.com.cn:8071/api/5f34e300c4557651c8ad2034/pc'// 模拟IP地址
