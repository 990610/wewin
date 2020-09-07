// 引入axios封装文件
import request, { backendIP, mockIP } from '@/utils/request'
// import { replacePath } from '@/utils/index'

var IP = ''
// mockIP = backendIP// 切换全局后台IP地址
// backendIP = mockIP;//切换全局模拟IP地址

// 定时任务 - 删除定时任务
export function jobDeleteJobId(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/job/delete',
    method: 'delete',
    params: data
  })
}

// 定时任务 - 查看定时任务明细
export function jobInfoJobId(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/job/info',
    method: 'get',
    params: data
  })
}

// 定时任务 - 定时任务分页列表
export function jobList(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/job/list',
    method: 'post',
    data: data
  })
}

// 定时任务 - 保存定时任务
export function jobSave(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/job/save',
    method: 'post',
    data: data
  })
}

// 定时任务 - 启动单个定时任务
export function jobStart(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/job/start',
    method: 'get',
    params: data
  })
}

// 定时任务 - 停止单个定时任务
export function jobStop(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/job/stop',
    method: 'get',
    params: data
  })
}

// 定时任务 - 修改定时任务
export function jobUpdate(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/job/update',
    method: 'patch',
    data: data
  })
}
// 任务执行日志 - 日志分页列表
export function sysScheduleLogList(data) {
  IP = false ? mockIP : backendIP
  return request({
    url: IP + '/sys/scheduleLog/list',
    method: 'post',
    data: data
  })
}

