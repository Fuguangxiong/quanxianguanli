<template>
  <div id="RoleManageUserGroupLinked">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-linked-box">
      <div class="pa-linked-box-title">已关联用户组列表<span>（角色：{{role}}）</span></div>
       <span class="pa-link-delete" @click="OnDeleteSome">
        <i class="iconfont icon-piliangshanchu"></i>
        <span class="pa-add-text">批量移除</span>
      </span>
      <span class="pa-link-add" @click="showAddBox">
        <i class="iconfont icon-xinzeng"></i>
        <span class="pa-add-text">新增</span>
      </span>
      <div class="pa-linked-table">
        <div class="pa-table-head">
          <span class="pa-table-col1"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox></span>
          <span class="pa-table-col2">用户组名称</span>
          <span class="pa-table-col3">组织</span>
          <span class="pa-table-col4">描述</span>
          <span class="pa-table-col5">操作</span>
        </div>

        <div class="pa-table-body">
           <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
          <div class="pa-table-row" v-for="(value,index) in linkedData" :key="value.id">
            <span class="pa-table-col1"> <el-checkbox :label="value.id" :key="value.id" ></el-checkbox></span>
            <span class="pa-table-col2" :title="value.name">{{value.name}}</span>
            <span class="pa-table-col3" :title="value.orgName">{{value.orgName}}</span>
            <span class="pa-table-col4" :title="value.remark">{{value.remark}}</span>
            <span class="pa-table-col5">
              <i class="iconfont icon-yichu"  title="移除" @click="OnRemove(value)"></i>
            </span>
          </div>
          </el-checkbox-group>
          <div class="pa-nothing" v-show="!linkedData.length">
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
    <notice-box v-show="showNoticeBox" :type="4" :content="noticeBoxInfo" @closeBox="onCancelNotice" @confirm="delRoleData" ></notice-box>
    <selection-box :title="{text:'选择用户组',tip:entName,name:'用户组列表'}" :data="unlinkedData" :isShow="isShowRole" @close="isShowRole = false" @update="setRoleGroupJoined" @keyWord="getUnlinkedRoleGroupForKeyWord"></selection-box>
    <notice-box v-show="showBatchRemove" :type="4" :content="BatchRemoveInfo" @closeBox="onCancelBatchRemove" @confirm="delBatchRemove" ></notice-box>
  </div>
</template>
<script>
  import ApiClient from '../../publicJs/ApiClient.js'
  import breadCrumb from '../../publicComponent/breadCrumb'
  import SelectionBox from '../../publicComponent/selectionBox'
  import TipBoxService from '../../publicJs/TipBoxService.js'
  import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
  import noticeBox from '../../publicComponent/noticeBox.vue'
  export default {
    name: 'RoleManageUserGroupLinked',
    data () {
      return {
        showBatchRemove: false,
        BatchRemoveInfo: '您确定要解除角色与勾选用户组的关联吗？',
        navActiveName: 'RoleManageUserGroupLinked',
        breadcrumb: [
          {name: '角色管理', link: 'RoleManagement'},
          {name: '关联用户组', link: ''}
        ],
        roleData: [],
        showNoticeBox: false,
        noticeBoxInfo: '您确定要解除角色与该用户组的关联吗？',
        delId: '',
        roleId: '',
        entId: '',
        role: '',
        entName: '',
        isShowRole: false,
        unlinkedData: [],
        linkedData: [],
        showNone: false,
        groupId: '',
        reload: false,
        selectedGroupId: '',
        total: 1,
        currentPage3: 1,
        pageSize: 10,
        groupName: '',
        // 多选框数据
        checkAll: false,
        // 储存选中的id
        checkedRoles: [],
        // 当前页所有角色的id
        roles: [],
        isIndeterminate: false
      }
    },
    created () {
    },
    components: {
      'BreadCrumb': breadCrumb,
      'SelectionBox': SelectionBox,
      'noticeBox': noticeBox
    },
    methods: {
      // 查询角色下已关联用户组列表
      init () {
        LoadingBoxService.open('数据加载中...')
        ApiClient.get('/userGroup/getRoleRelatedUserGroup', {
          roleId: this.roleId,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
        ).then(data => {
          this.linkedData = data.list
          this.total = data.total
          this.roles = []
          for (let index = 0; index < this.linkedData.length; index++) {
            const element = this.linkedData[index]
            this.roles.push(element.id)
          }
          LoadingBoxService.close()
        }).catch(e => {
          LoadingBoxService.close()
        })
      },
      // 查询角色下未关联的用户组
      initInfo () {
        LoadingBoxService.open('数据加载中...')
        ApiClient.get('/userGroup/getRoleUnrelatedUserGroup', {
          roleId: this.roleId,
          groupName: this.groupName,
          keyword: 'all'
        }
        ).then(data => {
          this.unlinkedData = data.list
          this.entName = data.list[0].orgName
          LoadingBoxService.close()
        }).catch(e => {
          LoadingBoxService.close()
        })
      },
      onCancelNotice () {
        this.showNoticeBox = false
      },
      delRoleData () {
        this.showNoticeBox = false
        LoadingBoxService.open('数据加载中...')
        ApiClient.post('/role/deleteUsergroupRoleRel' + '?roleId=' + this.roleId + '&usergroupId=' + this.groupId).then(data => {
          LoadingBoxService.close()
          if (data === true) {
            TipBoxService.open('用户组移除成功', 0)
            this.init()
          } else {
            TipBoxService.open('用户组移除失败', 2)
          }
        }).catch(e => {
          TipBoxService.open('用户组移除失败', 2)
          LoadingBoxService.close()
        })
      },
      OnRemove (value) {
        this.showNoticeBox = true
        this.groupId = value.id
      },
      setRoleGroupJoined (data) {
        let that = this
        if (!data.length) {
          TipBoxService.open('请选择要关联的用户组！', 2)
          return
        }
        this.isShowRole = false
        let orgList = []
        for (let i = 0; i < data.length; i++) {
          orgList.push(data[i].id)
        }
        let param = {
          roleId: that.roleId,
          userGroupIds: orgList.join(',')
        }
        LoadingBoxService.open('请稍候...')
        ApiClient.get('/role/associateUserGroup?', param).then(data => {
          TipBoxService.open('用户组关联角色成功', 0)
          LoadingBoxService.close()
          that.init()
          that.initInfo()
          that.isShowRole = false
        }).catch(e => {
          TipBoxService.open('用户组关联角色失败', 2)
          LoadingBoxService.close()
        })
      },
      getUnlinkedRoleGroupForKeyWord (val) {
        this.groupName = val
        this.initInfo()
      },
      showAddBox () {
        this.isShowRole = true
      },
      handleSizeChange (val) {

      },
      handleCurrentChange (val) {
        this.checkedRoles = []
        this.checkAll = false
        this.isIndeterminate = false
        this.pageNum = val
        this.init()
      },
      handleCheckAllChange (val) {
        this.checkedRoles = val ? this.roles : []
        this.isIndeterminate = false
      },
      handleCheckedRolesChange (value) {
        console.log(value, 'value')
        this.checkedRoles = value
        let checkedCount = value.length
        this.checkAll = checkedCount === this.roles.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length
      },
      OnDeleteSome () {
        if (this.checkedRoles.length === 0) {
          TipBoxService.open('所选用户组不能为空', 2)
        } else {
          this.showBatchRemove = true
        }
      },
      onCancelBatchRemove () {
        this.showBatchRemove = false
      },
      delBatchRemove () {
        this.showBatchRemove = false
        console.log(this.checkedRoles, 'this.checkedRoles')
        ApiClient.post('/role/batchDeleteUsergroupRoleRel' + '?usergroupIds=' + this.checkedRoles.join(',') + '&roleId=' + this.roleId
        ).then(data => {
          LoadingBoxService.close()
          if (data === true) {
            TipBoxService.open('用户组移除成功', 0)
            this.checkedRoles = []
            this.checkAll = false
            this.roles = []
            this.isIndeterminate = false
            this.init()
          } else {
            TipBoxService.open('用户组移除失败', 2)
          }
        }).catch(e => {
          LoadingBoxService.close()
        })
      }
    },
    mounted () {
      this.roleId = this.$route.query.roleId
      this.role = this.$route.query.roleName
      this.init()
      this.initInfo()
    }
  }
</script>
<style src="../../css/RoleManageUserGroupLinked.css" scoped>
</style>
<style>
  #RoleManageUserGroupLinked .el-pagination__editor.el-input .el-input__inner {
    height: 25px;
  }
  #RoleManageUserGroupLinked .el-pager li{
    font-weight: normal;
  }
  #RoleManageUserGroupLinked .el-input__inner {
    border:none;
    border-radius: 0px;
    width: 65%;
  }
   #RoleManageUserGroupLinked .el-checkbox-group {
    font-size: 1px;
}
#RoleManageUserGroupLinked .el-checkbox__label {
    display: none;
}
</style>
