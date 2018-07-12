<template>
  <div id="enterpriseSelect" v-if="isloaded">
    <top-component :username="account"></top-component>
    <div class="am-main-box">
      <div class="title">选择登录身份：</div>
      <ul class="eList clearfix">
        <li :title="item.name" @click="onCheckedEnterprise(item)" class="eItem" :class="{active: checkedEnterpriseId === item.id}" v-for="(item, index) in enterpriseList" :key="index">
          <div class="eIcon" :class="{personIcon: item.name === '个人'}"></div>
          <div class="eName">{{item.name}}</div>
          <i class="iconfont icon-gouxuan"></i>
        </li>
      </ul>
      <div class="button">
        <span class="btnBlue" @click="onLogin">进入</span>
      </div>
    </div>
    <public-bottom-component></public-bottom-component>
  </div>
</template>
<script>
import publicBottomComponent from '../publicComponent/publicBottomComponent.vue'
import topComponent from '../publicComponent/publicTop'
import ApiClient from '../publicJs/ApiClient'
import loading from '../publicJs/LoadingBoxService'
import constants from '../publicJs/Constants'
import userService from '../publicJs/userService.js'
export default {
  name: 'enterpriseSelect',
  components: {
    'top-component': topComponent,
    'public-bottom-component': publicBottomComponent
  },
  data () {
    return {
      enterpriseList: [
      ],
      checkedEnterpriseId: '',
      userId: '',
      account: '',
      token: '',
      isloaded: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      ApiClient.get('getLoginInfo').then(data => {
        console.log(data)
        this.userId = data.userId
        sessionStorage.setItem('account', data.account)
        this.account = data.account
        sessionStorage.setItem('userId', data.userId)
        sessionStorage.setItem('token', data.token)
        userService.storeInfo('tokenId', this.token)
        this.enterpriseList = data.userEnterpriseList
        for (let i = 0; i < this.enterpriseList.length; i++) {
          const el = this.enterpriseList[i]
          if (el.id === 'iscloud') {
            el.name = '个人'
            el.id = ''
            let person = this.enterpriseList.splice(i, 1)[0]
            this.enterpriseList.unshift(person)
            break
          }
        }
        if (this.enterpriseList.length === 1) {
          this.checkedEnterpriseId = this.enterpriseList[0].id
          console.log(this.enterpriseList[0])
          this.onLogin()
        } else {
          this.isloaded = true
        }
      }).catch(e => {
        // loading.close()
        console.log(e.response)
        if (e.response.status === 401 || e.response.status === 403) {
          window.location.replace(constants.loginUrl)
        } else {
          console.error(e)
        }
      })
    },
    onCheckedEnterprise (item) {
      this.checkedEnterpriseId = item.id
    },
    onLogin () {
      let param = {
        userId: this.userId,
        enterpriseId: this.checkedEnterpriseId
      }
      ApiClient.get('org/choiceEnterprise', param).then(data => {
        console.log(data)
        // window.location.href = publicPathConfig.appMarket
        sessionStorage.setItem('enterprise', JSON.stringify(data.currentEnterprise))
        if (this.$route.query.backUrl) {
          window.location.href = this.$route.query.backUrl
        } else {
          this.$router.push({path: '/AuthorityManagement'})
        }
      }).catch(e => {
        console.error('登录失败', e)
      })
    }
  }
}
</script>
<style scoped>
#enterpriseSelect {
  height: 100%;
  position: relative;
  min-width: 1000px;
  min-height: 600px;
}
.am-main-box {
  height: calc(100% - 66px);
  padding: 0 70px;
}
.title {
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  color: #0083ee;
  font-size: 16px;
}
.eList {
  padding: 15px 10px;
  max-height: calc(100% - 150px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 20px;
}
.eItem {
  position: relative;
  float: left;
  width: calc(20% - 16px);
  max-width: 225px;
  margin-right: 19px;
  border: 1px solid #f4f4f4;
  border-radius: 4px;
  box-shadow: 0px 0px 5px 3px rgba(23, 23, 23, 0.15);
  margin-bottom: 20px;
}
.eItem:nth-of-type(5n) {
  margin-right: 0;
}
.eIcon {
  height: 228px;
  width: 100%;
  background-image: url(../publicImg/enterprise.png);
  background-repeat: no-repeat;
  background-position: center center;
  text-align: center;
  cursor: pointer;
}
.personIcon {
  background-image: url(../publicImg/person.png);
}
.eName {
  height: 72px;
  line-height: 72px;
  background-color: #f7f7f7;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.icon-gouxuan {
  position: absolute;
  top: -13px;
  right: -13px;
  font-size: 26px;
  color: #e5e5e5;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  background-color: #fff;
}
.icon-gouxuan:before {
  position: absolute;
  top: -9px;
  left: -2px;
}
.active,
.eItem:hover {
  box-shadow: 0px 0px 5px 3px rgba(61, 130, 234, 0.15);
}
.active .eName,
.eItem:hover .eName {
  color: #fff;
  background-color: #3d82ea;
  border-radius: 0px 0px 4px 4px;
}
.active .icon-gouxuan,
.eItem:hover .icon-gouxuan {
  color: #3d82ea;
}
.button {
  text-align: center;
}
.btnBlue {
  display: inline-block;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
</style>
