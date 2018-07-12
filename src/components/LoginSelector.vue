<template>
  <div id="LoginSelector">
    <div class="pa-selector">
      <el-carousel :interval="4000" type="card" height="180px" @change="changeSelectCompany" indicator-position="none" arrow="always" :autoplay="autoplay">
        <el-carousel-item v-for="(item, index) in enterpriseList" :key="index">
          <div class="pa-imgbox">
              <img src="../publicImg/saAdminIcon.png" alt="" v-show="item.name==='智享云平台'">
              <img src="../publicImg/entAdminIcon.png" alt="" v-show="item.name!=='智享云平台'">
            </div>
            <h3>{{ item.name }}</h3>
        </el-carousel-item>
      </el-carousel>
      <div class="pa-button">
        <button @click="onLogin()">进入</button>
      </div>
    </div>
    <div class="pa-footer"></div>
  </div>
</template>
<script>
import ApiClient from '../publicJs/ApiClient'
import TipBoxService from '../publicJs/TipBoxService'
import constants from '../publicJs/Constants'
import loading from '../publicJs/LoadingBoxService'
export default {
  name: 'LoginSelector',
  data () {
    return {
      enterpriseList: [],
      autoplay: false,
      nowSelectIndex: 0,
      userId: ''
    }
  },
  mounted () {
    loading.open('加载中...')
    ApiClient.get('getLoginInfo').then(data => {
      console.log(data)
      loading.close()
      this.userId = data.userId
      sessionStorage.setItem('userId', data.userId)
      sessionStorage.setItem('token', data.token)
      this.enterpriseList = data.userEnterpriseList
    }).catch(e => {
      // loading.close()
      // console.log(e.response, 1111111111111111111111)
      if (e.response.status === 401 || e.response.status === 403) {
        window.location.replace(constants.loginUrl)
      } else {
        console.error(e)
      }
    })
  },
  methods: {
    onLogin () {
      let that = this
      let param = {
        userId: this.userId,
        enterpriseId: that.enterpriseList[that.nowSelectIndex].id
      }
      ApiClient.get('org/choiceEnterprise', param).then(data => {
        sessionStorage.setItem('account', data.account)
        sessionStorage.setItem('enterprise', JSON.stringify(data.currentEnterprise))
        if (this.$route.query.backUrl) {
          window.location.href = this.$route.query.backUrl
        } else {
          that.$router.push({name: 'AuthorityManagement'})
        }
      }).catch(e => {
        TipBoxService.open('登录失败', 2)
        console.error(e)
      })
    },
    changeSelectCompany (nowId, preId) {
      this.nowSelectIndex = nowId
    }
  }
}
</script>
<style scoped>
#LoginSelector {
  width: 100%;
  height: 100%;
  min-height: 500px;
  min-width: 1024px;
  background: url("../publicImg/loginbg.png") repeat-x bottom;
  position: relative;
  color: #999;
}
.pa-selector {
  height: 270px;
  width: 480px;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  opacity: 0.8;
  border-radius: 10px;
  box-shadow: 0px 10px 60px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
.pa-imgbox {
  height: 65px;
  width: 65px;
  position: relative;
  top: 60px;
  left: 86px;
  border: 2px solid #16bfeb;
  border-radius: 8px;
  opacity: 0.5;
}
.pa-imgbox img {
  height: 40px;
  width: 40px;
  opacity: 0.5;
  position: absolute;
  top: 10px;
  left: 10px;
}
.pa-footer {
  width: 100%;
  height: 270px;
  background: url("../publicImg/loginbottom.png") bottom center;
  min-width: 1024px;
  display: inline-block;
  position: absolute;
  bottom: 0;
  padding-top: 243px;
  text-align: center;
  z-index: 0;
  color: #838383;
}
.pa-button {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
.pa-button button {
  width: 108px;
  color: #fff;
  background: #5dcbff;
  height: 36px;
  line-height: 36px;
  font-size: 15px;
  border: 0;
  border-radius: 18px;
  padding: 0;
  text-align: center;
  outline: none;
  cursor: pointer;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}
.pa-button button:hover {
  background-color: #40b6ee;
}
.el-carousel__item h3 {
  color: #666;
  font-size: 14px;
  opacity: 1.4;
  line-height: 190px;
  margin: 0;
  text-align: center;
  display: none;
}
.el-carousel .is-active h3 {
  font-size: 15px;
  display: block;
  line-height: 32px;
  position: relative;
  top: 80px;
}
.el-carousel .is-active img {
  opacity: 1;
}
.el-carousel .is-active .imgbox {
  opacity: 1;
}
</style>
