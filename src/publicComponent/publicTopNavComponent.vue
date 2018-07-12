<template>
  <div class="publicTopNavComponent">
    <div class="publicTopNavLeftContainer">
      <div class="publicTopNavModularTitle" v-on:click="gotoModularPage">
        <i class="iconfont icon-quanxianguanli"></i>
        <span class="publicTopNavModularTitleText">{{modularName.name}}</span>
      </div>
      <div class="publicTopNavTitle" v-if="!special">
        <i class="publicTopNavTitleImage"></i>
        <span class="publicTopNavTitleText">产品与服务</span>
        <div class="publicTopNavHideBox">
          <div class="publicTopNavHideBoxContent">
            <div v-for="(item,index) in navData" :key="index" class="publicTopNavHideBoxItemContainer">
              <div class="publicTopNavHideBoxItemTitle">{{item.title}}</div>
              <div v-for="(val,index2) in item.list" :key="index + '-' + index2" class="publicTopNavHideBoxItem" v-on:click="listItemClick(val)">{{val.name}}</div>
            </div>
          </div>
          <div class="publicTopNavHideBoxToMarketContainer">
            <span class="publicTopNavHideBoxToMarketBtn" v-on:click="gotoAppMarketHandler">前往应用商场</span>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="publicTopNavSearchContainer" v-bind:class="{show:inputShow}" v-on:mouseenter="searchOverHandler" v-on:mouseleave="searchLeaveHandler">
            <i class="publicTopNavSearchImg" v-on:click="searchClickHandler()"></i>
            <div class="publicTopNavSearchDiv">
                <input class="publicTopNavSearchInput" v-model="searchWord"/>
                <i class="publicTopNavSearchDelet" v-on:click="deletWordHandler"></i>
            </div>
        </div>-->
    <div class="publicTopNavUserContainer">
      <!--<div class="publicTopNavHelpContainer">
        <span class="publicTopNavHelpText" v-on:click.stop="openHelpMenuHandler">服务与帮助</span>
        <transition name="menushow">
          <div class="publicTopNavHelpSecondContainer" v-show="helpMenuShow">
            <div v-for="item in helpSecondList" class="publicTopNavHelpSecondItem" v-on:click="helpClickHandler(item.path)">{{item.name}}</div>
          </div>
        </transition>
      </div>-->
      <!--<span class="publicTopNavMsg" v-on:click="msgClickHandler">
        <span class="publicTopNavMsgTitle">消息</span>
        <span class="publicTopNavMsgTip" v-if="showMsg"></span>
      </span>-->
      <span class="publicTopNavDivision"></span>
      <i class="publicTopNavUserImg" v-if="!hasImage"></i>
      <i class="publicTopNavUserImg" v-if="hasImage" v-bind:style="{backgroundImage:'url(' + userimage + ')'}"></i>
      <div class="publicTopNavUserName" v-on:click.stop="usernameClickHandler">
        <span>{{username}}</span>
        <i class="arrow iconfont icon-xiangxiajiantou1" :class="{arrowUp:userInfoShow}"></i>
        <transition name="menushow">
          <div class="publicTopNavUserNameBox" v-if="userInfoShow">
            <div class="publicTopNavUserInfoContainer">
              <div class="publicTopNavUserInfoImg">
                <i class="publicTopNavUserImg" v-if="!hasImage"></i>
                <i class="publicTopNavUserImg" v-if="hasImage" v-bind:style="{backgroundImage:'url(' + userimage + ')'}"></i>
              </div>
              <div class="publicTopNavUserInfoTextContainer">
                <div class="publicTopNavUserInfoTextLine">
                  <span class="publicTopNavUserInfoText">{{username}}</span>
                  <span class="publicTopNavUserInfoText level" :class="stateClass">{{userState}}</span>
                </div>
                <div class="publicTopNavUserInfoTextLine">
                  <span class="publicTopNavUserInfoText">身份所属:</span>
                  <span class="publicTopNavUserInfoText detailMsg">{{identity}}</span>
                </div>
              </div>
            </div>
            <!-- <div class="publicTopNavUserMenuContainer">
              <div class="publicTopNavUserMenu">
                <div class="publicTopNavUserMenuItem safe" v-on:click="userMenuClickHandler('safe')">安全管理</div>
                <div class="publicTopNavUserMenuItem data" v-on:click="userMenuClickHandler('data')">基本资料</div>
                <div class="publicTopNavUserMenuItem real" v-on:click="userMenuClickHandler('real')">实名认证</div>
                <div class="publicTopNavUserMenuItem create" v-if="!hideMenu" v-on:click="userMenuClickHandler('create')">创建组织</div>
                <div class="publicTopNavUserMenuItem join" v-if="!hideMenu" v-on:click="userMenuClickHandler('join')">加入组织</div>
                <div class="publicTopNavUserMenuItem identity" v-if="!hideMenu" v-on:click="userMenuClickHandler('identity')">身份管理</div>
              </div>
            </div> -->
            <div class="publicTopNavUserExitContainer" v-on:click="exitHandler">
              <i class="publicTopNavUserExitIcon"></i>
              <span class="publicTopNavUserExitText">退出当前账户</span>
            </div>
          </div>
        </transition>
      </div>
      <!--  <i class="publicTopNavUserHelpIcon" title="帮助"></i>
           <i class="publicTopNavUserSetIcon" title="设置"></i> -->
      <!--<i class="publicTopNavUserExitIcon" title="退出" v-on:click="exitHandler"></i>-->
    </div>
    <notice-box
      v-show="isLogout"
      :type="3"
      @closeBox="isLogout = false"
      @confirm="logout"
      :content="'您确认要退出吗？'"
    ></notice-box>
  </div>
</template>
<script>
import $ from 'jquery'
import user from '../publicJs/userService'
// import tip from '../publicJs/NoticeBoxService'
import noticeBox from '../publicComponent/noticeBox'
import constants from '../publicJs/Constants'
// import pathConfig from '../publicJs/publicPathConfig'
export default {
  data: function () {
    return {
      isLogout: false,
      searchWord: '',
      username: '',
      userimage: '',
      hasImage: '',
      inputShow: '',
      helpMenuShow: false,
      userInfoShow: false,
      userState: '',
      identity: '',
      stateClass: '',
      showMsg: false,
      helpSecondList: [
        { name: '入门指南', path: 'intro' },
        { name: '产品文档', path: 'product' },
        { name: '常见问题', path: 'problem' }
      ]
    }
  },
  props: {
    navData: {},
    userchange: {},
    modularName: {},
    hasmsg: {},
    special: {},
    hideMenu: {}
  },
  watch: {
    userchange (val, oldVal) {
      this.initUser()
    },
    hasmsg (val, oldVal) {
      this.showMsg = true
    }
  },
  components: {
    'notice-box': noticeBox
  },
  mounted () {
    this.initUser()
    /* var that = this
    HttpService.get('/pubapi/token/getUserByToken', {}, function (data) {
      that.username = data.results.userInfo.USERNAME
      that.userimage =
        HttpService.apiBaseUrl +
        '/pcapi/enterprise/pcShowImage/avatar?imgPath=' +
        data.results.userInfo.IMAGE +
        '&token=' +
        HttpService.token
      if (that.userimage != '' && that.userimage != undefined) {
        that.hasImage = true
      } else {
        that.hasImage = false
      }
      that.identity = data.results.userInfo.ENTERPRISE_NAME || '个人'
      var status = data.results.userInfo.AUTH_STATUS
      if (status == 'AUTHORIZED') {
        that.userState = '已认证'
        that.stateClass = 'has'
      } else if (status == 'AUTHORIZEDING') {
        that.userState = '认证中'
        that.stateClass = 'ing'
      } else if (status == 'UNAUTHORIZED') {
        that.userState = '未认证'
        that.stateClass = ''
      }
    }) */
  },
  methods: {
    listItemClick (item) {
      window.location.href = item.link
    },
    initUser () {
      var status = decodeURI(user.getInfo('state'))
      this.username = sessionStorage.getItem('account')
      let enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
      this.identity = enterprise.name
      if (status === 'AUTHORIZED') {
        this.userState = '已认证'
        this.stateClass = 'has'
      } else if (status === 'AUTHORIZEDING') {
        this.userState = '认证中'
        this.stateClass = 'ing'
      } else if (status === 'UNAUTHORIZED') {
        this.userState = '未认证'
        this.stateClass = ''
      }
    },
    searchClickHandler () {
      this.$emit('headerSearch', this.searchWord)
    },
    deletWordHandler () {
      this.searchWord = ''
    },
    gotoAppMarketHandler () {
      // window.location.href = pathConfig.APP_MARKET
    },
    exitHandler () {
      this.isLogout = true
    },
    logout () {
      window.location.replace(constants.logoutUrl + '?token=' + sessionStorage.getItem('token'))
      sessionStorage.clear()
      user.deleInfo('tokenId')
    },
    searchOverHandler () {
      this.inputShow = true
    },
    searchLeaveHandler () {
      if (this.searchWord === '') {
        this.inputShow = false
      }
    },
    helpClickHandler (val) {
      console.info('服务于帮助=', val)
      var link = ''
      if (val === 'intro') {
        // link = pathConfig.INTRODUCE_GUIDE
      } else if (val === 'product') {
        // link = pathConfig.PRODUCT_DOCUMENT
      } else if (val === 'problem') {
        // link = pathConfig.COMMON_PROBLEM
      }
      window.location.href = link
    },
    openHelpMenuHandler () {
      var that = this
      var closeMenu
      this.userInfoShow = false
      this.helpMenuShow = !this.helpMenuShow
      if (this.helpMenuShow) {
        $(window)
          .unbind('click')
          .bind(
            'click',
            (closeMenu = function (e) {
              that.helpMenuShow = false
              $(window).unbind('click', closeMenu)
            })
          )
      }
    },
    usernameClickHandler () {
      var that = this
      var closeMenu
      this.helpMenuShow = false
      that.userInfoShow = !that.userInfoShow
      if (this.userInfoShow) {
        $(window)
          .unbind('click')
          .bind(
            'click',
            (closeMenu = function (e) {
              that.userInfoShow = false
              $(window).unbind('click', closeMenu)
            })
          )
      }
    },
    userMenuClickHandler (value) {
      console.info('用户信息弹框=', value)
      var link = ''
      if (value === 'safe') {
        // link = pathConfig.SECURITY_MANAGE
      } else if (value === 'data') {
        // link = pathConfig.BASIC_INFO
      } else if (value === 'real') {
        // link = pathConfig.REAL_NAME_AUTHENTICATION
      } else if (value === 'create') {
        // link = pathConfig.CREATE_ENTERPRISE
      } else if (value === 'join') {
        // link = pathConfig.JOIN_ENTERPRISE
      } else if (value === 'identity') {
        // link = pathConfig.IDENTITY_MANAGE
      }
      window.location.href = link
      // this.$emit('gotoPage', link)
      window.location.reload(true)
    },
    gotoModularPage () {
      // window.location.href = this.modularName.link
      this.$emit('linkchange', this.modularName)
    },
    msgClickHandler () {
      console.info('消息=')
      this.showMsg = false
      // window.location.href = pathConfig.MESSAGE_URL
    }
  }
}
</script>
<style scoped>
.bigSreen2 .publicRightTopContainer {
  left: -150px;
}
.publicTopNavComponent {
  height: 50px;
  background-color: #fff;
  box-shadow: 2px 0px 5px #ccc;
  /* line-height: 50px; */
  font-size: 14px;
  color: #13264e;
}
.publicTopNavLeftContainer {
  position: absolute;
  height: 50px;
  line-height: 50px;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
}
.publicTopNavModularTitle {
  float: left;
  margin-right: 70px;
  cursor: pointer;
}
.publicTopNavModularTitle .icon-quanxianguanli {
  margin-left: 25px;
  margin-right: 10px;
}
.publicTopNavModularTitle:hover {
  color: #55a8fd;
}

.publicTopNavTitle {
  float: left;
  position: relative;
  z-index: 10;
}
.publicTopNavTitleImage {
  width: 16px;
  height: 16px;
  float: left;
  background-image: url("../assets/publicTopNavTitleImg.png");
  margin-top: 17px;
  margin-left: 25px;
  margin-right: 12px;
}
.publicTopNavTitle:hover .publicTopNavHideBox {
  opacity: 1;
  left: 20px;
  visibility: visible;
}
.publicTopNavTitle:hover .publicTopNavTitleImage {
  background-image: url("../assets/publicTopNavTitleImg_hover.png");
}
.publicTopNavTitle:hover .publicTopNavTitleText {
  color: #55a8fd;
}
.publicTopNavHideBox {
  padding-bottom: 20px;
  background-color: #fafafa;
  border-radius: 5px;
  position: absolute;
  top: 50px;
  left: 0px;
  transition: all 0.5s;
  visibility: hidden;
  opacity: 0;
  box-shadow: 0px 2px 5px #ddd;
}
.publicTopNavHideBoxContent {
  white-space: nowrap;
}
.publicTopNavHideBoxItemContainer {
  display: inline-block;
  padding: 10px 40px;
  vertical-align: top;
  border-right: 1px solid #f2f2f2;
  position: relative;
}
.publicTopNavHideBoxItemContainer::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: #56a8fe;
  left: 0;
  top: 0;
  transform: scaleX(0);
  -webkit-transform: scaleX(0);
  -moz-transform: scaleX(0);
  opacity: 0;
  transition: all 0.3s;
}
.publicTopNavHideBoxItemContainer:hover::before {
  transform: scaleX(1);
  -webkit-transform: scaleX(1);
  -moz-transform: scaleX(1);
  opacity: 1;
}
.publicTopNavHideBoxItemContainer:hover .publicTopNavHideBoxItemTitle {
  color: #56a8fe;
}
.publicTopNavHideBoxItemTitle {
  font-size: 16px;
}
.publicTopNavHideBoxItem {
  color: #666;
  font-size: 12px;
  line-height: 35px;
  cursor: pointer;
}
.publicTopNavHideBoxItem:hover {
  color: #56a8fe;
}
.publicTopNavHideBoxToMarketContainer {
  text-align: center;
}
.publicTopNavHideBoxToMarketBtn {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  width: 120px;
  border: 1px solid #56a8fe;
  text-align: center;
  color: #56a8fe;
  cursor: pointer;
}
.publicTopNavHideBoxToMarketBtn:hover {
  background-color: #56a8fe;
  color: #fff;
}

.publicTopNavUserContainer {
  float: right;
  line-height: 50px;
  margin-right: 20px;
}
.publicTopNavDivision {
  width: 1px;
  height: 24px;
  background-color: #666;
  float: left;
  margin: 0 20px;
  margin-top: 14px;
}
.publicTopNavUserImg {
  float: left;
  width: 26px;
  height: 26px;
  background-image: url("../assets/publicTopNavUserIcon.png");
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 15px;
  border-radius: 50%;
  margin-top: 12px;
  background-size: cover;
}
.publicTopNavUserInfoImg .publicTopNavUserImg {
  width: 40px;
  height: 40px;
  margin: 5px 0 0 0;
}
.publicTopNavUserName {
  float: left;
  color: #333;
  font-size: 12px;
  padding-right: 15px;
  /* background-image:url("../publicImages/selectHeader.png"); */
  background-repeat: no-repeat;
  background-position: right center;

  position: relative;
}
.publicTopNavUserName > span {
  cursor: pointer;
}
.publicTopNavUserName > span:hover {
  color: #55a8fd;
}
.publicTopNavUserNameBox {
  position: absolute;
  width: 340px;
  /* height:250px; */
  box-shadow: 0 0 5px #ccc;
  right: 0;
  z-index: 2000;
  background-color: #fff;
}
.publicTopNavUserInfoImg {
  overflow: hidden;
  float: left;
}
.publicTopNavUserInfoContainer {
  overflow: hidden;
  padding: 10px;
}
.publicTopNavUserInfoTextContainer {
  float: left;
  width: 260px;
  margin-left: 20px;
}
.publicTopNavUserInfoTextLine {
  overflow: hidden;
  line-height: 20px;
}
.publicTopNavUserInfoText.level.has {
  background-color: #2dd28a;
}
.publicTopNavUserInfoText {
  float: left;
}
.publicTopNavUserInfoText.level {
  padding: 0 5px;
  color: #fff;
  background-color: #d7d7d7;
  margin-left: 13px;
}
.detailMsg.publicTopNavUserInfoText {
  width: 208px;
  padding-left: 10px;
}
.publicTopNavUserInfoTextLine {
  overflow: hidden;
  line-height: 20px;
}
.publicTopNavUserExitContainer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}
.publicTopNavUserExitContainer:hover {
  color: #55a8fd;
}
.publicTopNavUserExitContainer:hover .publicTopNavUserExitIcon {
  background-image: url("../assets/publicTopNavUserExitIcon_hover.png");
}
.publicTopNavUserExitIcon {
  width: 16px;
  height: 16px;
  background-image: url("../assets/publicTopNavUserExitIcon.png");
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 5px;
  display: inline-block;
  position: relative;
  top: 2px;
}

.arrow {
  position: absolute;
  top: 2px;
  right: 0;
  font-size: 12px;
  transition: transform 0.3s;
}
.arrow.arrowUp {
  transform: rotate(180deg);
}
.publicTopNavUserName > span:hover + .arrow {
  color: #55a8fd;
}
.publicTopNavUserInfoTextLine {
  padding: 2px 0;
}
</style>
