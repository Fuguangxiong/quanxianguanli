/**
 * Created by dell on 2017/7/26.
 */
export default {
  removeUrlItem (url, name) {
    var reg1 = new RegExp('(/?|/&)' + name)
    var myUrl = url
    if (myUrl.search(reg1) != -1) {
      removeItem()
    }

    function removeItem () {
      var index = myUrl.search(reg1)
      var end = myUrl.indexOf('&', index)
      var newStr1 = ''
      var newStr2 = ''
      if (end == -1) {
        index = index - 1
      }
      newStr1 = myUrl.substring(0, index)
      if (end != -1) {
        newStr2 = myUrl.substring(end + 1)
      }
      myUrl = newStr1 + newStr2
      if (myUrl.search(reg1) != -1) {
        removeItem()
      }
    }
    return myUrl
  },
  formatDuring (time, format) {
    var t = new Date(parseInt(time))
    var tf = function (i) {
      return (i < 10 ? '0' : '') + i
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
        break
      case 'MM':
        return tf(t.getMonth() + 1)
        break
      case 'mm':
        return tf(t.getMinutes())
        break
      case 'dd':
        return tf(t.getDate())
        break
      case 'HH':
        return tf(t.getHours())
        break
      case 'ss':
        return tf(t.getSeconds())
        break
      }
    })
  },
  filterChildren (data) {
    // window.node1 = data
    let result = []
    for (let i = 0; i < data.length; i++) {
      filterEmptyChildren(data[i])
      result.push(data[i])
    }

    function filterEmptyChildren (value) {
      if (value.hasOwnProperty('children')) {
        if (value.children.length == 0) {
          delete value.children
        } else {
          for (var j = 0; j < value.children.length; j++) {
            filterEmptyChildren(value.children[j])
          }
        }
      }
    }
    return result
  },
  findTreeData (id, tree) {
    // console.info("tree=",tree);
    var rootId = ''
    var returnObj = new Object()
    var find = false
    for (var i = 0; i < tree.length; i++) {
      if (find == true) { break }
      var obj = tree[i]
      rootId = obj.id
      if (id == obj.id) {
        returnObj.name = obj.name
        returnObj.id = obj.id
        returnObj.rootId = rootId
        break
      } else {
        if (obj.children != undefined) {
          if (obj.children.length > 0) {
            findChildrenData(obj.children)
          }
        }
      }
    }

    function findChildrenData (arr) {
      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i]
        if (id == obj.id) {
          returnObj.name = obj.name
          returnObj.id = obj.id
          returnObj.rootId = rootId
          find = true
          break
        } else {
          if (obj.children != undefined) {
            if (obj.children.length > 0) {
              findChildrenData(obj.children)
            }
          }
        }
      }
    }
    return returnObj
  },
  resetDocumentTitle: function (title) {
    document.title = title
  },
  getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  uuid () {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    var uuid = s.join('')
    return uuid
  },
  custormEvent: function () {
    return {
      // 通过on接口监听事件eventName
      // 如果事件eventName被触发，则执行callback回调函数
      on: function (eventName, callback) {
        // 你的代码
        if (!this.handles) {
          // this.handles={};
          Object.defineProperty(this, 'handles', {
            value: {},
            enumerable: false,
            configurable: true,
            writable: true
          })
        }

        if (!this.handles[eventName]) {
          this.handles[eventName] = []
        }
        this.handles[eventName].push(callback)
      },
      // 触发事件 eventName
      emit: function (eventName) {
        // 你的代码
        if (this.handles[arguments[0]]) {
          for (var i = 0; i < this.handles[arguments[0]].length; i++) {
            this.handles[arguments[0]][i](arguments[1])
          }
        }
      }
    }
  }
}
