<template>
  <div id="EditAPIBox">
    <div class="notice-box">
    </div>
    <div class="notice-box-area">
      <div class="notice-box-area-top">
        <span>{{title}}</span>
        <span @click="closeBox">×</span>
      </div>
      <div class="notice-box-area-center">
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title pa-required">资源名称：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <input maxlength="15" type="text" v-model="data.resourceName">
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title pa-required">操作：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <el-checkbox-group v-model="data.checkList" @change="checkGroup">
                  <el-checkbox label="GET" :disabled="data.isAll"></el-checkbox>
                  <el-checkbox label="PUT" :disabled="data.isAll"></el-checkbox>
                  <el-checkbox label="POST" :disabled="data.isAll"></el-checkbox>
                  <el-checkbox label="DELETE" :disabled="data.isAll"></el-checkbox>
                  <el-checkbox label="全部" @change="checkAll"></el-checkbox>
                </el-checkbox-group>
              </span>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title pa-required">URL：</span></el-col>
            <el-col :span="17">
              <span class="pa-input">
                <input type="text" v-model="data.url">
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
  export default {
    name: 'EditAPIBox',
    props: {
      data: Object,
      isEdit: String
    },
    computed: {
      title () {
        return this.isEdit === 'add' ? '添加API' : '编辑API'
      }
    },
    data () {
      return {
      }
    },
    methods: {
      checkAll (val) {
        if (val) {
          this.data.isAll = true
          this.data.checkList = ['GET', 'POST', 'PUT', 'DELETE', '全部']
        } else {
          this.data.isAll = false
          this.data.checkList = []
        }
      },
      checkGroup (val) {
        if (val.length === 4) {
          this.data.isAll = true
          this.data.checkList = ['GET', 'PUT', 'POST', 'DELETE', '全部']
        }
      },
      closeBox () {
        this.$emit('closeBox', '点击叉叉或取消')
      },
      confirm () {
        this.$emit('confirm', this.data)
      }
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
    height: 270px;
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
    height: 224px;
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
    margin-bottom: 20px;
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
  .pa-input input:focus{
    border: 1px solid #55a8fd;
    box-shadow: 0 0 2px #55a8fd;
  }
  .el-row{
    width: 100%;
  }
  .el-checkbox+.el-checkbox{
    margin-left: 10px;
  }
  .el-checkbox+.el-checkbox:nth-child(5){
    position: relative;
    right: 10px;
  }
  #pa .el-checkbox{
    font-size: 12px
  }
</style>
