import $ from 'jquery'
require('jquery.cookie')

String.prototype.format = function () {
  let s = this
  let args = arguments
  if (args.length === 0) return s
  if (args.length === 1) {
    let arg = args[0]
    if (isArray(arg)) {
      for (let i = 0; i < arg.length; i++) {
        s = s.replace(new RegExp('\\{(' + i + ')?\\}', 'g'), arg[i])
      }
    } else if (typeof arg === 'object') {
      for (let k in arg) {
        s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), arg[k])
      }
    } else {
      s = s.replace(new RegExp('\\{(0)?\\}', 'g'), args[0])
    }
  } else {
    for (let i = 0; i < args.length; i++) {
      s = s.replace(new RegExp('\\{(' + i + ')?\\}', 'g'), args[i])
    }
  }
  return s
}
let StrFormat = function () {
  let str = arguments[0]
  let args
  if (arguments.length > 2) {
    args = []
    for (let i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i]
    }
  } else {
    args = arguments[1]
  }
  return String(str).format(args)
}

let isArray = function (obj) {
  return Array.isArray(obj) || Object.prototype.toString.call(obj) === '[object Array]'
}

let isObject = function (obj) {
  let type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

let isDate = function (val) {
  return Object.prototype.toString.call(val) === '[object Date]'
}

let isFunction = function (val) {
  return Object.prototype.toString.call(val) === '[object Function]'
}

let isString = function (val) {
  return Object.prototype.toString.call(val) === '[object String]'
}

let isNumber = function (val) {
  return Object.prototype.toString.call(val) === '[object Number]'
}

let getId = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
let trim = function (val) {
  return val.replace(/(^\s*)|(\s*$)/g, '')
}
export default {
  getId: getId,
  isArray: isArray,
  isObject: isObject,
  isDate: isDate,
  isFunction: isFunction,
  isString: isString,
  isNumber: isNumber,
  strFormat: StrFormat,
  trim: trim,
  sf (str, args) {
    return StrFormat(str, args)
  },
  getToken () {
    let token = $.cookie('tokenId')
    if (token && token !== 'null') {
      return token
    }
    return this.getParameterByName('token') || ''
  },
  setCookieWithToken (token) {
    // let h = 1
    // let time = new Date()
    // time.setTime(time.getTime() + h * 60 * 60 * 1000)
    $.cookie('tokenId', token, {
      path: '/' /*, expires: time */
    })
  },
  getParameterByName (name) {
    name = name.replace(/\[/g, '\\[').replace(/\]/g, '\\]')
    let match = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.search)
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
  }
}
