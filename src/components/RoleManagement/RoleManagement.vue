<template>
  <div id="RoleManagement">
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="pa-detail-area">
      <div class="pa-detail-search-area">
        <span v-show="selectshow">组织名称：<select-down :val="systemName" :data="systemList" @change="onChangeSystem"></select-down></span>
        <span>角色名称：<input type="text" v-model="roleName" @keyup.enter="onSearch"></span>
        <button class="btnBlue" @click="onSearch">查找</button>
      </div>
      <div class="pa-detail-list-area">
        <div class="pa-detail-button">
          <span @click="onRoleBoxShow" v-if="verifyPermission('005001')"><i class="iconfont icon-xinzeng"></i> 新增</span>
        </div>
        <div class="pa-detail-list">
          <div class="pa-table-head">
            <span class="pa-table-col1">角色名称</span>
            <span class="pa-table-col2">组织名称</span>
            <span class="pa-table-col3">描述</span>
            <span class="pa-table-col4">操作</span>
          </div>
          <div class="pa-list-content">
            <div class="pa-table-row" v-for="(item,index) in roleList" :key="index" @mouseleave="onOperationOut">
              <span class="pa-table-col1" :title="item.name">{{item.name}}</span>
              <span class="pa-table-col2" :title="item.orgName">{{item.orgName}}</span>
              <span class="pa-table-col3" :title="item.remark">{{item.remark}}</span>
              <span class="pa-table-col4">
                <i class="el-icon-more" @click="onOperationSelected(index)"></i>
              </span>
              <transition name="el-zoom-in-top">
                <div class="pa-operation-area" v-show="operationId === index">
                  <div @click="onGoRoleLink(item)" v-if="verifyPermission('005002')">关联用户</div>
                  <div @click="onGoUserGroupLink(item)" v-show="item.name === '系统超级管理员'?false : true" v-if="verifyPermission('005003')">关联用户组</div>
                  <div @click="onGoAuthorize(item)" v-show="item.name === '系统超级管理员'?false : true" v-if="verifyPermission('005004')">授权</div>
                  <div @click="onNoticeBoxShow(item)" v-if="verifyPermission('005005')">删除</div>
                </div>
              </transition>
            </div>
            <div class="pa-nothing" v-show="!roleList.length">
              <div class="nothing-img"></div>
              <div class="nothing-text">未查找到相关数据</div>
            </div>
            <div class="paginationBlock block" v-show="total>10">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total=total>
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <notice-box
      v-show="showNoticeBox"
      :type="2"
      :content="noticeBoxInfo"
      @closeBox="onCancelNotice"
      @confirm="delRoleData">
    </notice-box>
    <add-role
      v-show="addRoleShow"
      :type="typeShow"
      @closeBox="closeAddRole"
      @confirm="onConfirmAddRole">
    </add-role>
  </div>
</template>
<script>
  import encryption from '../../publicJs/encryption'
  import ApiClient from '../../publicJs/ApiClient.js'
  import selectDown from '../../publicComponent/selectDown'
  import breadCrumb from '../../publicComponent/breadCrumb.vue'
  import NoticeBox from '../../publicComponent/noticeBox'
  import AddRole from './AddRole'
  import TipBoxService from '../../publicJs/TipBoxService.js'
  import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
  import $ from 'jquery'
export default {
    name: 'RoleManagement',
    components: {
      'breadcrumb': breadCrumb,
      'NoticeBox': NoticeBox,
      'addRole': AddRole,
      'select-down': selectDown
    },
    data () {
      return {
        navActiveName: 'RoleManagement',
        breadcrumb: [
          {name: '角色管理', link: 'RoleManagement'}
        ],
        roleList: [],
        selectshow: '',
        operationId: '',
        pageSize: 10,
        currentPage: 1,
        total: 1,
        showNoticeBox: false,
        noticeBoxInfo: '',
        orgId: '',
        addRoleShow: false,
        typeShow: true,
        roleName: '',
        // 系统名称
        systemName: '',
        systemList: [
        ],
        // 角色类型
        roleType: '',
        keyword: 'name asc',
        isSA: false
      }
    },
    mounted () {
      this.getEnterprise()
      this.init()
    },
    methods: {
    // 切换系统
      onChangeSystem (item) {
        this.systemName = item.name
        this.orgId = item.id
      },
      // 获取组织下的角色列表
      init () {
        var that = this
        var enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
        this.isSA = this.$root.$children[0].$children[0].isRoot
        if (this.isSA === true) {
          this.orgId = enterprise.id
          this.typeShow = true
          this.selectshow = true
          LoadingBoxService.open('数据加载中...')
          ApiClient.get('/role/getOrgRole', {
            roleName: that.roleName.trim(),
            pageSize: that.pageSize,
            pageNum: 1,
            keyword: that.keyword
          }
          ).then(data => {
            this.roleList = data.data
            this.total = data.total
            LoadingBoxService.close()
          }).catch(e => {
            LoadingBoxService.close()
          })
        } else {
          this.sortShow = false
          this.orgId = enterprise.id
          sessionStorage.setItem('AddUserGroupOrgID', this.orgId)
          console.log(this.orgId, 'this.orgID3')
          this.selectshow = false
          this.typeShow = false
          LoadingBoxService.open('数据加载中...')
          ApiClient.get('/role/getOrgRole', {
            orgId: that.orgId,
            roleName: that.roleName.trim(),
            keyword: that.keyword,
            pageSize: that.pageSize,
            pageNum: 1
          }
          ).then(data => {
            this.roleList = data.data
            this.total = data.total
            LoadingBoxService.close()
          }).catch(e => {
            LoadingBoxService.close()
          })
        }
      },
      getEnterprise () {
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
      initInfo () {
        var that = this
        var enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
        // var isSA = encryption.encryptionGetItem('isSA')
        if (this.systemName === '全部组织' && enterprise.id === 'iscloud' && enterprise.name === '智享云平台' && this.isSA === true) {
          console.log(3.1)
          LoadingBoxService.open('数据加载中...')
          ApiClient.get('/role/getOrgRole', {
            roleName: that.roleName.trim(),
            pageSize: that.pageSize,
            pageNum: that.pageNum,
            keyword: that.keyword
          }
          ).then(data => {
            this.roleList = data.data
            this.total = data.total
            LoadingBoxService.close()
          }).catch(e => {
            LoadingBoxService.close()
          })
        } else {
          console.log(3.2)
          if (this.systemName === '全部组织') {
            // 企业进来
            that.orgId = enterprise.id
          }
          LoadingBoxService.open('数据加载中...')
          ApiClient.get('/role/getOrgRole', {
            orgId: that.orgId,
            keyword: that.keyword,
            roleName: that.roleName.trim(),
            pageSize: that.pageSize,
            pageNum: that.pageNum
          }
          ).then(data => {
            this.roleList = data.data
            this.total = data.total
            LoadingBoxService.close()
          }).catch(e => {
            LoadingBoxService.close()
          })
        }
      },
      onOperationSelected (index) {
        this.operationId = index
        console.log($('.pa-operation-area').height())
        if ($('.pa-operation-area').height() === 0) {
          $('.pa-operation-area').css('border', 0)
          TipBoxService.open('您无权限进行相关操作！', 2)
        }
      },
      onOperationOut () {
        this.operationId = -1
      },
      handleCurrentChange (val) {
        this.pageNum = val
        this.initInfo()
      },
      onGoRoleLink (value) {
        this.$router.push({path: '/RoleManageRoleLinked', query: {roleId: value.id, roleName: value.name, orgId: value.orgId, orgName: value.orgName}})
      },
      onGoUserGroupLink (value) {
        this.$router.push({path: '/RoleManageUserGroupLinked', query: {roleId: value.id, roleName: value.name}})
      },
      onGoAuthorize (value) {
        sessionStorage.setItem('roleName', value.name)
        sessionStorage.setItem('entName', value.orgName)
        this.$router.push({path: '/RoleAuthorize', query: {roleId: value.id, entId: value.orgId}})
      },
      onCancelNotice () {
        this.showNoticeBox = false
      },
      onNoticeBoxShow (item) {
        this.showNoticeBox = true
        this.noticeBoxInfo = '删除角色将解除该角色下所有用户关联，您确定删除吗？'
        this.delId = item.id
        this.roleType = item.type
        console.log(this.roleType, 'this.roleType')
      },
      delRoleData () {
        this.showNoticeBox = false
        if (this.roleType === 'DEFAULT') {
          TipBoxService.open('系统默认添加的角色，不可删除！', 2)
          return
        }
        LoadingBoxService.open('数据加载中...')
        ApiClient.get('/role/deleteRole', {
          id: this.delId
        }
        ).then(data => {
          if (data === 1) {
            TipBoxService.open('删除角色成功！', 0)
          }
          this.initInfo()
          LoadingBoxService.close()
        }).catch(e => {
          LoadingBoxService.close()
        })
      },
      closeAddRole () {
        this.addRoleShow = false
      },
      onRoleBoxShow () {
        this.addRoleShow = true
      },
      onConfirmAddRole (name, orgID, remark) {
        this.addRoleShow = false
        console.log(name, orgID, remark, 'orgID')
        LoadingBoxService.open('数据加载中...')
        ApiClient.post('/role/saveRole', {
          orgId: orgID === '' ? this.orgId : orgID,
          name: name,
          remark: remark
        }
        ).then(data => {
          if (data === 1) {
            TipBoxService.open('新建角色成功！', 0)
          }
          this.keyword = 'createtime desc'
          this.initInfo()
          LoadingBoxService.close()
        }).catch(e => {
          TipBoxService.open(e.response.data.exception, 2)
          LoadingBoxService.close()
        })
      },
      onSearch () {
        this.initInfo()
      }
    }
}
</script>
<style lang="css" src="../../css/RoleManagement.css" scoped>
</style>
<style>
  #RoleManagement .el-icon-more{
    transform: rotate(90deg);
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    padding: 8px;
  }
  #RoleManagement .el-checkbox-group{
    font-size: 12px;
  }
  #RoleManagement .pa-list-box .el-checkbox__input{
    margin-left: 20%;
  }
  #RoleManagement .el-pagination__editor.el-input .el-input__inner {
    height: 25px;
  }
  #RoleManagement .el-pager li{
    font-weight: normal;
  }
  #RoleManagement .el-input__inner {
    border:none;
    border-radius: 0px;
    width: 65%;
  }
</style>
