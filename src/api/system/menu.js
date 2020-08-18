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
export function getMenuInfo(meunId) {
  return request({
    url: '/makeid-boot/sys/menu/info/' + meunId,
    method: 'get'
  })
}
export function addMenu(data) {
  return request({
    url: '/makeid-boot/sys/menu/save',
    method: 'post',
    data
  })
}
export function delMenu(menuId) {
  return request({
    url: '/makeid-boot/sys/menu/delete/' + menuId,
    method: 'delete'
  })
}
export function updateMenu(data) {
  return request({
    url: '/makeid-boot/sys/menu/update',
    method: 'patch',
    data
  })
}
