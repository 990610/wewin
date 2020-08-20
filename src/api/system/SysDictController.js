
// 引入axios封装文件
import request from "@/utils/request"

function replacePath(template, context) {
  if (!context) return template
  return template.replace(/{(.*?)}/g, (match, key) => context[key.trim()] || "")
}        
            
var IP = "";
var mockIP = "http://service.wewin.com.cn:8071/api/5f34e300c4557651c8ad2034/pc";//模拟IP地址
var backendIP = "http://192.168.10.242:8088";//后台IP地址
// mockIP = backendIP;//切换全局后台IP地址
// backendIP = mockIP;//切换全局模拟IP地址
                
//数据字典 - 删除字典信息
export function sysDictDelete(data) {
  IP = true ? mockIP : backendIP;
  return request({
    url: IP + "/makeid-boot/sys/dict/delete",
    method: "delete",
    data: data
  })
}                   
                                
//数据字典 - 字典详情
export function sysDictInfoId(data) {
  IP = true ? mockIP : backendIP;
  let url = replacePath("/makeid-boot/sys/dict/info/{id}", data)
  return request({
    url: IP + url,
    method: "get",
    data: data
  })
}                   
                                        
//数据字典 - 字典列表分页查询
export function sysDictList(data) {
  IP = true ? mockIP : backendIP;
  return request({
    url: IP + "/makeid-boot/sys/dict/list",
    method: "post",
    data: data
  })
}                   
                                
//数据字典 - 新增字典
export function sysDictSave(data) {
  IP = true ? mockIP : backendIP;
  return request({
    url: IP + "/makeid-boot/sys/dict/save",
    method: "post",
    data: data
  })
}                   
                                
//数据字典 - 修改字典信息
export function sysDictUpdate(data) {
  IP = true ? mockIP : backendIP;
  return request({
    url: IP + "/makeid-boot/sys/dict/update",
    method: "patch",
    data: data
  })
}                   
                                