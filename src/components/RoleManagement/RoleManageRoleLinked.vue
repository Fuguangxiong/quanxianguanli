<template>
  <div id="RoleManageRoleLinked">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-linked-box">
      <div class="pa-linked-box-title">已关联用户列表<span>（角色：{{role}}，组织：{{entName}}）</span></div>
       <span class="pa-link-delete" @click="OnDeleteSome">
        <i class="iconfont icon-piliangshanchu"></i>
        <span class="pa-add-text">批量移除</span>
      </span>
      <span class="pa-link-add" @click="showSelectUser">
        <i class="iconfont icon-xinzeng"></i>
        <span class="pa-add-text">新增</span>
      </span>
      <div class="pa-linked-table">
        <div class="pa-table-head">
         <span class="pa-table-col1"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox></span> 
          <span class="pa-table-col2">账号</span>
          <span class="pa-table-col3">昵称</span>
          <span class="pa-table-col4">手机号</span>
          <span class="pa-table-col5">邮箱</span>
          <span class="pa-table-col6">部门</span>
          <span class="pa-table-col7">操作</span>
        </div>
        <div class="pa-table-body">
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
          <div class="pa-table-row" v-for="(value, index) in unlinkedData" :key="index">
            <span class="pa-table-col1"> <el-checkbox :label="value.id" :key="value.id" ></el-checkbox></span>
            <span class="pa-table-col2" :title="value.account">{{value.account}}</span>
            <span class="pa-table-col3" :title="value.nickName">{{value.nickName}}</span>
            <span class="pa-table-col4" :title="value.phone">{{value.phone}}</span>
            <span class="pa-table-col5" :title="value.email">{{value.email}}</span>
            <span class="pa-table-col6" :title="value.orgName">{{value.orgName}}</span>
            <span class="pa-table-col7">
              <i class="iconfont icon-yichu"  title="移除" @click="OnRemove(value)"></i>
            </span>
          </div>
          </el-checkbox-group>
          <div class="pa-nothing" v-show="!unlinkedData.length">
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
    <SelectUser v-show="showSelectBox" :roleId="roleId" :orgId="orgId" :orgName="entName" :reload="reload" @closeBox="closeBox" @confirm="confirm"></SelectUser>
    <notice-box v-show="showNoticeBox" :type="4" :content="noticeBoxInfo" @closeBox="onCancelNotice" @confirm="delRoleData" ></notice-box>
     <notice-box v-show="showBatchRemove" :type="4" :content="BatchRemoveInfo" @closeBox="onCancelBatchRemove" @confirm="delBatchRemove" ></notice-box>
  </div>
</template>
<script>
  import ApiClient from '../../publicJs/ApiClient.js'
  import breadCrumb from '../../publicComponent/breadCrumb'
  import SelectUser from './SelectUser.vue'
  import TipBoxService from '../../publicJs/TipBoxService.js'
  import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
  import noticeBox from '../../publicComponent/noticeBox.vue'
export default {
    name: 'RoleManageRoleLinked',
    data () {
      return {
        showBatchRemove: false,
        BatchRemoveInfo: '您确定要解除角色与勾选用户的关联吗？',
        navActiveName: 'RoleManageRoleLinked',
        noticeBoxInfo: '您确定要解除角色与该用户的关联吗？',
        breadcrumb: [
          {name: '角色管理', link: 'RoleManagement'},
          {name: '关联用户', link: ''}
        ],
        roleData: [],
        showNoticeBox: false,
        showSelectBox: false,
        delId: '',
        roleId: '',
        orgId: '',
        role: '',
        entName: '',
        unlinkedData: [],
        keyword: '',
        groupId: '',
        reload: false,
        total: 1,
        currentPage3: 1,
        pageSize: 10,
        pageNum: 1,
        userId: '',
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
      'SelectUser': SelectUser,
      'noticeBox': noticeBox
    },
    methods: {
      // 查询角色下已关联用户列表
      init () {
        LoadingBoxService.open('数据加载中...')
        ApiClient.get('/user/getRoleJoinedUser', {
          roleId: this.roleId,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          orgId: this.orgId
        }
        ).then(data => {
          this.unlinkedData = data.list
          this.total = data.total
          this.roles = []
          for (let index = 0; index < this.unlinkedData.length; index++) {
            const element = this.unlinkedData[index]
            this.roles.push(element.id)
          }
          console.log(this.roles, 'this.roles')
          LoadingBoxService.close()
        }).catch(e => {
          LoadingBoxService.close()
        })
      },
      closeBox () {
        this.showSelectBox = false
        this.reload = false
      },
      confirm (val, id) {
        this.reload = false
        if (val.length === 0) {
          TipBoxService.open('请选择要关联的用户！', 2)
          return
        }
        this.showSelectBox = false
        var memberArr = []
        for (var i = 0; i < val.length; i++) {
          var member = val[i]
          memberArr.push(member.id)
        }
        memberArr = [...new Set(memberArr)]
        LoadingBoxService.open('请稍候...')
        ApiClient.get('/role/associateUser' + '?userIds=' + memberArr.join(',') + '&roleId=' + id
        ).then(data => {
          TipBoxService.open('用户关联角色成功', 0)
          let that = this
          let param = {
            roleId: this.roleId,
            pageSize: this.pageSize,
            pageNum: this.pageNum,
            orgId: this.orgId
          }
          ApiClient.get('/user/getRoleJoinedUser', param).then(data => {
            that.total = data.total
            that.unlinkedData = data.list
            this.roles = []
            for (let index = 0; index < this.unlinkedData.length; index++) {
              const element = this.unlinkedData[index]
              this.roles.push(element.id)
            }
            console.log(this.roles, 'this.roles')
          }).catch(e => {
            TipBoxService.open('用户关联角色失败', 0)
          })
          LoadingBoxService.close()
        }).catch(e => {
          LoadingBoxService.close()
        })
        this.checkedRoles = []
        this.checkAll = false
        this.isIndeterminate = false
      },
      showSelectUser () {
        this.reload = true
        this.showSelectBox = true
      },
      handleSizeChange (val) {

      },
      handleCurrentChange (val) {
        this.pageNum = val
        this.checkedRoles = []
        this.checkAll = false
        this.isIndeterminate = false
        this.init()
      },
      onCancelNotice () {
        this.showNoticeBox = false
      },
      delRoleData () {
        this.showNoticeBox = false
        LoadingBoxService.open('数据加载中...')
        ApiClient.post('/role/deleteUserRoleRel' + '?roleId=' + this.roleId + '&userId=' + this.userId).then(data => {
          LoadingBoxService.close()
          if (data === true) {
            TipBoxService.open('用户移除成功', 0)
            this.init()
          } else {
            TipBoxService.open('用户移除失败', 2)
          }
        }).catch(e => {
          TipBoxService.open('用户移除失败', 2)
          LoadingBoxService.close()
        })
      },
      OnRemove (value) {
        this.showNoticeBox = true
        this.userId = value.id
      },
      handleCheckAllChange (val) {
        this.checkedRoles = val ? this.roles : []
        this.isIndeterminate = false
        console.log(val)
        console.log(this.checkedRoles)
        console.log(this.roles)
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
          TipBoxService.open('所选用户不能为空', 2)
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
        ApiClient.post('/role/batcheDeleteUserRoleRel' + '?userIds=' + this.checkedRoles.join(',') + '&roleId=' + this.roleId
        ).then(data => {
          LoadingBoxService.close()
          if (data === true) {
            TipBoxService.open('用户移除成功', 0)
            this.checkedRoles = []
            this.checkAll = false
            this.roles = []
            this.isIndeterminate = false
            this.init()
          } else {
            TipBoxService.open('用户移除失败', 2)
          }
        }).catch(e => {
          LoadingBoxService.close()
        })
      }
    },
    mounted () {
      this.roleId = this.$route.query.roleId
      this.role = this.$route.query.roleName
      this.orgId = this.$route.query.orgId
      this.entName = this.$route.query.orgName
      this.init()
    }
  }
</script>
<style src="../../css/RoleManageRoleLinked.css" scoped>
</style>
<style>
  #RoleManageRoleLinked .el-pagination__editor.el-input .el-input__inner {
    height: 25px;
  }
  #RoleManageRoleLinked .el-pager li{
    font-weight: normal;
  }
  #RoleManageRoleLinked .el-input__inner {
    border:none;
    border-radius: 0px;
    width: 65%;
  }
 #RoleManageRoleLinked .el-checkbox-group {
    font-size: 1px;
}
#RoleManageRoleLinked .el-checkbox__label {
    display: none;
}
</style>
