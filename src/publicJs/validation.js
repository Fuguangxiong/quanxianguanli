// 在某节点之后插入节点
function insertAfter (newElement, targetElement) {
  let parent = targetElement.parentNode // 获取目标节点的父级标签
  if (parent.lastChild === targetElement) { // 如果目标节点正好是最后一个节点，使用appendChild插入
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling) // 一般情况下要取得目标节点的下一个节点，再使用insertBefore()方法。
  }
}

// 正则校验
function regularCheck (reg, text) {
  return reg.test(text)
}
// 常用正则表达式
let regList = {
  phone: {
    reg: /^(1[35784]\d{9})$/,
    errorTip: '！手机号码的格式不正确'
  },
  email: {
    reg: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    errorTip: '！电子邮箱的格式不正确'
  },
  officePhone: {
    reg: /^(0\d{2,3}-\d{7,8})$/,
    errorTip: '！电话号码的格式不正确'
  },
  IDCard: {
    reg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    errorTip: '！身份证号码的格式不正确'
  }
}

let main = {}
main.install = function (_vue) {
  let Vue = _vue
  Vue.directive('va', {
    bing: function (el, binging, vnode) {

    },
    inserted: function (el, binging, vnode) {
      let tipInfo = document.createElement('span')
      let parent = el.parentNode
      parent.style.position = 'relative'
      tipInfo.textContent = ''
      tipInfo.style.position = 'absolute'
      tipInfo.style.width = '250px'
      tipInfo.style.height = '100%'
      tipInfo.style.color = '#fa3753'
      insertAfter(tipInfo, el)
      let reg = null
      let errorTip = ''
      if (binging.value && binging.value.reg) {
        reg = binging.value.reg
        errorTip = binging.value.errorTip
      } else if (binging.arg) {
        reg = regList[binging.arg].reg
        errorTip = regList[binging.arg].errorTip
      }
      // console.log(errorTip)
      el.dataset.mustErrorFlag = false // 非空错误标识
      el.dataset.regErrorFlag = false // 正则错误标识
      el.dataset.isEdit = ''
      el.addEventListener('blur', function () {
        tipInfo.style.left = el.offsetLeft + el.offsetWidth + 10 + 'px'
        if (binging.modifiers.must && !el.value.trim()) {
          if (!JSON.parse(el.dataset.mustErrorFlag)) { // 第一次内容为空触发进入，之后内容仍为空不触发
            el.dataset.mustErrorFlag = true
            vnode.context.va_error_flag++
          }
          tipInfo.textContent = '！该选项不能为空'
          el.style.borderColor = '#fa3753'
          return
        }
        if (reg && el.value && !regularCheck(reg, el.value)) {
          if (JSON.parse(el.dataset.mustErrorFlag)) {
            el.dataset.mustErrorFlag = false
            vnode.context.va_error_flag--
          }
          if (!JSON.parse(el.dataset.regErrorFlag)) {
            el.dataset.regErrorFlag = true
            vnode.context.va_error_flag++
          }
          tipInfo.textContent = errorTip
          el.style.borderColor = '#fa3753'
          return
        }
        if (JSON.parse(el.dataset.mustErrorFlag)) {
          el.dataset.mustErrorFlag = false
          vnode.context.va_error_flag--
        }
        if (JSON.parse(el.dataset.regErrorFlag)) {
          el.dataset.regErrorFlag = false
          vnode.context.va_error_flag--
        }
      })
      el.addEventListener('input', function () {
        tipInfo.textContent = ''
        el.style.borderColor = ''
      })
    },
    update: function (el, binding, vnode, oldVnode) {
      if (vnode.context.isEdit !== el.dataset.isEdit) {
        el.dataset.isEdit = vnode.context.isEdit
        el.dataset.regErrorFlag = false
        el.dataset.mustErrorFlag = false
      }
    }
  })
}

export default main
