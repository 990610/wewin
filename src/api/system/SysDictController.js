
// 引入axios封装文件
import request, { backendIP, mockIP } from '@/utils/request'
import { replacePath } from '@/utils/index'
var IP = ''
// mockIP = backendIP;//切换全局后台IP地址
// backendIP = mockIP;//切换全局模拟IP地址

// 数据字典 - 删除字典信息
export function sysDictDelete(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/dict/delete',
    method: 'delete',
    data: data
  })
}

// 数据字典 - 字典详情
export function sysDictInfoId(data) {
  IP = false ? mockIP : backendIP
  const url = replacePath('/makeid-boot/sys/dict/info/{id}', data)
  return request({
    url: IP + url,
    method: 'get',
    data: data
  })
}

// 数据字典 - 字典列表分页查询
export function sysDictList(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/dict/list',
    method: 'post',
    data: data
  })
}

// 数据字典 - 新增字典
export function sysDictSave(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/dict/save',
    method: 'post',
    data: data
  })
}

// 数据字典 - 修改字典信息
export function sysDictUpdate(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/dict/update',
    method: 'patch',
    data: data
  })
}

