/**
 * Created by dell on 2017/6/27.
 */
import $ from "jquery";
export default {
   open:function (text) {
     if(text==undefined || text==null)
       text="正在加载数据,请稍候...";
     var currentoverlay=$("#loadingOverlay");
     if(currentoverlay.length>0 && currentoverlay!=null)
       currentoverlay.remove();
     var html='<div id="loadingOverlay" class="overlay"><div id="loadingDiv"><span class="public_loadingText">'+text+'</span> </div></div> ';
     $("body").append(html);
   },
  close:function () {
    var overlay=$("#loadingOverlay");
    if(overlay.length>0 && overlay!=null){
      overlay.fadeOut(function () {
        $(this).remove();
      })
    }
  }
}
