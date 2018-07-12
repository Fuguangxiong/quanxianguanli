<template>
  <div id="UserGroupManagement">
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="pa-detail-area">
      <div class="pa-detail-searchArea">
        <div class="pa-detail-searchAreaOne">
        <!--  <span v-show="selectshow">组织名称：</span>
          <el-select v-model="selectData" filterable placeholder="请选择" style="margin-right: 10%" @change="selectChange" v-show="selectshow">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>-->
          <span v-show="selectshow" class="pa-input-line">组织名称：<select-down :val="systemName" :data="systemList" @change="onChangeSystem"></select-down></span>
          用户组名称：<input type="text" v-model="groupName" @keyup.enter="searchGroup">
          <button class="btnBlue" @click="searchGroup">查找</button>
        </div>
      </div>
      <div class="pa-detail-listArea">
        <div class="pa-detail-listOperation">
          <span @click="addUserGroup" v-if="verifyPermission('002001')"><i class="iconfont icon-xinzeng"></i> 新增</span>
        </div>
        <div class="pa-detail-listAreaBottom">
          <div class="pa-detail-listAreaBottomDetail">
            <span>用户组名称</span><span class="pa-detail-span1" :class="{'wordUp':changeDirect}">用户数<i class="iconfont icon-jiantou-up" @click="OnSort"></i><i class="iconfont icon-jiantou-lower" @click="OnSort"></i></span><span>已关联角色</span><span class="pa-detail-span2" :class="{'wordUp':changeDirectinfo}">所属组织<i class="iconfont icon-jiantou-up" @click="OnSortInfo" v-show="sortShow"></i><i class="iconfont icon-jiantou-lower" @click="OnSortInfo" v-show="sortShow"></i></span><span>描述</span><span>操作</span>
          </div>
          <div class="pa-detail-listAreaBottomDetailinfoGundong">
            <div class="pa-detail-listAreaBottomDetailinfo" v-for="(value,index) in listData" @mouseleave="controlIndex()" :key="value.id">
              <span :title="value.name">{{value.name}}</span><span :title="value.num">{{value.num}}</span><span :title="value.roles.split(',').join('，')">{{value.roles.split(',').join('，')}}</span><span :title="value.orgName">{{value.orgName}}</span><span :title="value.remark">{{value.remark}}</span>
              <span>
            <i class="el-icon-more" @click="operationFunc(index)"></i>
            </span>
              <transition name="el-zoom-in-top">
                <div class="pa-operation-area" v-show="operationShow===index">
                  <div @click="OnGoEditUserGroupMember(value)" v-if="verifyPermission('002002')">编辑成员</div>
                  <div @click="OnGoRoleLinked(value)" v-if="verifyPermission('002003')">关联角色</div>
                  <div @click="OnshowDeleteBox(value)" v-if="verifyPermission('002004')">删除</div>
                </div>
              </transition>
            </div>
            <div class="pa-nothing" v-show="!listData.length">
              <div class="nothing-img"></div>
              <div class="nothing-text">未查找到相关数据</div>
            </div>
            <div class="paginationBlock block">
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
      </div>
    </div>
    <!--添加用户组提示框-->
    <addUserGroup v-show="UserGroupShow" :type="typeShow"  @closeBox="closeBoxUserGroup" @confirm="confirmUserGroup"></addUserGroup>
    <!--删除用户组提示框-->
    <noticeBox v-show="deleteUserShow" :type="2"  @closeBox="closeBoxUserShow" @confirm="confirmUserShow" :content='content_infoshow'></noticeBox>

  </div>
</template>
<script>
  import encryption from '../../publicJs/encryption'
  import selectDown from '../../publicComponent/selectDown'
  import breadCrumb from '../../publicComponent/breadCrumb.vue'
  import noticeBox from '../../publicComponent/noticeBox.vue'
  import addUserGroup from './addUserGroup.vue'
  import ApiClient from '../../publicJs/ApiClient.js'
  import TipBoxService from '../../publicJs/TipBoxService.js'
  import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
  import $ from 'jquery'
  export default {
    name: 'UserGroupManagement',
    components: {
      'breadcrumb': breadCrumb,
      'noticeBox': noticeBox,
      'addUserGroup': addUserGroup,
      'select-down': selectDown
    },
    data () {
      return {
        navActiveName: 'UserGroupManagement',
        sortShow: true,
        total: 1,
        typeShow: false,
        operationShow: -1,
        selectshow: true,
        // 组织id
        orgID: '',
        // 用户组名称
        listData: [],
        groupName: '',
        keyword: 'name desc',
        UserGroupShow: false,
        content_infoshow: '您确认要删除该用户组吗？ ',
        deleteUserShow: false,
        changeDirect: false,
        changeDirectinfo: false,
        currentPage3: 1,
        pageSize: 10,
        pageNum: 1,
        breadcrumb: [
          {name: '用户组管理', link: 'UserGroupManagement'}
        ],
        treeData: [],
        // 下拉框数据结构
        systemList: [],
        systemName: '',
        // 删除用户组
        deleteId: '',
        isSA: false
      }
    },
    methods: {
      // 获取组织下的用户组列表
      init () {
        var that = this
        var enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
        // var isSA = encryption.encryptionGetItem('isSA')
        this.isSA = this.$root.$children[0].$children[0].isRoot
        if (this.isSA === true) {
          this.sortShow = true
          this.orgID = enterprise.id
          this.typeShow = true
          this.selectshow = true
          LoadingBoxService.open('数据加载中...')
          ApiClient.get('/userGroup/getUserGroup', {
            groupName: that.groupName.trim(),
            keyword: that.keyword,
            pageSize: that.pageSize,
            pageNum: 1
          }
          ).then(data => {
            this.listData = data.data
            this.total = data.total
            LoadingBoxService.close()
          }).catch(e => {
            LoadingBoxService.close()
          })
        } else {
          this.sortShow = false
          this.orgID = enterprise.id
          sessionStorage.setItem('AddUserGroupOrgID', this.orgID)
          console.log(this.orgID, 'this.orgID3')
          this.selectshow = false
          this.typeShow = false
          this.keyword = 'num desc'
          LoadingBoxService.open('数据加载中...')
          ApiClient.get('/userGroup/getUserGroup', {
            orgId: that.orgID,
            groupName: that.groupName.trim(),
            keyword: that.keyword,
            pageSize: that.pageSize,
            pageNum: 1
          }
          ).then(data => {
            this.listData = data.data
            this.total = data.total
            LoadingBoxService.close()
          }).catch(e => {
            LoadingBoxService.close()
          })
        }
      },
      // 通过selectData确定orgid传不传
      initInfo () {
        var that = this
        var enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
        // var isSA = encryption.encryptionGetItem('isSA')
        if (this.systemName === '全部组织' && enterprise.id === 'iscloud' && enterprise.name === '智享云平台' && this.isSA === true) {
          console.log(3.1)
          LoadingBoxService.open('数据加载中...')
          ApiClient.get('/userGroup/getUserGroup', {
            groupName: that.groupName.trim(),
            keyword: that.keyword,
            pageSize: that.pageSize,
            pageNum: that.pageNum
          }
          ).then(data => {
            this.listData = data.data
            this.total = data.total
            LoadingBoxService.close()
          }).catch(e => {
            LoadingBoxService.close()
          })
        } else {
          console.log(3.2)
          if (this.systemName === '全部组织') {
            // 企业进来
            that.orgID = enterprise.id
          } else {
            // 系统超级管理员进来
          //            for (var i = 0; i < this.systemList.length; i++) {
          //              var obj = this.systemList[i]
          //              console.log(obj, this.systemName, 'obj')
          //              if (this.systemName === obj.name) {
          //                this.orgID = obj.id
          //              }
          //            }
          }
          LoadingBoxService.open('数据加载中...')
          ApiClient.get('/userGroup/getUserGroup', {
            orgId: that.orgID,
            groupName: that.groupName.trim(),
            keyword: that.keyword,
            pageSize: that.pageSize,
            pageNum: that.pageNum
          }
          ).then(data => {
            this.listData = data.data
            this.total = data.total
            LoadingBoxService.close()
          }).catch(e => {
            LoadingBoxService.close()
          })
        }
      },
      onChangeSystem (item) {
        this.systemName = item.name
        this.orgID = item.id
      },
      // 获取所有企业
      getAllEnterprise () {
        var that = this
        ApiClient.get('/org/getAllEnterprises'
        ).then(data => {
          that.systemList = data
          that.systemList.unshift({
            id: '',
            type: 'ENTERPRISE',
            name: '全部组织',
            sourceId: null,
            parentId: null,
            sort: 0
          })
          this.systemName = that.systemList[0].name
        }).catch(e => {

        })
      },
      operationFunc (index) {
        this.operationShow = index
        console.log($('.pa-operation-area').height())
        if ($('.pa-operation-area').height() === 0) {
          $('.pa-operation-area').css('border', 0)
          TipBoxService.open('您无权限进行相关操作！', 2)
        }
      },
      controlIndex () {
        this.operationShow = -1
      },
      handleSizeChange (val) {
        //        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        this.pageNum = val
        this.initInfo()
      },
      OnSort () {
        this.changeDirect = !this.changeDirect
        console.log(this.changeDirect)
        if (this.changeDirect === false) {
          this.keyword = 'num desc'
        } else {
          this.keyword = 'num asc'
        }
        this.initInfo()
      },
      OnSortInfo () {
        this.changeDirectinfo = !this.changeDirectinfo
        if (this.changeDirectinfo === false) {
          this.keyword = 'name desc'
        } else {
          this.keyword = 'name asc'
        }
        this.initInfo()
      },
      closeBoxUserShow () {
        this.deleteUserShow = false
      },
      confirmUserShow () {
        this.deleteUserShow = false
        LoadingBoxService.open('数据加载中...')
        ApiClient.get('/userGroup/deleteUserGroup', {
          id: this.deleteId
        }
        ).then(data => {
          if (data === 1) {
            TipBoxService.open('删除用户组成功！', 0)
          }
          this.initInfo()
          LoadingBoxService.close()
        }).catch(e => {
          LoadingBoxService.close()
        })
      },
      OnshowDeleteBox (value) {
        this.deleteUserShow = true
        this.deleteId = value.id
      },
      OnGoRoleLinked (value) {
        sessionStorage.setItem('groupName', value.name)
        sessionStorage.setItem('entpriseName', value.orgName)
        this.$router.push({path: '/RoleLinkToUserGroup', query: {userGroupId: value.id, orgId: value.orgId}})
      },
      addUserGroup () {
        this.UserGroupShow = true
      },
      closeBoxUserGroup () {
        this.UserGroupShow = false
      },
      confirmUserGroup (orgID, name, remark) {
        this.UserGroupShow = false
        LoadingBoxService.open('数据加载中...')
        ApiClient.post('/userGroup/saveUserGroup', {
          orgId: orgID === '' ? this.orgID : orgID,
          name: name,
          remark: remark
        }
        ).then(data => {
          if (data === 1) {
            TipBoxService.open('新建用户组成功！', 0)
          }
          this.keyword = 'createtime desc'
          this.initInfo()
          LoadingBoxService.close()
        }).catch(e => {
          TipBoxService.open(e.response.data.exception, 2)
          LoadingBoxService.close()
        })
      },
      selectChange (val) {
      },
      OnGoEditUserGroupMember (value) {
        this.$router.push({path: '/EditUserGroupMember', query: {userGroupId: value.id, orgId: value.orgId}})
      },
      searchGroup () {
        this.initInfo()
      }
    },
    mounted () {
      this.init()
      this.getAllEnterprise()
    }
  }
</script>
<style src="../../css/UserGroupManagement.css" scoped>

</style>
<style lang="css">
  /* 修改树的默认样式 */
  #UserGroupManagement .el-tree {
    color: #2a2a2a;
  }
  #UserGroupManagement .el-tree-node__label {
    font-size: 12px;
    width: 100%;
  }
  #UserGroupManagement .el-tree-node__expand-icon {
    font-size: 18px;
    color: #9a9a9a;
  }
  #UserGroupManagement .is-leaf {
    visibility: hidden;
  }
  #UserGroupManagement .el-tree-node__content {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
  #UserGroupManagement .el-input__inner {
    border: 1px solid #dcdfe6;
    border-top: none;
    border-right: none;
    border-left: none;
    border-radius: 0px;
    width: 65%;
  }
  #UserGroupManagement .el-pagination__editor.el-input .el-input__inner {
    height: 25px;
  }
  #UserGroupManagement .el-tree .el-tree-node__children .el-tree-node__content {
    display: block;
    font-weight: 500;
  }
  #UserGroupManagement .el-pager li {
    font-weight: normal;
  }
  #UserGroupManagement .el-tree > .el-tree-node {
    border-bottom: 1px dashed #EEEEEE;
    padding-bottom: 4px;
  }
  #UserGroupManagement .el-tree > .el-tree-node:last-child {
    border-bottom: 0 dashed red;
    padding-bottom: 4px;
  }
  /*修改下拉框的默认样式*/
  #UserGroupManagement .el-select {
    width: 30%;
    height: 28px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  #UserGroupManagement .el-input__inner {
    width: 98%;
    height: 100%;
    outline: none;
    border-bottom: none;
    font-size: 12px;
    margin-left: 2px;
    color: black;
  }
  #UserGroupManagement .el-select .el-input {
    height: 99%;
  }
  #UserGroupManagement .el-select-dropdown {
    min-width: 300px;
  }
   .el-scrollbar .el-select-dropdown__item {
    font-size: 12px;
  }
  #UserGroupManagement .el-select .el-input .el-input__inner{
    padding-left: 3px;
  }
  #UserGroupManagement .el-input__suffix {
    right: -3px;
  }
</style>
