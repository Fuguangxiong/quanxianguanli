<template>
  <div id="UserInformation">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-content-box">
      <div class="pa-content-title">
        <span v-if="isAdd">创建用户</span>
        <span v-if="isEdit">编辑用户</span>
      </div>
      <div class="pa-main-box">
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title pa-required" >账号：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <input v-if="isAdd" type="text" v-model="account" @blur="onCheckAccount" :class="{'pa-errorinput':errorAccount}" @focus="onTipsShow" maxlength="25" ref="account"/>
                <span class="pa-account-tips" v-show="tipsShow">
                  <ul>
                    <li>账号为5-25位字符</li>
                    <li>不允许为纯数字</li>
                    <li>一旦设定无法变更</li>
                  </ul>
                </span>
                <span v-if="isEdit" class="pa-text-info">{{account}}</span>
                <img src="../../publicImg/loading_check.gif" alt="检测中..." v-show="checkingAccount">
                <span class="pa-error-info" v-show="errorAccount">{{errorAccountText}}</span>
                <span class="pa-pass-info" v-show="passAccount">✔ 账号可用</span>
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title pa-required" >手机号：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <input v-if="isAdd" type="text" v-model="phone" @blur="onCheckPhone" :class="{'pa-errorinput':errorPhone}" maxlength="11" ref="phone"/>
                <span v-if="isEdit" class="pa-text-info">{{phone}}</span>
                <img src="../../publicImg/loading_check.gif" alt="检测中..." v-show="checkingPhone">
                <span class="pa-error-info" v-show="errorPhone">{{errorPhoneText}}</span>
                <span class="pa-pass-info" v-show="passPhone">✔ 手机号可用</span>
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title">昵称：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <input type="text" v-model="name" @focus="onGetTip" @blur="onCheckName" :class="{'pa-errorinput':errorName}" maxlength="8" ref="name"/>
                <span class="pa-error-info" v-show="errorName">！请输入正确的昵称</span>
                <span class="pa-account-tips1" v-show="errorNameText">
                  <ul>
                    <li>昵称为2-8位汉字</li>
                  </ul>
                </span>
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title">邮箱：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <input type="text" v-model="email" @blur="onCheckEmail" :class="{'pa-errorinput':errorEmail}" maxlength="50" ref="email"/>
                <!-- <img src="../../publicImg/loading_check.gif" alt="检测中..." v-show="checkingEmail"> -->
                <span class="pa-error-info" v-show="errorEmail">！请输入正确的电子邮箱</span>
                <!-- <span class="pa-pass-info" v-show="passEmail">✔ 电子邮箱地址可用</span> -->
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title">关联号：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <input type="text" v-model="entId" maxlength="20"/>
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title">所在地区：</span></el-col>
            <el-col :span="17">
              <span class="pa-input pa-select">
                <location-select :data='provinceList' :selected="getSelect1" :curvalue="province" preview="省" @change="onSetProvince" @changeSelect = "onSelectChange1"></location-select>
                <location-select :data='cityList' :selected="getSelect2" :curvalue="city" preview="市" @change="onSetCity" @changeSelect = "onSelectChange2"></location-select>
                <location-select :data='regionList' :selected="getSelect3" :curvalue="region" preview="县" @change="onSetRegion" @changeSelect = "onSelectChange3"></location-select>
              </span>
              <span class="pa-error-info" v-show="errorLocation">！请填写完整的地区信息</span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title">地址：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <input type="text" v-model="address" maxlength="30"/>
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title">备注：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <textarea name="remark" maxlength="50" v-model="remark"></textarea>
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-blank"></span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <button type="button" class="btnBlue pa-btn-one" @click="setUserInfo">保存</button>
                <button type="button" class="btnGray pa-btn-two" @click="onCancel">取消</button>
              </span>
            </el-col>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import LocationSelect from '../../publicComponent/LocationSelect'
import ApiClient from '../../publicJs/ApiClient.js'
import TipBoxService from '../../publicJs/TipBoxService'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
import $ from 'jquery'
export default {
  name: 'UserInformation',
  data () {
    return {
      breadcrumb: [
        {name: '用户管理', link: 'UserManagement'},
        {name: '创建用户', link: ''}
      ],
      isAdd: false, // 新建
      isEdit: false, // 编辑
      account: '',
      phone: '',
      name: '',
      email: '',
      entId: '',
      provinceList: '',
      province: '',
      provinceCode: '',
      cityList: '',
      city: '',
      cityCode: '',
      regionList: '',
      region: '',
      regionCode: '',
      address: '',
      remark: '',
      tipsShow: false,
      errorAccount: false,
      errorAccountText: '',
      errorPhone: false,
      errorPhoneText: '',
      errorName: false,
      errorEmail: false,
      errorLocation: false,
      passAccount: false,
      passPhone: false,
      // passEmail: false,
      checkingAccount: false,
      checkingPhone: false,
      // checkingEmail: false,
      getSelect1: false,
      getSelect2: false,
      getSelect3: false,
      userId: '',
      errorNameText: false
    }
  },
  mounted () {
    this.init()
  },
  components: {
    'BreadCrumb': breadCrumb,
    'LocationSelect': LocationSelect
  },
  methods: {
    init () {
      let that = this
      if (that.$route.query.way === 'add') {
        that.breadcrumb = [{name: '用户管理', link: 'UserManagement'},
          {name: '创建用户', link: ''}]
        that.isAdd = true
      } else if (that.$route.query.way === 'edit') {
        that.breadcrumb = [{name: '用户管理', link: 'UserManagement'},
          {name: '编辑用户', link: ''}]
        that.isEdit = true
        that.getUserInfo()
      } else {
        that.$router.push({path: '/UserManagement'})
      }
      that.getProvinceData()
    },
    getUserInfo () {
      let that = this
      that.userId = that.$route.query.userId
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('/user/id/' + that.userId).then(data => {
        that.account = data.account
        that.phone = data.phone
        that.name = data.nickName
        that.email = data.email
        that.entId = data.sourceId
        that.provinceCode = data.province
        that.cityCode = data.city
        that.regionCode = data.region
        that.address = data.address
        that.remark = data.remark
        if (data.province !== '' && data.province !== null) {
          ApiClient.get('/location/code/' + that.provinceCode).then(data => {
            that.province = data.name
          })
          ApiClient.get('/location/code/' + that.cityCode).then(data => {
            that.city = data.name
            that.getCityData()
          })
          ApiClient.get('/location/code/' + that.regionCode).then(data => {
            that.region = data.name
            that.getRegionData()
          })
        }
        LoadingBoxService.close()
      }).catch(e => {
        LoadingBoxService.close()
        TipBoxService.open('数据加载失败', 2)
      })
    },
    setUserInfo () {
      let that = this
      that.errorLocation = false
      if (that.isAdd && (!that.passAccount || !that.passPhone) /* && (!that.passEmail || that.email === '') */) {
        that.onCheckAccount()
        that.onCheckPhone()
        if (that.errorPhone === true) {
          that.$refs.phone.focus()
          $(that.$refs.phone).css('border-color', '#fa3753').css('box-shadow', 'none')
        } else {
          $(that.$refs.phone).css('border', '1px solid #ddd')
        }
        if (that.errorAccount === true) {
          that.$refs.account.focus()
          $(that.$refs.account).css('border-color', '#fa3753').css('box-shadow', 'none')
          that.errorAccount = true
          that.tipsShow = false
          that.errorAccountText = '！请输入正确的账号'
        } else {
          $(that.$refs.account).css('border', '1px solid #ddd')
        }
        /* if (that.email !== '') {
          that.onCheckEmail()
        } */
        return false
      }
      if (that.provinceCode !== '' && that.provinceCode !== null) {
        if (that.cityCode === '' || that.cityCode === null) {
          that.errorLocation = true
          return false
        }
      }
      if (that.errorName === true) {
        that.$refs.name.focus()
        // $(that.$refs.name).css('border-color', '#fa3753').css('box-shadow', 'none')
      }
      if (that.errorEmail === true) {
        that.$refs.email.focus()
        // $(that.$refs.email).css('border-color', '#fa3753').css('box-shadow', 'none')
      }
      if (that.errorAccount || that.errorPhone || that.errorName || that.errorEmail || that.errorLocation) {
        return false
      } else if (that.isAdd) {
        let param = {
          image: 'avatar0.jpg',
          account: that.account,
          phone: that.phone,
          nickName: that.name,
          sourceId: that.entId,
          email: that.email,
          province: that.provinceCode,
          city: that.cityCode,
          region: that.regionCode,
          address: that.address,
          remark: that.remark
        }
        LoadingBoxService.open('请稍候...')
        ApiClient.post('/user/save/', param).then(data => {
          LoadingBoxService.close()
          if (data === true) {
            TipBoxService.open('新建成功', 0)
            that.$router.push({path: '/UserManagement', query: {expand: 'true'}})
          } else {
            TipBoxService.open('新建失败', 2)
          }
        }).catch(e => {
          TipBoxService.open('新建失败', 2)
          LoadingBoxService.close()
        })
      } else if (that.isEdit) {
        let param = {
          // image: 'avatar0.jpg',
          id: that.userId,
          account: that.account,
          phone: that.phone,
          nickName: that.name,
          sourceId: that.entId,
          email: that.email,
          province: that.provinceCode,
          city: that.cityCode,
          region: that.regionCode,
          address: that.address,
          remark: that.remark
        }
        LoadingBoxService.open('请稍候...')
        ApiClient.post('/user/update/', param).then(data => {
          LoadingBoxService.close()
          if (data === true) {
            TipBoxService.open('保存成功', 0)
            that.$router.push({path: '/UserManagement', query: {expand: 'true'}})
          } else {
            TipBoxService.open('保存失败', 2)
          }
        }).catch(e => {
          TipBoxService.open('保存失败', 2)
          LoadingBoxService.close()
        })
      }
    },
    onCancel () {
      this.$router.push({path: '/UserManagement'})
    },
    onTipsShow () {
      this.tipsShow = true
      this.errorAccount = false
      this.passAccount = false
    },
    onCheckAccount () {
      let that = this
      that.tipsShow = false
      that.errorAccount = false
      that.passAccount = false
      let numberReg = /^[0-9]*$/
      let accountReg = /^[0-9a-zA-Z_-]{5,25}$/
      if (that.account.split(' ').length > 1 || numberReg.test(that.account) || accountReg.test(that.account) === false) {
        that.errorAccount = true
        that.errorAccountText = '！请输入正确的账号'
        $(that.$refs.account).css('border-color', '#fa3753').css('box-shadow', 'none')
        return false
      }
      that.checkingAccount = true
      ApiClient.post('/user/account/isRepeated?account=' + that.account).then(data => {
        if (data === false) {
          that.checkingAccount = false
          that.passAccount = true
          $(that.$refs.account).css('border', '1px solid #ddd')
        } else if (data === true) {
          that.checkingAccount = false
          that.errorAccount = true
          that.errorAccountText = '！该账号已被使用'
        }
      }).catch(e => {
        that.checkingAccount = false
      })
    },
    onCheckPhone () {
      let that = this
      that.errorPhone = false
      that.passPhone = false
      let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (phoneReg.test(that.phone) === false) {
        that.errorPhone = true
        that.errorPhoneText = '！请输入正确的手机号码'
        $(that.$refs.phone).css('border-color', '#fa3753').css('box-shadow', 'none')
        return false
      }
      that.checkingPhone = true
      ApiClient.post('/user/phone/isRepeated?phone=' + that.phone).then(data => {
        if (data === false) {
          that.checkingPhone = false
          that.passPhone = true
          $(that.$refs.phone).css('border', '1px solid #ddd')
        } else if (data === true) {
          that.checkingPhone = false
          that.errorPhone = true
          that.errorPhoneText = '！该手机号已被使用'
        }
      }).catch(e => {
        that.checkingPhone = false
      })
    },
    onCheckName () {
      this.errorNameText = false
      let that = this
      that.errorName = false
      let phoneReg = /^[\u4E00-\u9FA5]{2,8}$/
      if (phoneReg.test(that.name) === false && that.name !== '') {
        that.errorName = true
      }
    },
    onCheckEmail () {
      let that = this
      that.errorEmail = false
      let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
      if (emailReg.test(that.email) === false && that.email !== '') {
        that.errorEmail = true
        return false
      }
      /* if (that.email !== '') {
        that.checkingEmail = true
        setTimeout(function () {
          that.checkingEmail = false
          that.passEmail = true
        }, 1200)
      } */
    },
    onSetProvince (item) {
      this.province = item.name
      this.provinceCode = item.code
      this.getCityData()
      this.cityCode = ''
      this.regionList = ''
      this.regionCode = ''
    },
    onSetCity (item) {
      this.city = item.name
      this.cityCode = item.code
      this.getRegionData()
      this.regionCode = ''
    },
    onSetRegion (item) {
      this.region = item.name
      this.regionCode = item.code
    },
    onSelectChange1 () {
      this.getSelect1 = true
      this.getSelect2 = false
      this.getSelect3 = false
    },
    onSelectChange2 () {
      this.getSelect2 = true
      this.getSelect1 = false
      this.getSelect3 = false
    },
    onSelectChange3 () {
      this.getSelect3 = true
      this.getSelect1 = false
      this.getSelect2 = false
    },
    getProvinceData () {
      ApiClient.get('/location/parent/').then(data => {
        this.provinceList = data
      }).catch(e => console.log(e))
    },
    getCityData () {
      ApiClient.get('/location/parent/?code=' + this.provinceCode).then(data => {
        this.cityList = data
      }).catch(e => console.log(e))
    },
    getRegionData () {
      ApiClient.get('/location/parent/?code=' + this.cityCode).then(data => {
        this.regionList = data
      }).catch(e => console.log(e))
    },
    onGetTip () {
      this.errorNameText = true
    }
  }
}
</script>
<style src="../../css/UserInformation.css" scoped>

</style>
