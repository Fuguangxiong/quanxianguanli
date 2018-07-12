<template>
  <div id="addUserGroup">
    <div class="notice-box">
    </div>
    <div class="notice-box-area">
      <div class="notice-box-area-top">
        <span>新建用户组</span>
        <span @click="closeBox">×</span>
      </div>
      <div class="notice-box-area-center">
        <div v-show="type" class="notice-boxOne">
          <div><i>*</i> 组织名称：</div>
          <div>
          <!--  <el-select v-model="selectData" filterable placeholder="请选择"  @change="selectChange">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>-->
            <select-down :val="systemName" :data="systemList" @change="onChangeSystem" :width="249"></select-down>
          </div>
        </div>
        <div class="notice-boxTwo"><div><i>*</i>用户组名称：</div><div><input type="text" style="padding-left: 5px" v-model="name" maxlength="15"></div></div>
        <div class="notice-boxThree"><div style="vertical-align: top">描述：</div><div><textarea name="" id="" style="padding-left: 5px;resize: none;" v-model="remark" maxlength="50"></textarea></div></div>
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
        orgID: '',
        systemList: [],
        systemName: '',
        // 用户组名称
        name: '',
        // 描述
        remark: ''
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
        //          that.options.unshift({
        //            id: '',
        //            type: 'ENTERPRISE',
        //            name: '',
        //            sourceId: null,
        //            parentId: null,
        //            sort: 0
        //          })
        //          this.selectData = this.options[0].name
        }).catch(e => {
        })
      },
      closeBox () {
        this.$emit('closeBox', '点击叉叉或取消')
        this.name = ''
        this.remark = ''
        this.systemName = ''
      },
      confirm () {
        this.orgID = sessionStorage.getItem('AddUserGroupOrgID')
        // 根据selectData的值确定orgId
        for (var i = 0; i < this.systemList.length; i++) {
          var obj = this.systemList[i]
          console.log(obj, this.systemName, 'obj')
          if (this.systemName === obj.name) {
            this.orgID = obj.id
          }
        }
        if (this.systemName === '' && this.type === true) {
          TipBoxService.open('请选择组织！', 2)
          return
        }
        if (this.name.trim() === '') {
          TipBoxService.open('用户组名称不能为空！', 2)
          return
        }
        this.$emit('confirm', this.orgID, this.name.trim(), this.remark.trim())
        this.name = ''
        this.remark = ''
        this.systemName = ''
      },
      // 选择不同组织组织Id变化
      onChangeSystem (item) {
        this.systemName = item.name
        this.orgId = item.id
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
  .notice-box-area-center>div:nth-child(1){
    margin-top: 22px;
  }
  .notice-box-area-center>div:nth-child(2){
    margin-top: 22px;
  }
  .notice-box-area-center>div:nth-child(3){
    margin-top: 22px;
  }
  .notice-box-area-center>div:nth-child(2) input{
    width: 249px;
    height: 29px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .notice-box-area-center>div:nth-child(3) textarea{
    width: 249px;
    height: 96px;
    border-radius: 4px;
    display: inline-block;
    border: 1px solid #ddd;
    position: relative;
    overflow: hidden;
  }
  /*修改下拉框的默认样式*/
  #addUserGroup .el-select{
    width: 249px;
    height: 29px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
  }
  #addUserGroup .el-input__inner{
    width: 98%;
    height: 100%;
    outline: none;
    border-bottom: none;
    font-size: 12px;
    margin-left: 2px;
    color: black;
  }
  #addUserGroup .el-select .el-input{
    height:99%;
  }
  #addUserGroup .el-select-dropdown{
    min-width: 300px;
  }
  #addUserGroup .el-select .el-input .el-input__inner{
    padding-left: 3px;
  }
  .notice-boxOne,.notice-boxTwo,.notice-boxThree{
    width:100%;
  }
  .notice-boxOne>div:first-child,.notice-boxTwo>div:first-child,.notice-boxThree>div:first-child{
    width:28%;
    text-align: right;
  }
  .notice-boxOne>div:last-child,.notice-boxTwo>div:last-child,.notice-boxThree>div:last-child{
    width:69%;
    text-align: left;
  }
  .notice-boxOne>div:last-child{
    position: relative;
    left:-4px;
  }
</style>
