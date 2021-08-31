/* eslint-disable no-constant-condition */
// 引入axios封装文件
import request, { backendIP, mockIP } from "@/utils/request";
import { replacePath } from "@/utils/index";
var IP = "";
// mockIP = backendIP// 切换全局后台IP地址
// backendIP = mockIP;//切换全局模拟IP地址

// 系统菜单 - 删除菜单
export function sysMenuDeleteMenuId(data) {
    IP = false ? mockIP : backendIP;
    const url = replacePath("/sys/menu/delete/{menuId}", data);
    return request({
        url: IP + url,
        method: "delete",
        data: data,
    });
}

// 系统菜单 - 菜单详情
export function sysMenuInfoMenuId(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/menu/info",
        method: "get",
        params: data,
    });
}

// 系统菜单 - 获取全量菜单列表
export function sysMenuList() {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/menu/list",
        method: "get",
    });
}

// 系统菜单 - 获取当前登录用户菜单列表
export function sysMenuNav() {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/menu/nav",
        method: "get",
    });
}

// 系统菜单 - 保存菜单信息
export function sysMenuSave(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/menu/save",
        method: "post",
        data: data,
    });
}

// 系统菜单 - 修改菜单信息
export function sysMenuUpdate(data) {
    IP = false ? mockIP : backendIP;
    return request({
        url: IP + "/sys/menu/update",
        method: "patch",
        data: data,
    });
}
