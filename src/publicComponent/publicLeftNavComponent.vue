<template>
  <div class="publicLeftTotalContainer">
    <div class="publicLeftContainer">
      <div class="publicLeftTopContainer" v-on:click="gotoAppMarket"></div>
      <div class="publicLeftNavScaleBtn" v-on:click="scaleClickHandler">
        <div class="publicLeftNavScaleIcon"></div>
      </div>
      <div class="publicLeftBottomContainer">
        <div class="publicLayoutLeftBigContainer">
          <div class="publicLayoutLeftContainer">
            <div v-for="(item,index) in navArr" :key="index" class="publicLayoutLeftNavItem" :title="item.name" v-bind:class="{select:item.active}" v-on:click="navClickHandler(item, index)">
              <i class="publicLeftNavImage" v-bind:class="item.imageClass"></i>
              <span>{{item.name}}</span>
              <span class="publicLayoutLeftNavTriangle"></span>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="publicLeftChildrenContainer" :class="{childrenHide:childrenHide}">
      <div class="publicLeftChildrenHeader"></div>
      <div class="publicLeftChildrenTitle">{{childrenTitle}}</div>
      <div class="publicLeftChildrenItemContainer">
        <div v-for="(val,index2) in childrenArr" :key="index2" :class="{active:val.active}" class="publicLeftChildrenItem" v-on:click="childNavClickHandler(val)">{{val.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
    import $ from 'jquery'
    // import publicPath from '../publicJs/publicPathConfig'
    import Constants from '../publicJs/Constants.js'
    import util from '../publicJs/UtilService'
    export default{
      data: function () {
        return {
          navArr: this.navData,
          childrenArr: [],
          hasClass: false,
          childrenHide: false,
          childrenTitle: '系统配置',
          navIndex: 0
        }
      },

      props: {
        navData: {},
        special: {},
        change: {}
      },
      watch: {
        navData (val, oldVal) {
          this.navArr = val
          var bodyClass = sessionStorage.getItem('bodyClass')
          if (bodyClass === null || bodyClass === undefined || bodyClass === 'false' || bodyClass === false) {
            $('body').removeClass('bigSreen bigSreen2')
            window.iscEvent.emit('menuchange', 'dd')
            this.hasClass = false
          } else {
            window.iscEvent.emit('menuchange', 'dd')
            $('body').addClass('bigSreen')
            this.hasClass = true
          }
          for (let i = 0; i < this.navArr.length; i++) {
            var obj = this.navArr[i]
            console.log(obj.active)
            if (obj.active === true && obj.children !== undefined && obj.children.length > 0) {
              this.childrenTitle = obj.name
              this.childrenArr = obj.children
              $('body').addClass('bigSreen')
              $('body').addClass('bigSreen2')
              window.iscEvent.emit('menuchange', 'dd')
              this.hasClass = true
            }
          }
        },
        change (val, oldVal) {
          this.navArr = this.navData
          var bodyClass = sessionStorage.getItem('bodyClass')
          // console.info("bodyClass=",bodyClass);
    
          if (bodyClass == null || bodyClass === undefined || bodyClass === 'false' || bodyClass === false) {
            // $('body').removeClass('bigSreen')
            $('body').removeClass('bigSreen bigSreen2')
            window.iscEvent.emit('menuchange', 'dd')
            this.hasClass = false
          } else {
            window.iscEvent.emit('menuchange', 'dd')
            $('body').addClass('bigSreen')
            this.hasClass = true
          }
          for (let i = 0; i < this.navArr.length; i++) {
            var obj = this.navArr[i]
            if (obj.active === true && obj.children !== undefined && obj.children.length > 0) {
              this.childrenTitle = obj.name
              this.childrenArr = obj.children
              $('body').addClass('bigSreen')
              $('body').addClass('bigSreen2')
              window.iscEvent.emit('menuchange', 'dd')
              this.hasClass = true
            }
          }
        }
      },

      created () {
        console.info('navArr=', this.navArr)
        window.iscEvent = util.custormEvent()
        window.iscEvent.on('menuchange', function () {
        })
        var bodyClass = sessionStorage.getItem('bodyClass')
        // console.info("bodyClass=",bodyClass);
        if (bodyClass === null || bodyClass === undefined || bodyClass === 'false' || bodyClass === false) {
          $('body').removeClass('bigSreen')
          // $('body').removeClass('bigSreen bigSreen2')
          this.hasClass = false
        } else {
          $('body').addClass('bigSreen')
          this.hasClass = true
        }
        for (let i = 0; i < this.navArr.length; i++) {
          var obj = this.navArr[i]
          // debugger
          if (obj.active === true && obj.children !== undefined && obj.children.length > 0) {
            this.childrenTitle = obj.name
            this.childrenArr = obj.children
            $('body').addClass('bigSreen')
            $('body').addClass('bigSreen2')
            this.hasClass = true
          }
        }
      },
      methods: {
        initMenu () {

        },
        navClickHandler (item, index) {
          var that = this
          this.navIndex = index
          for (var i = 0; i < that.navArr.length; i++) {
            var obj = that.navArr[i]
            if (obj.active === true) {
              obj.active = false
              break
            }
          }
          item.active = true
          if (item.children !== undefined && item.children !== null && item.children.length > 0) {
            // console.info('fdfdfdf=', item.children)
            that.childNavClickHandler(item.children[0])
            if ($('body').hasClass('bigSreen2')) {
              if (item.name !== that.childrenTitle) {
                that.childrenHide = true
                setTimeout(function () {
                  that.childrenTitle = item.name
                  that.childrenArr = item.children
                  that.childrenHide = false
                }, 400)
              }
            } else {
              that.childrenTitle = item.name
              that.childrenArr = item.children
              $('body').addClass('bigSreen bigSreen2')
              window.iscEvent.emit('menuchange', 'dd')
              that.hasClass = true
            }
          } else {
            this.$emit('linkchange', item)
            if ($('body').hasClass('bigSreen2')) {
              $('body').removeClass('bigSreen bigSreen2')
              window.iscEvent.emit('menuchange', 'dd')
              that.hasClass = false
            }
            // 如果是点击系统配置就收起主菜单 弹出二级菜单
            // if (item.link === 'ImportManagement') {
            //   this.scaleClickHandler()
            // }
          }
        },
        childNavClickHandler (item) {
        //   console.info('fdkfjfd=', item)
          // console.info('CHILD', this.navArr[this.navIndex])
          if (!this.navArr[this.navIndex].children) return
          for (var i = 0; i < this.navArr[this.navIndex].children.length; i++) {
            var obj = this.navArr[this.navIndex].children[i]
            if (obj.active === true) {
              obj.active = false
              break
            }
          }
          item.active = true
          this.$emit('linkchange', item)
        },
        scaleClickHandler () {
          var that = this
          that.hasClass = !that.hasClass
          if (that.hasClass) {
            $('body').addClass('bigSreen')
          } else {
            $('body').removeClass('bigSreen bigSreen2')
          }
          window.iscEvent.emit('menuchange', 'dd')
          sessionStorage.setItem('bodyClass', that.hasClass)
        },
        gotoAppMarket () {
          console.info('dfdfdfdf', this.special)
          if (!this.special) {
            window.location.href = Constants.appMarket + '?token=' + sessionStorage.getItem('token')
            // window.location.href = publicPath.APP_MARKET
          } else {
            this.$emit('special', 'gotoHome')
          }
        }

      }
    }
</script>
<style scoped>
.bigSreen .publicLeftTotalContainer {
  width: 50px;
}
.bigSreen .publicLeftTopContainer:after {
  opacity: 0;
}
.bigSreen .publicLeftNavScaleIcon {
  transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
}
.bigSreen .publicLeftContainer {
  width: 50px;
}
.bigSreen .publicRightContainer {
  padding-left: 50px;
}
.bigSreen.bigSreen2 .publicRightContainer {
  padding-left: 200px;
}
.bigSreen .publicLeftNavImage {
  transform: translateX(15px);
}
.bigSreen .select .publicLayoutLeftNavTriangle {
  display: none;
}
.bigSreen .publicLeftTopContainer {
  background-position: 5px center;
}
.publicLeftTotalContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
  z-index: 10;
  transition: width 0.5s;
  -moz-transition: width 0.5s;
}
.publicLeftContainer {
  position: relative;
  background-color: #0c1a35;
  width: 200px;
  height: 100%;
  z-index: 2;
  transition: width 0.5s;
  -moz-transition: width 0.5s;
}
.publicLeftTopContainer {
  width: 100%;
  height: 45px;
  position: absolute;
  background-image: url("../assets/newlogoIcon.png");
  background-repeat: no-repeat;
  background-position: 22px center;
  cursor: pointer;
  transition: all 0.5s;
  -moz-transition: all 0.5s;
}
.publicLeftTopContainer:after {
  content: "";
  position: absolute;
  width: 118px;
  height: 14px;
  background-image: url("../assets/newlogoTextIcon.png");
  background-repeat: no-repeat;
  top: 25px;
  left: 59px;
  transition: all 0.5s;
  -moz-transition: all 0.5s;
}
.publicLeftNavScaleBtn {
  position: absolute;
  width: 100%;
  height: 40px;
  top: 45px;
  right: 0;
  background-color: #102042;
  cursor: pointer;
}
.publicLeftNavScaleIcon {
  width: 14px;
  height: 10px;
  background-image: url("../assets/publicLeftNavBigIcon.png");
  opacity: 0.8;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.5s;
  -moz-transition: all 0.5s;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 15px;
}
.publicLeftNavScaleBtn:hover .publicLeftNavScaleIcon {
  background-image: url("../assets/publicLeftNavBigIcon_hover.png");
}
.publicLeftNavScaleIcon:hover {
  opacity: 1;
}
.publicLeftBottomContainer {
  width: 100%;
  height: 100%;
  padding-top: 85px;
}
.publicLayoutLeftBigContainer {
  width: 100%;
  height: 100%;
  position: relative;
}
.publicLayoutLeftContainer {
  overflow-y: auto;
  height: 100%;
}
.publicLayoutLeftNavItem {
  height: 60px;
  width: 100%;
  color: #fff;
  line-height: 60px;
  overflow: hidden;
  position: relative;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: all 0.8s;
}
.publicLeftNavImage {
  width: 80px;
  height: 60px;
  float: left;
  transform: translateX(40px);
  transition: all 0.5s;
  -moz-transition: all 0.5s;
}
.publicLayoutLeftNavTriangle {
  width: 0;
  height: 0;
  border-width: 7px 7px 7px 0;
  border-style: solid;
  border-color: transparent #eef5fd transparent transparent;
  position: absolute;
  right: 0;
  top: 28px;
  display: none;
}
.select .publicLayoutLeftNavTriangle {
  display: block;
}
.select.publicLayoutLeftNavItem,
.publicLayoutLeftNavItem:hover {
  border-left: 3px solid #fa405c;
  background-color: #13264e;
}

/*二级菜单样式*/
.publicLeftChildrenTitle {
  height: 96px;
  line-height: 96px;
  text-align: center;
  font-size: 16px;
  color: #010101;
  border-bottom: 1px solid #f0f0f0;
  position: absolute;
  width: 100%;
  top: 50px;
}
.publicLeftChildrenContainer {
  width: 200px;
  height: 100%;
  z-index: 1;
  position: absolute;
  top: 0;
  left: -200px;
  transition: all 0.5s;
  -moz-transition: all 0.5s;
  background-color: #f2f2f2;
  padding-top: 146px;
}
.bigSreen2 .publicLeftChildrenContainer {
  left: 0;
}
.bigSreen2 .childrenHide.publicLeftChildrenContainer {
  left: -200px;
}
.publicLeftChildrenItemContainer {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
.publicLeftChildrenItem {
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.publicLeftChildrenItem:hover,
.publicLeftChildrenItem.active {
  background-color: #ffffff;
  color: #55a8fd;
}
.publicLeftNavImage.icon-renqun {
  font-size: 20px;
}
.publicLeftNavImage {
  font-size: 18px;
}
</style>

