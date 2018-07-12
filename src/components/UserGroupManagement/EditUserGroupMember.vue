<template>
  <div id="EditUserGroupMember">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-title">组织：{{entName}}</div>
    <div class="pa-left-area">
      <div class="pa-section-title pa-title-weight">用户组</div>
      <ul>
        <li v-for="(item,index) in userGroupList" :key="index" @click="getGroupMember(item.id)" :class="{active:item.id===selectedGroupId}">{{item.name}}</li>
      </ul>
    </div>
    <div class="pa-right-area">
      <div class="pa-section-title">
        <span class="pa-right-title pa-title-weight">成员</span>
        <span class="pa-link-delete" @click="onNoticeBoxShow">
          <i class="iconfont icon-piliangshanchu"></i>
          <span class="pa-add-text">移除所选用户</span>
        </span>
        <span class="pa-link-add" @click="onAddMember">
          <i class="iconfont icon-xinzeng"></i>
          <span class="pa-add-text" >添加用户</span>
        </span>
      </div>
      <div class="pa-section-main">
        <div class="pa-serach-area">
          <div class="pa-search-input">
            部门：<input type="text" v-model="searchDep" @keyup.enter="onSearchGroupMember()">
          </div>
          <div class="pa-search-input">
            账号：<input type="text" v-model="searchAccount" @keyup.enter="onSearchGroupMember()">
          </div>
          <div class="pa-search-input">
            手机号：<input type="text" v-model="searchPhone" @keyup.enter="onSearchGroupMember()">
          </div>
          <div class="pa-button-box">
            <button type="button" class="btnBlue" @click="onSearchGroupMember()">搜索</button>
          </div>
        </div>
        <div class="pa-list-area">
          <div class="pa-list-title">
            <span class="pa-tabel-col1"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox></span>
            <span class="pa-tabel-col2">账号</span>
            <span class="pa-tabel-col3">昵称</span>
            <span class="pa-tabel-col4">手机号</span>
            <span class="pa-tabel-col5">部门</span>
          </div>
          <div class="pa-list-box">
            <el-checkbox-group v-model="checkedLists" @change="handleCheckedItemsChange">
            <div class="pa-list-content" v-for="(item,index) in memberList" :key="index">
              <span class="pa-tabel-col1"><el-checkbox v-model="item.isChecked" :label="item.id" >{{''}}</el-checkbox></span>
              <span class="pa-tabel-col2">{{item.account}}</span>
              <span class="pa-tabel-col3">{{item.nick_name}}</span>
              <span class="pa-tabel-col4">{{item.phone}}</span>
              <span class="pa-tabel-col5">{{item.departName}}</span>
            </div>
            </el-checkbox-group>
          </div>
          <div class="pa-nothing" v-show="!memberList.length">
            <div class="nothing-img"></div>
            <div class="nothing-text">未查找到相关数据</div>
          </div>
        </div>
        <div class="pa-pagination-area" v-show="totalNumber>10">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total=totalNumber>
          </el-pagination>
        </div>
      </div>
    </div>
    <notice-box v-show="showNoticeBox" :type="4" :content="noticeBoxInfo" @closeBox="onCancelNotice" @confirm="delGroupUser" ></notice-box>
    <!--添加用户组成员弹框-->
    <AddUserTipBox v-show="TipBoxShow" :selectedGroupId="selectedGroupId" :entName="entName" :reload="reload" @closeBox="closeBox" @confirm="confirm"></AddUserTipBox>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import AddUserTipBox from './AddUserTipBox.vue'
import NoticeBox from '../../publicComponent/noticeBox'
import TipBoxService from '../../publicJs/TipBoxService'
import ApiClient from '../../publicJs/ApiClient.js'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
export default {
  name: 'EditUserGroupMember',
  data () {
    return {
      navActiveName: 'UserGroupManagement',
      // 标记弹框列表里面的数据是否重新加载
      reload: false,
      breadcrumb: [
        {name: '用户组管理', link: 'UserGroupManagement'},
        {name: '编辑成员', link: ''}
      ],
      userGroupList: [],
      memberList: [],
      checkedMembers: [], // id数组
      entName: '',
      entId: '',
      searchDep: '',
      searchAccount: '',
      searchPhone: '',
      isIndeterminate: false,
      checkAll: false,
      TipBoxShow: false,
      checkedLists: [],
      listOptions: [],
      showNoticeBox: false,
      noticeBoxInfo: '您确定要把用户从该用户组移除吗？',
      pageSize: 10,
      currentPage: 1,
      totalNumber: 0,
      selectedGroupId: ''
    }
  },
  components: {
    'BreadCrumb': breadCrumb,
    'AddUserTipBox': AddUserTipBox,
    'NoticeBox': NoticeBox
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.selectedGroupId = this.$route.query.userGroupId
      this.entId = this.$route.query.orgId
      this.getGroupList()
      this.getGroupMember()
    },
    getGroupList () {
      let that = this
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('userGroup/getUserGroup?orgId=' + that.entId + '&keyword=all').then(data => {
        that.userGroupList = data.data
        that.entName = data.data[0].orgName
        LoadingBoxService.close()
      }).catch(e => {
        TipBoxService.open('网络错误', 2)
        LoadingBoxService.close()
      })
    },
    getGroupMember (id) {
      let that = this
      if (id) {
        this.selectedGroupId = id
      }
      that.searchDep = ''
      that.searchAccount = ''
      that.searchPhone = ''
      that.onSearchGroupMember()
    },
    onSearchGroupMember () {
      let that = this
      let param = {
        userGroupId: that.selectedGroupId,
        departmentName: that.searchDep.trim(),
        account: that.searchAccount.trim(),
        phone: that.searchPhone.trim(),
        pageNum: that.currentPage
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('userGroup/joinedUser', param).then(data => {
        that.totalNumber = data.total
        that.memberList = data.data
        that.onDataReset()
        that.listOptions = []
        for (let i = 0; i < that.memberList.length; i++) {
          that.listOptions.push(that.memberList[i].id)
        }
        LoadingBoxService.close()
      }).catch(e => {
        TipBoxService.open('网络错误', 2)
        LoadingBoxService.close()
      })
    },
    onDataReset () {
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedLists = []
    },
    getUserGroupList () {
    },
    onAddMember () {
      this.TipBoxShow = true
      this.reload = true
    },
    handleCheckAllChange (val) {
      this.checkedLists = val ? this.listOptions : []
      this.isIndeterminate = false
    },
    handleCheckedItemsChange (val) {
      let checkedCount = val.length
      this.checkAll = checkedCount === this.listOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listOptions.length
    },
    closeBox () {
      this.TipBoxShow = false
      this.reload = false
    },
    confirm (val, id) {
      this.reload = false
      if (val.length === 0) {
        TipBoxService.open('请选择要关联的用户！', 2)
        return
      }
      this.TipBoxShow = false
      var memberArr = []
      for (var i = 0; i < val.length; i++) {
        var member = val[i]
        memberArr.push(member.id)
      }
      memberArr = [...new Set(memberArr)]
      console.log(memberArr, 'memberArr')
      // var that = this
      LoadingBoxService.open('请稍候...')
      ApiClient.post('/userGroup/insertUser' + '?ids=' + memberArr.join(',') + '&userGroupId=' + id
      ).then(data => {
        if (data === true) {
          TipBoxService.open('关联用户成功', 0)
        } else {
          TipBoxService.open('关联用户失败', 2)
        }
        let that = this
        let param = {
          userGroupId: that.selectedGroupId,
          departmentName: that.searchDep.trim(),
          account: that.searchAccount.trim(),
          phone: that.searchPhone.trim(),
          pageNum: that.currentPage
        }
        ApiClient.get('userGroup/joinedUser', param).then(data => {
          that.totalNumber = data.total
          that.memberList = data.data
          that.onDataReset()
          that.listOptions = []
          for (let i = 0; i < that.memberList.length; i++) {
            that.listOptions.push(that.memberList[i].id)
          }
        }).catch(e => {
          TipBoxService.open('网络错误', 2)
        })
        LoadingBoxService.close()
      }).catch(e => {
        LoadingBoxService.close()
      })
    },
    onCancelNotice () {
      this.showNoticeBox = false
    },
    onNoticeBoxShow () {
      if (this.checkedLists.length === 0) {
        TipBoxService.open('所选用户不能为空', 2)
      } else {
        this.showNoticeBox = true
      }
    },
    delGroupUser () {
      let that = this
      let roleParam = that.checkedLists.join(',')
      LoadingBoxService.open('请稍候...')
      ApiClient.post('userGroup/deleteUser?userGroupId=' + that.selectedGroupId + '&userIds=' + roleParam).then(data => {
        console.log(data)
        if (data === true) {
          TipBoxService.open('用户移除成功', 0)
          that.showNoticeBox = false
          that.getGroupMember(null)
        } else {
          TipBoxService.open('用户移除失败', 2)
        }
        LoadingBoxService.close()
      }).catch(e => {
        TipBoxService.open('网络错误', 2)
        LoadingBoxService.close()
      })
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.onSearchGroupMember()
    }
  }
}
</script>
<style src='../../css/EditUserGroupMember.css' scoped>

</style>
<style>
  #EditUserGroupMember .el-checkbox-group{
    font-size: 12px;
  }
  #EditUserGroupMember .pa-list-box .el-checkbox__input{
    margin-left: 20%;
  }
  #EditUserGroupMember .el-pagination__editor.el-input .el-input__inner {
    height: 25px;
  }
  #EditUserGroupMember .el-pager li{
    font-weight: normal;
  }
  #EditUserGroupMember .el-input__inner {
    border:none;
    border-radius: 0px;
    width: 65%;
  }
</style>
