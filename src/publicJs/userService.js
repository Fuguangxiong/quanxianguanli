/**
 * Created by dell on 2017/9/13.
 */
export default{
  tokenId: null,
  username: null,
  specialId: '1c14f665aa8643c28f899aa9b0efee56', // 默认游客账户请勿修改
  storeInfo: function (name, value, days) {
    var d = new Date()
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
    document.cookie = name + '=' + encodeURI(value) + ';path=/;expires=' + d.toGMTString()
  },
  getInfo: function (name) {
    var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
    return v ? v[2] : null
  },
  deleInfo: function (name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = this.getInfo(name)
    if (cval != null) { document.cookie = name + '=' + cval + ';path=/;expires=' + exp.toGMTString() }
  },
  getTokenId: function () {
    this.tokenId = this.getInfo('tokenId')
    return this.tokenId
  },
  getUsername: function () {
    this.username = this.getInfo('username')
    return decodeURI(this.username)
  },
  getUserImage: function () {
    var image = this.getInfo('image')
    return decodeURI(image)
  },
  setUser: function (tokenId, username, image) {
        // debugger
        // console.info("jkdjfjkdjfd");
        // this.deleInfo("tokenId");
        // this.deleInfo("username");
    this.storeInfo('tokenId', tokenId)
    this.storeInfo('username', username)
    this.storeInfo('image', image)
        // window
  },
  clearUser: function () {
    this.deleInfo('tokenId')
    this.deleInfo('username')
    this.deleInfo('image')
  },
  autoAddTokenId: function () {
        /* if(process.env.NODE_ENV === 'development'){
            this.storeInfo("tokenId",'56982cb2fa5d4117a14c3c2277742f43');
            //document.cookie="tokenId=56982cb2fa5d4117a14c3c2277742f43";
        } */
    var tokenId = this.getTokenId()
    if (tokenId == null) {
      console.info('jdkffjdkfjd')
      this.storeInfo('tokenId', this.specialId)
    }
  }
}
