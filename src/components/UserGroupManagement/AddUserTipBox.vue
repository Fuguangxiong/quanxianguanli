<template>
  <div id="notice-box">
    <div class="notice-box">
    </div>
    <div class="notice-box-area">
      <div class="notice-box-area-top">
        <span>选择用户 <i>(组织：{{entName}})</i></span>

        <span @click="closeBox">×</span>
      </div>
      <div class="notice-box-area-center">
       <div class="notice-box-area-centerRight">
         <span>用户列表</span>
         <div>
           <div class="pa-search-area"><span>部门：<input type="text" v-model="departmentName" @keyup.enter="search"></span><span>账号：<input type="text" v-model="account" @keyup.enter="search"></span><span>手机号：<input type="text" v-model="phone" @keyup.enter="search"></span><button class="btnBlue" @click="search">搜索</button></div>
           <div class="pa-title-area"><span v-show="!!listData1.length"><el-checkbox v-model="checked" @change="selectAllFunc"></el-checkbox></span><span>账号</span><span>昵称</span><span>手机号</span><span>部门</span></div>
           <div class="pa-detail-areaAll" :class="total <= 10?'pa-detail-areaAllClass' : ''">
           <div class="pa-detail-area" v-for="(item,index) in listData1" :key='index'><span><el-checkbox v-model="list[index]" @change="selectFunc(item)"></el-checkbox></span><span>{{item.account}}</span><span>{{item.nick_name}}</span><span>{{item.phone}}</span><span>{{item.departName}}</span></div>
             <div class="pa-nothing" v-show="!listData1.length">
               <div class="nothing-img"></div>
               <div class="nothing-text">未查找到相关数据</div>
             </div>
           </div>
           <div class="paginationBlock block" v-if="total>10">
             <el-pagination
               v-show="total>10"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page.sync="currentPage3"
               :page-size="pageSize"
               layout="total, prev, pager, next, jumper"
               :total="total">
             </el-pagination>
           </div>
         </div>
       </div>
        <div class="notice-box-area-centerLeft">
          <span>已选</span>
          <div class="pa-user-areaAll">
             <div class="pa-user-area" v-for="(item,index) in rightData" :key='index'><span :title="item.account">{{item.name}}({{item.account}})</span><span @click="deleteUser(item)">×</span></div>
          </div>
        </div>
      </div>
      <div class="notice-box-area-bottom">
        <div @click="confirm">确认</div>
        <div @click="closeBox">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
  import ApiClient from '../../publicJs/ApiClient'
  import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
  export default {
    name: 'noticeBox',
    props: ['type', 'content', 'selectedGroupId', 'reload', 'entName'],
    data () {
      return {
        departmentName: '',
        account: '',
        phone: '',
        checked: false,
        currentPage3: 1,
        pageSize: 10,
        total: 1,
        pageNum: 1,
        listOne: [],
        listData1: [],
        // 储存选中状态的数组
        list: [false, false, false, false, false, false, false, false, false, false],
        // 左侧勾选的数据
        //        leftData: [],
        // 右侧展示的数据
        rightData: [],
        // 储存全选的数据
        selectAllData: []
      }
    },
    created () {
    },
    components: {},
    methods: {
      init () {
        var that = this
        LoadingBoxService.open('数据加载中...')
        ApiClient.get('/userGroup/unJoinUser', {
          userGroupId: that.selectedGroupId,
          departmentName: that.departmentName.trim(),
          account: that.account.trim(),
          phone: that.phone.trim(),
          pageNum: that.pageNum,
          pageSize: that.pageSize
        }
        ).then(data => {
          that.listData1 = data.data
          that.total = data.total
          // 左侧展示页id
          var userIdLeft = []
          // 右侧展示页id
          var userIdRight = []
          for (var i = 0; i < this.listData1.length; i++) {
            var obj = this.listData1[i]
            userIdLeft.push(obj.id)
          }
          for (var i = 0; i < this.rightData.length; i++) {
            var obj = this.rightData[i]
            userIdRight.push(obj.id)
          }

          // 储存右侧每一项数据在左侧数组中的索引
          var indexArr = []
          for (var i = 0; i < userIdRight.length; i++) {
            var obj = userIdRight[i]
            for (var j = 0; j < userIdLeft.length; j++) {
              var obj = userIdLeft[j]
              if (userIdRight[i] === userIdLeft[j]) {
                indexArr.push(j)
              }
            }
          }
          this.list = [false, false, false, false, false, false, false, false, false, false]
          for (var i = 0; i < indexArr.length; i++) {
            var obj = indexArr[i]
            this.list[obj] = true
          }
          // 根据listData1的长度截取this.list的长度
          this.checked = false
          this.list.splice(this.listData1.length, 10)
          LoadingBoxService.close()
        }).catch(e => {
          LoadingBoxService.close()
        })
      },
      closeBox () {
        this.$emit('closeBox', '点击叉叉或取消')
        this.rightData.splice(0, this.rightData.length)
        this.selectAllData = []
        this.checked = false
        this.departmentName = ''
        this.account = ''
        this.phone = ''
      },
      confirm () {
        this.$emit('confirm', this.rightData, this.selectedGroupId)
        this.rightData.splice(0, this.rightData.length)
        this.selectAllData = []
        this.checked = false
        this.departmentName = ''
        this.account = ''
        this.phone = ''
      },
      handleSizeChange (val) {
        //        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        this.pageNum = val
        this.init()
      },
      // 点击单选框事件 判断数组里面有没有用户的信息对象有就删除没有就放到数组里面
      selectFunc (item) {
        if (this.rightData.length === 0) {
          this.rightData.push(item)
        } else {
          // 如果遍历所有的rightData item.userid没找到就放到rightData里面
          if (this.rightData.every(value => value.id !== item.id)) {
            this.rightData.push(item)
          } else {
            // 如果item的id有的话再往里面加就删除
            for (var i = 0; i < this.rightData.length; i++) {
              var obj = this.rightData[i]
              if (this.rightData[i].id === item.id) {
                this.rightData.splice(i, 1)
                break
              }
            }
          }
        }
        console.log(this.rightData, 'this.rightData单选')
      },
      selectAllFunc () {
        // 把selectAllData赋值给rightData
        this.selectAllData = JSON.parse(JSON.stringify(this.rightData))
        if (this.checked === true) {
          // 每次全选的时候先去重  再添加
          for (var i = 0; i < this.listData1.length; i++) {
            var obj = this.listData1[i]
            for (var j = 0; j < this.selectAllData.length; j++) {
              var obj = this.selectAllData[j]
              if (this.selectAllData[j].id === this.listData1[i].id) {
                this.selectAllData.splice(j, 1)
              }
            }
          }
          for (var i = 0; i < this.listData1.length; i++) {
            var obj = this.listData1[i]
            this.selectAllData.push(obj)
          }
          this.checked = false
        } else {
          for (var i = 0; i < this.listData1.length; i++) {
            var obj = this.listData1[i]
            for (var j = 0; j < this.selectAllData.length; j++) {
              var obj = this.selectAllData[j]
              if (this.selectAllData[j].id === this.listData1[i].id) {
                this.selectAllData.splice(j, 1)
              }
            }
          }
          this.checked = true
        }

        // 对象拷贝 把rightData赋值给selectAllData
        this.rightData = JSON.parse(JSON.stringify(this.selectAllData))
        console.log(this.rightData, 'this.rightData全选')
      },
      deleteUser (item) {
        console.log(this.rightData)
        function searchIndex (object, item) {
          for (var i = 0; i < object.length; i++) {
            var obj = object[i]
            if (obj.id === item.id) {
              return i
            }
          }
        }
        var index = searchIndex(this.rightData, item)
        this.rightData.splice(index, 1)
      },
      search () {
        this.init()
      }
    },
    watch: {
      'list': function (val, oldval) {
        val.every(item => item === true) ? this.checked = true : this.checked = false
        if (val == []) {
          this.checked = false
        }
      //        console.log(this.checked, '/checked/')
      },
      'rightData': {
        // 监控右侧数据的变化 改变左侧选中状态
        handler: function (val, oldval) {
        //          console.log(val, 'rightData33333')
          // 左侧展示页id
          var userIdLeft = []
          // 右侧展示页id
          var userIdRight = []
          for (var i = 0; i < this.listData1.length; i++) {
            var obj = this.listData1[i]
            userIdLeft.push(obj.id)
          }
          for (var j = 0; j < val.length; j++) {
            var objk = val[j]
            userIdRight.push(objk.id)
          }
          // 储存右侧每一项数据在左侧数组中的索引
          var indexArr = []
          for (var i = 0; i < userIdRight.length; i++) {
            var obj = userIdRight[i]
            for (var j = 0; j < userIdLeft.length; j++) {
              var obj = userIdLeft[j]
              if (userIdRight[i] === userIdLeft[j]) {
                indexArr.push(j)
              }
            }
          }
          // indexArr去重
          indexArr = [...new Set(indexArr)]
          //          console.log(indexArr, 'indexArr-watch里面')
          for (var i = 0; i < this.list.length; i++) {
            this.$set(this.list, i, false)
          }
          for (var i = 0; i < indexArr.length; i++) {
            var obj = indexArr[i]
            this.$set(this.list, obj, true)
          }
          // 如果全选页的数据少于10条
          this.list.splice(this.listData1.length, 10)
        },
        deep: true
      },
      // 用户组id变化就加载
      'selectedGroupId': function (val, oldval) {
        this.pageNum = 1
        this.init()
      },
      // 每次打开弹框都重新加载未加入用户组的用户列表
      'reload': function (val, oldval) {
        if (val === true) {
          this.pageNum = 1
          this.init()
        }
      }
    },
    mounted () {
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
    width: 840px;
    height: 455px;
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
  .notice-box-area-top span i{
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
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
    height: 372px;
    overflow: hidden;
  }
  .notice-box-area-center-img div {
    width: 96px;
    height: 76px;
    margin: 27px 0 0 167px;
  }
  .notice-box-area-center-msg {
    height: 36px;
    text-align: center;
    line-height: 36px;
    font-size: 14px;
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
  .notice-box-area-centerRight{
    width: 614px;
    height: 344px;
    float:left;
    margin:14px 0 0 20px;
  }
  .notice-box-area-centerLeft{
    height: 344px;
    width: 171px;
    float: right;
    margin:14px 20px 0 0;
  }
  .notice-box-area-centerRight>div{
    width: 100%;
    height: 319px;
    border:1px solid #F8F8F8;
  }
  .notice-box-area-centerLeft>div{
    width:100%;
    height: 319px;
    border:1px solid #F8F8F8;
  }
  .notice-box-area-centerRight>span,.notice-box-area-centerLeft>span{
    font-weight: 600;
    font-size:14px;
    color: #3D82EA;
    font-family: "microsoft yahei", Tahoma, Geneva, sans-serif;
  }
  .pa-search-area{
    height: 45px;
    padding:12px 0 0 9px;
  }
  .pa-search-area input{
    width: 108px;
    height: 28px;
    border:1px solid #EFEFEF;
    border-radius: 3px;
    padding-left: 5px;
  }
  .pa-search-area>span{
    margin-right: 18px;
  }
  .pa-search-area span:last-of-type{
    margin-right: 17px;
  }
  .pa-search-area button{
    width: 68px;
    height: 29px;
    /*background-color: #3D82EA;*/
  }
  .pa-search-area button:focus{
    outline: none;
  }
  .pa-title-area{
    height: 30px;
    margin: 11px 17px 0 12px;
    border-bottom:1px solid #EEEEEE;
  }
  .pa-title-area span:nth-child(1){
    display: inline-block;
    width:5%;
    text-align: center;
  }
  .pa-title-area span:nth-child(2){
    display: inline-block;
    width: 25%;
    text-align: center;
    font-weight: 600;
  }
  .pa-title-area span:nth-child(3){
    display: inline-block;
    width:25%;
    text-align: center;
    font-weight: 600;
  }
  .pa-title-area span:nth-child(4){
    display: inline-block;
    width: 25%;
    text-align: center;
    font-weight: 600;
  }
  .pa-title-area span:nth-child(5){
    display: inline-block;
    width: 20%;
    text-align: center;
    font-weight: 600;
  }
  .pa-detail-area{
    height: 32px;
    margin: 0 17px 0 12px;
    padding-top: 13px;
  }
  .pa-detail-area span:nth-child(1){
    display: inline-block;
    width:5%;
    text-align: center;
  }
  .pa-detail-area span:nth-child(2){
    display: inline-block;
    width: 25%;
    text-align: center;
  }
  .pa-detail-area span:nth-child(3){
    display: inline-block;
    width:25%;
    text-align: center;
  }
  .pa-detail-area span:nth-child(4){
    display: inline-block;
    width: 25%;
    text-align: center;
  }
  .pa-detail-area span:nth-child(5){
    display: inline-block;
    width: 20%;
    text-align: center;
  }
  .pa-detail-areaAll{
    overflow: auto;
    height: 200px;
  }
  .pa-detail-areaAllClass{
    overflow: auto;
    height: 231px;
  }
  .paginationBlock .el-pagination{
    text-align: center;
    height:40px;
  }
  .pa-user-area{
    width: 152px;
    height: 34px;
    background-color: #F7FAFF;
    margin:8px 0 0 9px;
  }
  .pa-user-area span:first-child{
    float: left;
    padding:7px 0 0 7px;
    width:100px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .pa-user-area span:last-child{
    float: right;
    padding:4px 7px 0 0;
    font-family: SimSun;
    font-size: 18px;
    font-weight: 600;
    color: #3D82EA;
    cursor: pointer;
  }
  .pa-user-areaAll{
    overflow: auto;
  }
  #notice-box .pa-nothing .nothing-img{
    margin: 30px auto 10px;
  }
</style>
