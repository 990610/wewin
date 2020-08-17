import request from '@/utils/request.js'
import { randomString } from '@/utils/index.js'
export function getCodeImg() {
  var random = randomString(16)
  return request({
    url: '/makeid-boot/captcha.jpg',
    method: 'get',
    params: {
      uuid: random
    }
  })
}
export function login(data) {
  return request({
    url: '/makeid-boot/sys/login',
    method: 'post',
    data: data
  })
}
export function getInfo(userId) {
  return request({
    url: '/makeid-boot/sys/user/queryUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/makeid-boot/sys/logout',
    method: 'post'
  })
}
