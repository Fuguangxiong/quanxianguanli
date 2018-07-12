/**
 * Created by dell on 2017/7/14.
 */

// type = 0 删除
// type = 1 切换
// type = 2 退出
export default {
  open: function (text, callback, callback2, type) {
    var that = this
    this.close()
    var typeClass = 'popupBoxBody'
    if (type === 1) {
      typeClass = 'popupBoxBody1'
    } else if (type === 2) {
      typeClass = 'popupBoxBody2'
    }
    var html = '<div class="overlay" id="NoticeBoxOverlay"><div class="popupBox"><div class="popupBoxHeader">提示' +
      '<i  id="NoticeBoxOverlayCloseBtn" class="popupBoxCloseIconBtn"></i></div> <div class=' + typeClass + '>' + text + '</div> <div class="popupBoxBtnContainer"> ' + '<div class="popupBoxBtn redBg" id="NoticeBoxOverlayOkBtn">确定</div>' +
      '<div id="NoticeBoxOverlayCancleBtn" class="popupBoxBtn cancelBtn">取消</div></div></div></div>'
    $('body').append(html)
    $('#NoticeBoxOverlayCloseBtn').bind('click', function () {
      that.close()
    })
    $('#NoticeBoxOverlayCancleBtn').bind('click', function () {
      that.close()
      try {
        callback2('cancel')
      } catch (e) {
      }
    })
    $('#NoticeBoxOverlayOkBtn').bind('click', function () {
      try {
        callback('ok')
      } catch (e) {
      }
    })
  },
  close: function () {
    var currentoverlay = $('#NoticeBoxOverlay')
    if (currentoverlay.length > 0 && currentoverlay != null) {
      $('#NoticeBoxOverlayCloseBtn').unbind('click')
      $('#NoticeBoxOverlayCancleBtn').unbind('click')
      $('#NoticeBoxOverlayOkBtn').unbind('click')
      currentoverlay.remove()
    }
  }
}
