// 时间格式化模块
import moment from 'moment'
/**
 *防抖动
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
// 随机生成uuid
export function randomString(len) {
  len = len || 32
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length
  var pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
// url拼接
export function replacePath(template, context) {
  if (!context) return template
  return template.replace(/{(.*?)}/g, (match, key) => context[key.trim()] || '')
}
// 时间格式化 未兼容IE
export function dateFormat(date, fmt) {
  console.log(date)
  let ret = ''
  date = new Date(date)
  console.log('--')
  console.log(date)
  const opt = {
    'y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  console.log(opt)
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      )
    }
  }
  return fmt
}

// 时间格式化兼容ie
export function dateFormatIE(value, fmt) {
  return moment(value).format(fmt || 'YYYY-MM-DD HH:mm:ss')
}

// base64 2次加密
export function encode(str) {
  // 对字符串进行编码
  var encode = encodeURI(str)
  // 对编码的字符串转化base64
  var base64 = btoa(encode)
  base64 = encodeURI(base64)
  base64 = btoa(base64)
  return base64
}
// json转get参数
export function ToPathStr(val) {
  let str = ''
  for (const key in val) {
    str += key + '=' + (val[key] + '') + '&'
  }
  str = str.substr(0, str.length - 1)
  return str
}
// 文件下载 数据+文件名
export function downloadFile(data, name) {
  console.log(name)
  if (!data) {
    return
  }
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', name + '.xlsx')
  document.body.appendChild(link)
  link.click()
};
