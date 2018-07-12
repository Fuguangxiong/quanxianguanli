import $ from 'jquery'
$.ajaxSettings.async = false
let apiBaseUrl = ''
let socketServer = ''
let loginUrl = ''
let logoutUrl = ''
let appMarket = ''
$.getJSON(process.envConfig.EXTERNAL_CONFIG_URL, function (data) {
  apiBaseUrl = data.API_SERVER
  socketServer = apiBaseUrl + '/socket'
  loginUrl = data.LOGIN_URL
  logoutUrl = data.LOGOUT_URL
  appMarket = data.APP_MARKET
  $.ajaxSettings.async = true
})
export default {
  apiBaseUrl: apiBaseUrl,
  socketServer: socketServer,
  loginUrl: loginUrl,
  logoutUrl: logoutUrl,
  appMarket: appMarket
}
