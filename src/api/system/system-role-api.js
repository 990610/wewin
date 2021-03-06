/* eslint-disable no-constant-condition */
// 引入axios封装文件
import request, { mockIP, backendIP } from "@/utils/request";
// import { replacePath } from '@/utils/index'
var IP = "";
// mockIP = backendIP // 切换全局后台IP地址
// backendIP = mockIP;//切换全局模拟IP地址

// 角色管理 - 删除角色信息
export function sysRoleDelete(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/role/delete",
        method: "delete",
        data: data,
    });
}

// 角色管理 - 角色信息
export function sysRoleInfoRoleId(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/role/info",
        method: "get",
        params: data,
    });
}

// 角色管理 - 分页角色列表
export function sysRoleList(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/role/list",
        method: "post",
        data: data,
    });
}
// 角色管理 - 分页角色列表
export function sysRoleListAll(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/role/listAll",
        method: "get",
        data: data,
    });
}

// 角色管理 - 新增角色
export function sysRoleSave(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/role/save",
        method: "post",
        data: data,
    });
}

// 角色管理 - 修改角色信息
export function sysRoleUpdate(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/role/update",
        method: "patch",
        data: data,
    });
}
