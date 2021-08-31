// 时间格式化模块
import moment from "moment";
import { backendIP } from "@/utils/request.js";

/**
 * @desc 函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param func 需要执行的函数
 * @param wait 延迟执行时间（毫秒）
 * @param immediate---true 表立即执行，false 表非立即执行
 * 按钮点击使用方式：myClick：debounce((a,b,c)=>{},wait,immediate)
 **/
export function debounce(func, wait = 500, immediate) {
    let timer;
    return function () {
        const context = this;
        const args = arguments;
        if (timer) clearTimeout(timer);
        if (immediate) {
            var callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, wait);
            if (callNow) func.apply(context, args);
        } else {
            timer = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        }
    };
}
/**
 * @desc 函数节流---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param func 需要执行的函数
 * @param wait 延迟执行时间（毫秒）
 * @param immediate---true 表立即执行，false 表非立即执行
 * 按钮点击使用方式：myClick：throttle((a,b,c)=>{},wait,immediate)
 **/
export function throttle(fn, wait = 500, isImmediate = false) {
    var flag = true;
    // eslint-disable-next-line no-unused-vars
    var timer = null;
    return function () {
        if (flag) {
            // console.log(true)
            isImmediate && fn.apply(this, arguments);
            flag = false;
            timer = setTimeout(() => {
                !isImmediate && fn.apply(this, arguments);
                flag = true;
            }, wait);
        }
    };
}
// 随机生成uuid
export function randomString(len) {
    len = len || 32;
    var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = "";
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
// url拼接
export function replacePath(template, context) {
    if (!context) return template;
    return template.replace(/{(.*?)}/g, (match, key) => context[key.trim()] || "");
}
// 时间格式化兼容ie
export function dateFormatIE(value, fmt) {
    return moment(value).format(fmt || "YYYY-MM-DD HH:mm:ss");
}

// base64 2次加密
export function encode(str) {
    // 对字符串进行编码
    // var encode = encodeURI(str);
    // 对编码的字符串转化base64
    var base64 = window.btoa(str);
    // base64 = encodeURI(base64);
    base64 = window.btoa(base64);
    return base64;
}
// base64 2次解密
export function decode(str) {
    var base64 = window.atob(str);
    // base64 = decodeURI(base64);
    base64 = window.atob(base64);
    // base64 = decodeURI(base64);
    return base64;
}
// json转get参数
export function ToPathStr(val) {
    let str = "";
    for (const key in val) {
        str += key + "=" + (val[key] + "") + "&";
    }
    str = str.substr(0, str.length - 1);
    return str;
}
// Blob流文件下载 数据+文件名
// 注：只适合小文件的下载 大文件下载建议直接走url下载
export function downloadFile(data, name) {
    if (!data) {
        return;
    }
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", name + ".xlsx");
    document.body.appendChild(link);
    link.click();
}
// 文件下载 url 直接访问方式  缺点：无法自定义文件名
// 使用这种方法时 遇到图片，文本如 ['.png', '.bmp', '.png', '.tif', '.jpg', '.jpeg', '.pdf', '.txt'] 等此类文件会直接打开 此时推荐走上面种下载方式
// 如果是大型文件如果是压缩包等推荐使用此方法
// 实际使用中建议二者结合
export function downLoadByURL(url) {
    if (!url) {
        return "";
    }
    const link = document.createElement("a");
    link.style.display = "none";
    // url需要拼接： baseURL + 目录 + url
    link.href = backendIP + "/file/" + url;
    link.setAttribute("download", url.substring(url.indexOf("-")));
    link.setAttribute("target", "_self");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// 综合两种方法下载
export function downLoad(url, RequestFun) {
    if (!url) {
        return "";
    }
    // 文件类型判断
    const type = url.substring(url.lastIndexOf("."));
    const urlList = [".png", ".bmp", ".png", ".tif", ".jpg", ".jpeg", ".pdf", ".txt"];
    // 如果属于图片或者文本则走blob流
    if (urlList.includes(type)) {
        // blob流请求后台接口
        RequestFun({ filePath: url }).then((res) => {
            // blob流文件下载  截取部门做文件名 可自行修改
            downloadFile(res, url.substring(url.indexOf("-")));
        });
    } else {
        // a标签直接下载
        downLoadByURL(url);
    }
}
// 重写console.log 函数，用于生产环境取消console.log
export function rewirteLog() {
    console.log = (function (log) {
        return process.env.NODE_ENV === "development" ? log : function () {};
    })(console.log);
}
