/**
 * Created by dell on 2017/6/26.
 */
import $ from 'jquery'
export default {
  timer: null,
  open: function (text, type, pc, time) {
    if ($('#publicTipBox').length > 0) {
      if (this.timer != null) {
        clearTimeout(this.timer)
      }
      $('#publicTipBox').stop().remove()
    }
    var fadeTime = 1000
    if (type == undefined || type == null) {
      type = 0
    }
    var iconClass = 'success'
    var pcTipTitle = 'pcTipTitle'
    if (type == 1) {
      iconClass = 'erro'
    } else if (type == 2) {
      iconClass = 'warn'
      pcTipTitle = 'pcTipTitleRed'
    }
    var htmlStr = '<div style="z-index:999999" class="publicTipBox" id="publicTipBox">' +
      '<i class="publicTipIcon ' + iconClass + '"></i><p class="publicTipText"> ' + text + '</p>' +
      '</div>'
    if (pc) {
      htmlStr = '<div style="z-index:999999" class="pcTipBox" id="publicTipBox">' +
        '<p class=' + pcTipTitle + '>提示</p>' +
        '<i class="publicTipIcon ' + iconClass + '"></i><p class="pcTipText"> ' + text + '</p>' +
        '</div>'
    }
    if (time) {
      fadeTime = time
    }
    $('body').append(htmlStr)
    this.timer = setTimeout(function () {
      $('#publicTipBox').fadeOut(1000, function () {
        $('#publicTipBox').remove()
      })
    }, fadeTime)
  }
}
