
// 引入axios封装文件
import request, { mockIP, backendIP } from '@/utils/request'
import { replacePath } from '@/utils/index'
var IP = ''
// backendIP = mockIP;//切换全局模拟IP地址
// 用户管理 - 添加用户
export function sysUserAdd(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/user/add',
    method: 'post',
    data: data
  })
}

// 用户管理 - 删除
export function sysUserDelete(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/user/delete',
    method: 'delete',
    data: data
  })
}

// 用户管理 - 编辑
export function sysUserEdit(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/user/edit',
    method: 'put',
    data: data
  })
}

// 用户管理 - 查询列表分页
export function sysUserPagelist(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/user/pagelist',
    method: 'post',
    data: data
  })
}

// 用户管理 - 修改密码
export function sysUserPassword(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/user/password',
    method: 'post',
    data: data
  })
}

// 用户管理 - 根据用户ID查询用户信息
export function sysUserQueryByIdUserId(data) {
  IP = false ? mockIP : backendIP
  const url = replacePath('/makeid-boot/sys/user/queryById/{userId}', data)
  return request({
    url: IP + url,
    method: 'get',
    data: data
  })
}

// 用户管理 - 登陆后获取用户信息
export function sysUserQueryUserInfo() {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/user/queryUserInfo',
    method: 'get'
  })
}

