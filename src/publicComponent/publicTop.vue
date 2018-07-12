<template>
   <div id="publicTop">
     <div class="logo"></div>
     <div class="info">
        <i class="publicTopNavUserImg" v-if="!userimage"></i>
        <i class="publicTopNavUserImg" v-if="userimage" v-bind:style="{backgroundImage:'url(' + userimage + ')'}"></i>
        <div class="publicTopNavUserName" v-on:click.stop="usernameClickHandler">
          <span>{{username | checkUserName}}</span>
          <i class="arrow iconfont icon-xiangxiajiantou1" :class="{arrowUp:userInfoShow}"></i>
          <span class="logout" v-show="userInfoShow" @click="logout">退出</span>
        </div>
     </div>
   </div>
</template>
<script>
import userService from '../publicJs/userService.js'
import Constants from '../publicJs/Constants.js'
export default {
  name: 'publicTop',
  props: {
    userimage: String,
    username: String
  },
  data () {
    return {
      userInfoShow: false
    }
  },
  filters: {
    checkUserName: function (value) {
      var length = value.length
      var mtel,
        strlen = 0,
        strnum
      if (
        length == 11 &&
        /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(
          value
        )
      ) {
        mtel = value.substr(0, 3) + '****' + value.substr(7)
      } else {
        for (var i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            strlen += 2
          } else {
            strlen++
          }
          if (strlen > 10) {
            strnum = i
            break
          }
        }
        strlen > 10 ? (mtel = value.substr(0, strnum) + '...') : (mtel = value)
      }
      return mtel
    }
  },
  methods: {
    usernameClickHandler () {
      this.userInfoShow = !this.userInfoShow
    },
    logout () {
      userService.clearUser()
      window.location.href = Constants.logoutUrl
    }
  }
}
</script>
<style lang="css" scoped>
#publicTop {
  background-color: #0b2752;
  height: 66px;
  line-height: 66px;
}
.logo {
  float: left;
  background-image: url(../publicImg/isCloud.png);
  width: 156px;
  height: 50px;
  margin-top: 8px;
  margin-left: 84px;
}
.info {
  float: right;
  margin-right: 80px;
}
.title {
  color: #f57400;
  font-size: 16px;
  height: 20px;
  border-right: 1px solid #fff;
  padding-right: 18px;
}
.publicTopNavUserImg {
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
  margin-top: 23px;
}
.publicTopNavUserName {
  color: #fff;
}
.icon-xiangxiajiantou1 {
  font-size: 12px;
}
.arrow {
  display: inline-block;
  transition: transform 0.3s;
}
.arrow.arrowUp {
  transform: rotate(180deg);
}
.logout {
  position: absolute;
  top: 42px;
  text-align: center;
  color: #fff;
  width: 100%;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
.publicTopNavUserName{
    float: left;
    font-size: 12px;
    padding-right: 15px;
    /* background-image:url("../publicImages/selectHeader.png"); */
    background-repeat: no-repeat;
    background-position: right center;

    position: relative;
}
.publicTopNavUserName>span{
    cursor: pointer;
}
.publicTopNavUserName>span:hover{
    color: #55a8fd;
}
</style>
