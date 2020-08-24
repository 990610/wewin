
// 引入axios封装文件
import request, { backendIP, mockIP } from '@/utils/request'
var IP = ''
// 系统日志 - 系统日志查询
export function sysLogList(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/makeid-boot/sys/log/list',
    method: 'post',
    data: data
  })
}
