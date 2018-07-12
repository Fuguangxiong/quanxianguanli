import Constants from './Constants.js'
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'
import Util from './Util'
let isDebug = process.env.NODE_ENV === 'development'
let axios = require('axios')
axios.defaults.withCredentials = true
let apiBaseUrl = Constants.apiBaseUrl
let socketServer = Constants.socketServer
if (apiBaseUrl.endsWith('/')) {
  apiBaseUrl = apiBaseUrl.substring(0, apiBaseUrl.length - 1)
}
function ApiClient () {
  this.config = {
    data: {

    },
    params: {

    },
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  this.setApi = function (api) {
    if (!api.startsWith('/')) {
      api = '/' + api
    }
    this.config.url = apiBaseUrl + api
    return this
  }
  this.addHeader = function (name, value) {
    this.config.headers[name] = value
    return this
  }
  this.call = function (method, args) {
    let callBack = getCallBack(args)
    return this.callApi(method, callBack)
  }
  this.callApi = function (method, callBack) {
    this.config.method = method
    return axios(this.config).then(response => {
      var data = response.data
      if (callBack) {
        callBack(data)
      }
      return getResponseResult(data)
    }).catch(error => {
      if (isDebug) {
        console.error(error)
      }
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        window.location.replace(Constants.loginUrl)
      }
      throw error
    })
  }
  // 上传文件
  this.upload = function (file, data, args) {
    return this.uploadWithName(file, null, data, args)
  }

  // 上传单个文件并指定文件名
  this.uploadWithName = function (file, fileName, data, args) {
    return this.uploadMultiFiles([{
      'name': fileName,
      'file': file
    }], data, args)
  }

  // 上传多个文件 fileAndNames=[{param: param, name:fileName, file:file}]
  this.uploadMultiFiles = function (fileAndNames, data, args) {
    let postData = buildFormDataWith(data)
    if (fileAndNames.length === 1) {
      if (fileAndNames[0].name) {
        postData.append('file', fileAndNames[0].file, fileAndNames[0].name)
      } else {
        postData.append('file', fileAndNames[0].file)
      }
    } else {
      for (var i = 0; i < fileAndNames.length; i++) {
        let param = fileAndNames[i].param
        let fileName = fileAndNames[i].name
        let file = fileAndNames[i].file
        postData.append(param, file, fileName)
      }
    }
    let config = {
      url: this.config.url,
      method: 'post',
      data: postData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    let callBack = getCallBack(args)
    return axios(config).then(response => {
      var data = response.data
      if (callBack) {
        callBack(data)
      }
      return getResponseResult(data)
    }).catch(error => {
      if (isDebug) {
        console.error(error)
      }
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        window.location.replace(Constants.loginUrl)
      }
      throw error
    })
  }
  this.addParam = function (name, value) {
    this.config.params[name] = value
    return this
  }
  this.addParams = function (params) {
    if (!params) return this
    if (typeof params === 'string') {
      this.parseParams(params)
    } else {
      for (var name in params) {
        this.addParam(name, params[name])
      }
    }
    return this
  }
  this.requestData = function (data) {
    if (typeof data === 'string') {
      this.parseParams(data)
    } else if (Util.isArray(data)) {
      this.config.data = data
    } else {
      data = data || {}
      for (var k in data) {
        this.config.data[k] = data[k]
      }
    }
    return this
  }
  this.parseParams = function (params) {
    params.split('&').forEach(pairs => {
      var ps = pairs.split('=')
      if (ps.length === 1) {
        this.config.params[ps[0]] = ''
      } else if (ps.length === 2) {
        this.config.params[ps[0]] = ps[1]
      } else {
        let k = ps.shift()
        this.config.params[k] = ps.join('=')
      }
    })
  }
  this.get = function (api, params, callBack) {
    return this.setApi(api).addParams(params).callApi('get', callBack)
  }
  this.post = function (api, data, callBack) {
    return this.setApi(api).requestData(data).callApi('post', callBack)
  }
  this.put = function (api, data, callBack) {
    return this.setApi(api).requestData(data).callApi('put', callBack)
  }
  this.delete = function (api, params, callBack) {
    return this.setApi(api).addParams(params).callApi('delete', callBack)
  }
}

function getCallBack (args) {
  let callBack = null
  if (args.length > 2) {
    let argv = args[args.length - 1]
    callBack = typeof argv === 'function' ? argv : null
  }
  return callBack
}

function getResponseResult (data) {
  if (data.results === null) {
    if (data.exception) {
      throw data.exception
    }
    return data
  }
  return data.results
}

function buildFormDataWith (data) {
  let postData = new FormData()
  for (let d in data) {
    if (typeof data[d] === 'object') {
      postData.append(d, JSON.stringify(data[d]))
    } else {
      postData.append(d, data[d])
    }
  }
  return postData
}

let StompClient = function (socketUrl) {
  this.isDebug = false
  let client = null
  let url = socketUrl || socketServer
  this.connect = function () {
    let socket = new SockJS(url)
    client = Stomp.over(socket)
    let prototypeDebug = client.debug
    let isDebug = this.isDebug
    client.debug = function (msg) {
      if (isDebug) {
        prototypeDebug(msg)
      }
    }
    return new Promise(function (resolve, reject) {
      client.connect({
      }, resolve, reject)
    })
  }

  let _subscribe = function (destination, callback, headers) {
    client.subscribe(destination, function (message) {
      if (message.body) {
        callback(JSON.parse(message.body))
      }
    }, headers)
  }

  this.subscribe = function (destination, callback, headers) {
    headers = headers || {}
    if (client != null) {
      _subscribe(destination, callback, headers)
    } else {
      this.connect().then(function () {
        _subscribe(destination, callback, headers)
      }, function (error) {
        console.error('connect websocket error to server: ' + socketServer, error)
      })
    }
  }

  this.getClient = function () {
    return client
  }
  this.debug = function (isDebug) {
    this.isDebug = isDebug
    return this
  }
}

function newApiClient (api) {
  return new ApiClient().setApi(api)
}

export default {
  newInstance: function () {
    return new ApiClient()
  },
  get: function (api, params) {
    return newApiClient(api).addParams(params).call('get', arguments)
  },

  post: function (api, data) {
    return newApiClient(api).requestData(data).call('post', arguments)
  },

  put: function (api, data) {
    return newApiClient(api).requestData(data).call('put', arguments)
  },

  delete: function (api, params) {
    return newApiClient(api).addParams(params).call('delete', arguments)
  },
  upload: function (api, file, data) {
    return newApiClient(api).upload(file, data, arguments)
  },
  uploadWithName: function (api, file, fileName, data) {
    return newApiClient(api).uploadWithName(file, fileName, data, arguments)
  },
  uploadMultiFiles: function (api, fileAndNames, data) {
    return newApiClient(api).uploadMultiFiles(fileAndNames, data, arguments)
  },
  websocket: new StompClient(),
  apiBaseUrl,
  getWebsocket: function (socketUrl) {
    return new StompClient(socketUrl)
  }
}
