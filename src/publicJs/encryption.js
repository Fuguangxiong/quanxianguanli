// 加密
function compile (code) {
  var c = String.fromCharCode(code.charCodeAt(0) + code.length)
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1))
  }
  return escape(c)
}
// 解密
function uncompile (code) {
  code = unescape(code)
  var c = String.fromCharCode(code.charCodeAt(0) - code.length)
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1))
  }
  return c
}
export default {
  encryptionSetItem: function (a, b) { return sessionStorage.setItem(compile(a), compile(b)) },
  encryptionGetItem: function (a) { return uncompile(sessionStorage.getItem(compile(a))) }
}
