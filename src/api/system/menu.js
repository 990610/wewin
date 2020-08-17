import request from '@/utils/request'
export function getRouters() {
  return request({
    url: '/makeid-boot/sys/menu/nav',
    method: 'get'
  })
}
export function getMenu() {
  return request({
    url: '/makeid-boot/sys/menu/list',
    method: 'get'
  })
}
export function addMenu() {
  return request({
    url: '/makeid-boot/sys/menu/list',
    method: 'get'
  })
}
export function delMenu() {
  return request({
    url: '/makeid-boot/sys/menu/list',
    method: 'get'
  })
}
export function updateMenu() {
  return request({
    url: '/makeid-boot/sys/menu/list',
    method: 'get'
  })
}
