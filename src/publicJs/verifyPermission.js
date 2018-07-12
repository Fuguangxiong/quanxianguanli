import $ from 'jquery'
import constants from './Constants'
let permissionCode = {flag: true}

let verifyPermission = function (code) {
  if (code) {
    if (permissionCode.rule && permissionCode.rule.length > 0) {
      for (let i = 0; i < permissionCode.rule.length; i++) {
        const el = permissionCode.rule[i]
        if (el === '*') {
          return true
        }
      }
    }
    return permissionCode.codes.indexOf(code) !== -1
  } else {
    return true
  }
}

// apiclient.get('permission/getPermissionCode').then(data => {
//   permissionCode = data
// })
let getPermissionCode = function () {
  $.ajax({
    url: constants.apiBaseUrl + '/permission/getPermissionCode',
    type: 'GET', // GET
    async: false, // 或false,是否异步
    data: {},
    xhrFields: {
      withCredentials: true
    },
    timeout: 5000, // 超时时间
    dataType: 'json', // 返回的数据格式：
    beforeSend: function (xhr) {},
    success: function (data, textStatus, jqXHR) {
      permissionCode = data.results
      // permissionCode.codes.sort()
      // console.log(permissionCode.codes)
    },
    error: function (xhr, textStatus) {
      console.error('获取权限码错误', xhr)
      if (xhr.status === 403 || xhr.status === 401) {
  
      }
    },
    complete: function () {}
  })
  return permissionCode
}
export {verifyPermission, permissionCode, getPermissionCode}
