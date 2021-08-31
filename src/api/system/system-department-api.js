// 引入axios封装文件
import request, { mockIP, backendIP } from "@/utils/request";
// import { replacePath } from '@/utils/index'
var IP = "";
// mockIP = backendIP;//切换全局后台IP地址
// backendIP = mockIP;//切换全局模拟IP地址

// 机构管理 - 删除机构
export function sysDeptDelete(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/dept/delete",
        method: "delete",
        data: data,
    });
}

// 机构管理 - 查询机构详情
export function sysDeptInfoDeptId(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/dept/info",
        method: "get",
        params: data,
    });
}

// 机构管理 - 机构树结构列表
// eslint-disable-next-line quotes
export function sysDeptList(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/dept/list",
        method: "get",
        params: data,
    });
}

// 机构管理 - 新增机构
export function sysDeptSave(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/dept/save",
        method: "post",
        data: data,
    });
}

// 机构管理 - 修改机构信息
export function sysDeptUpdate(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/dept/update",
        method: "patch",
        data: data,
    });
}
