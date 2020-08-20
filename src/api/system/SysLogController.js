
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
                
//系统日志 - 系统日志查询
export function sysLogList(data) {
  IP = true ? mockIP : backendIP;
  return request({
    url: IP + "/makeid-boot/sys/log/list",
    method: "post",
    data: data
  })
}                   
                                