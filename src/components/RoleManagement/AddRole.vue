<template>
  <div id="AddRole">
    <div class="notice-box">
    </div>
    <div class="notice-box-area">
      <div class="notice-box-area-top">
        <span>新建角色</span>
        <span @click="closeBox">×</span>
      </div>
      <div class="notice-box-area-center">
        <el-row v-show="type">
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title pa-required">所属组织：</span></el-col>
            <el-col :span="17" class="pa-input-special">
              <span class="pa-input">
                <select-down :val="systemName" :data="systemList" @change="onChangeSystem" :width="237"></select-down>
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title pa-required">角色名称：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <input type="text" v-model="roleName" maxlength="15"/>
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
      </div>
      <div class="notice-box-area-bottom">
        <div @click="confirm">确认</div>
        <div @click="closeBox">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
  import ApiClient from '../../publicJs/ApiClient.js'
  import TipBoxService from '../../publicJs/TipBoxService.js'
  import selectDown from '../../publicComponent/selectDown'
  export default {
    name: 'addUserGroup',
    props: ['content', 'type'],
    data () {
      return {
        orgId: '',
        options: [],
        selectData: '',
        roleName: '',
        remark: '',
        // 系统名称
        systemName: '',
        systemList: [
        ]
      }
    },
    created () {
    },
    components: {
      'select-down': selectDown
    },
    methods: {
      init () {
        var that = this
        ApiClient.get('/org/getAllEnterprises'
        ).then(data => {
          that.systemList = data
        }).catch(e => {
          console.error(e)
        })
      },
      closeBox () {
        this.$emit('closeBox', '点击叉叉或取消')
        this.roleName = ''
        this.remark = ''
        this.orgId = ''
        this.systemName = ''
      },
      confirm () {
        this.orgId = sessionStorage.getItem('AddUserGroupOrgID')
        for (var i = 0; i < this.systemList.length; i++) {
          var obj = this.systemList[i]
          // console.log(obj, this.systemName, 'obj')
          if (this.systemName === obj.name) {
            this.orgId = obj.id
          }
        }
        if (this.systemName === '' && this.type === true) {
          TipBoxService.open('请选择组织！', 2)
          return
        }
        if (this.roleName.trim() === '') {
          TipBoxService.open('角色名称不能为空！', 2)
          return
        }
        if (/^[\u4E00-\u9FA5]{1,15}$/.test(this.roleName.trim()) === false) {
          TipBoxService.open('角色名只能为汉字！', 2)
          return
        }
        this.$emit('confirm', this.roleName.trim(), this.orgId, this.remark.trim())
        this.roleName = ''
        this.remark = ''
        this.orgId = ''
        this.systemName = ''
      },
      // 选择不同组织组织Id变化
      onChangeSystem (item) {
        this.systemName = item.name
        this.orgId = item.id
        console.log(this.orgId, '1')
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
<style scoped>
  @keyframes vicp {
    0% {
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    100% {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  .notice-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.65);
  }
  .notice-box-area {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 419px;
    height: 326px;
    background-color: #fff;
    z-index: 1000;
    opacity: 1;
    border-radius: 5px;
    -webkit-animation: vicp .12s ease-in;
    animation: vicp .12s ease-in;
  }
  .notice-box-area-top {
    height: 42px;
    background-color: #3d82ea;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .notice-box-area-top span {
    padding: 10px 0 0 8px;
    color: #fff;
    font-size: 14px;
    float: left;
    font-weight: 600;
  }
  .notice-box-area-top span:last-child {
    padding: 0 0 0 0;
    width: 27px;
    height: 100%;
    float: right;
    font-family: SimSun;
    font-size: 23px;
    color: #fff;
    cursor: pointer;
    padding-top: 5px;
    vertical-align: middle;
    font-weight: 600;
  }
  .notice-box-area-center {
    height: 244px;
    overflow: hidden;
    padding-top: 30px;
  }

  .notice-box-area-bottom {
    height: 41px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .notice-box-area-bottom div:first-child {
    width: 50%;
    height: 41px;
    float: left;
    background-color: #3d82ea;
    border-bottom-left-radius: 5px;
    text-align: center;
    line-height: 41px;
    color: #fff;
    font-weight: 400;
    font-size: 14px;
    cursor: pointer;
  }
  .notice-box-area-bottom div:last-child {
    width: 50%;
    height: 41px;
    float: right;
    background-color: #e2e2e2;
    border-bottom-right-radius: 5px;
    text-align: center;
    line-height: 41px;
    color: #fff;
    font-weight: 400;
    font-size: 14px;
    cursor: pointer;
  }
  .notice-box-area-center i{
    font-style: normal;
    color: #fa3753;
    display: inline-block;
    vertical-align: middle;
  }
  .notice-box-area-center div{
    display: inline-block;
  }
  .pa-input-line{
    width: 100%;
    display: inline-block;
    margin-bottom: 10px;
  }
  .pa-input-title{
    float: right;
    padding-right: 5px;
  }
  .pa-required::before{
    content: "*";
    color: #fa3753;
    margin-right: 5px;
  }
  .pa-input input{
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0 6px;
    -moz-outline-radius: 4px;
    position: relative;
    top: -6px;
    width: 80%;
    outline: none;
  }
  .pa-input select{
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0 2px;
    -moz-outline-radius: 4px;
    position: relative;
    top: -6px;
    width: 80%;
    outline: none;
  }
  .pa-input select:focus{
    border: 1px solid #55a8fd;
    box-shadow: 0 0 2px #55a8fd;
  }
  .pa-input input:focus{
    border: 1px solid #55a8fd;
    box-shadow: 0 0 2px #55a8fd;
  }
  .pa-input textarea{
    resize: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 6px 6px;
    -moz-outline-radius: 4px;
    position: relative;
    top: -4px;
    width: 80%;
    height: 96px;
    outline: none;
  }
  .pa-input textarea:focus{
    border: 1px solid #55a8fd;
    box-shadow: 0 0 2px #55a8fd;
  }
  .el-row{
    width: 100%;
  }
  .pa-input-special{
    position: relative;
    top:-7px;
  }
</style>
