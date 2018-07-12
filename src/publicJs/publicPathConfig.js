import $ from 'jquery'
$.ajaxSettings.async = false
let serviceManage = ''
let appMarket = ''
let platformAuthority = ''
let resourceCatalog = ''
let platformLoginUrl = ''
let platformUser = ''
let platform = ''
let internalOperation = ''
let companyOperation = ''
/* 公共头部的跳转路径 */
let securityManage = ''
let basicInfo = ''
let realName = ''
let createEnter = ''
let joinEnter = ''
let identityManage = ''
let personConsole = ''
let messagePage = ''
let introduceGuide = ''
let productDocument = ''
let commonProblem = ''
let introduceServer = ''
$.getJSON(process.envConfig.EXTERNAL_CONFIG_URL, function (data) {
  introduceServer = data.INTRODUCE_SERVER
  serviceManage = data.SERVICE_MANAGE
  appMarket = data.APP_MARKET
  platformAuthority = data.PLATFORM_AUTHORITY
  resourceCatalog = data.RESOURCE_CATALOG
  platformLoginUrl = data.PLATFORM_LOGIN_URL
  platformUser = data.PLATFORM_USER
  platform = data.PLATFORM
  internalOperation = data.INTERNAL_OPERATION
  companyOperation = data.COMPANY_OPERATION

  personConsole = data.PERSONAL_CONSOLE
  messagePage = data.MESSAGE_URL
  introduceGuide = data.INTRODUCE_GUIDE
  productDocument = data.PRODUCT_DOCUMENT
  commonProblem = data.COMMON_PROBLEM
  $.ajaxSettings.async = true
})
/* export default {

 /*
 export default {
 SERVICE_MANAGE :env.SERVICE_MANAGE,       //服务管理
 APP_MARKET:env.APP_MARKET, // 应用市场
 PLATFORM_AUTHORITY:env.PLATFORM_AUTHORITY,//部门管理，跳转时需要加tokenId
 RESOURCE_CATALOG:env.RESOURCE_CATALOG,  //资源目录
 PLATFORM_LOGIN_URL: env.PLATFORM_LOGIN_URL,
 PLATFORM_USER: env.PLATFORM_USER,//权限用户图片路径
 PLATFORM:env.PLATFORM //权限管理
 } */
export default {
  SERVICE_MANAGE: serviceManage, // 服务管理
  APP_MARKET: appMarket, // 应用市场
  PLATFORM_AUTHORITY: platformAuthority, // 部门管理，跳转时需要加tokenId
  RESOURCE_CATALOG: resourceCatalog, // 资源目录
  PLATFORM_LOGIN_URL: platformLoginUrl, // 登录页面
  PLATFORM_USER: platformUser, // 权限用户图片路径
  PLATFORM: platform, // 权限管理
  INTERNAL_OPERATION: internalOperation, // 内部运营
  COMPANY_OPERATION: companyOperation,
    /* 公共头部 */
  SECURITY_MANAGE: securityManage, // 安全管理
  BASIC_INFO: basicInfo, // 基本资料
  REAL_NAME_AUTHENTICATION: realName, // 实名认证
  CREATE_ENTERPRISE: createEnter, // 创建组织
  JOIN_ENTERPRISE: joinEnter, // 加入组织
  IDENTITY_MANAGE: identityManage, // 身份管理
  PERSONAL_CONSOLE: personConsole, // 个人工作台
  MESSAGE_URL: messagePage, // 消息
  INTRODUCE_GUIDE: introduceGuide, // 入门指南
  PRODUCT_DOCUMENT: productDocument, // 产品文档
  COMMON_PROBLEM: commonProblem, // 常见问题
  INTRODUCE_SERVER: introduceServer // 宣传页路径
}
