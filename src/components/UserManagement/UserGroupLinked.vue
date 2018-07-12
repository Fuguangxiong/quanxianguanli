<template>
  <div id="UserGroupLinked">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-linked-box">
      <div class="pa-linked-box-title">已关联用户组列表<span>（用户账号：{{account}}）</span></div>
      <span class="pa-link-add" @click="onOpenSelector" v-if="verifyPermission('001003001')">
        <i class="iconfont icon-xinzeng"></i>
        <span class="pa-add-text">新增</span>
      </span>
      <div class="pa-linked-table">
        <div class="pa-table-head">
          <span class="pa-table-col1">用户组名</span>
          <span class="pa-table-col2">组织</span>
          <span class="pa-table-col3">描述</span>
          <span class="pa-table-col4">操作</span>
        </div>
        <div class="pa-nothing" v-show="!userGroupData.length">
          <div class="nothing-img"></div>
          <div class="nothing-text">未查找到相关数据</div>
        </div>
        <div class="pa-table-body">
          <div class="pa-table-row" v-for="(item,index) in userGroupData" :key="index">
            <span class="pa-table-col1" :title="item.name">{{item.name}}</span>
            <span class="pa-table-col2" :title="entName">{{entName}}</span>
            <span class="pa-table-col3" :title="item.remark">{{item.remark}}</span>
            <span class="pa-table-col4">
              <i class="iconfont icon-yichu" @click="onNoticeBoxShow(item.id)" title="移除" v-if="verifyPermission('001003002')"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <notice-box v-show="showNoticeBox" :type="4" :content="noticeBoxInfo" @closeBox="onCancelNotice" @confirm="delUserGroupData" ></notice-box>
    <selection-box :title="{text:'选择用户组',tip:entName,name:'用户组列表'}" :data="unlinkedData" :isShow="isShowUserGroup" @close="isShowUserGroup = false" @update="setJoinedUserGroup" @keyWord="getUnlinkedUserGroupForKeyWord"></selection-box>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import NoticeBox from '../../publicComponent/noticeBox'
import SelectionBox from '../../publicComponent/selectionBox'
import ApiClient from '../../publicJs/ApiClient.js'
import TipBoxService from '../../publicJs/TipBoxService'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
export default {
  name: 'UserGroupLinked',
  data () {
    return {
      navActiveName: 'UserManagement',
      breadcrumb: [
        {name: '用户管理', link: 'UserManagement'},
        {name: '关联用户组', link: ''}
      ],
      userGroupData: [],
      showNoticeBox: false,
      noticeBoxInfo: '您确定要把用户从该用户组移除吗？',
      delId: '',
      isShowUserGroup: false,
      unlinkedData: [],
      entId: '',
      userId: '',
      account: '',
      entName: '',
      keyword: ''
    }
  },
  components: {
    'BreadCrumb': breadCrumb,
    'NoticeBox': NoticeBox,
    'SelectionBox': SelectionBox
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.entId = this.$route.query.entId
      this.userId = this.$route.query.userId
      this.account = this.$route.query.account
      this.entName = sessionStorage.getItem('entpriseName')
      this.getUserGroupJoinedList()
      this.getUserGroupUnjoinedList()
    },
    onNoticeBoxShow (id) {
      this.showNoticeBox = true
      this.delId = id
    },
    onCancelNotice () {
      this.showNoticeBox = false
    },
    delUserGroupData () {
      let that = this
      that.setQuitUserGroup()
      that.showNoticeBox = false
    },
    getUserGroupJoinedList () {
      let that = this
      let param = {
        userId: that.userId,
        orgId: that.entId
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('userGroup/getJoinedUserGroup', param).then(data => {
        that.userGroupData = data
        LoadingBoxService.close()
      }).catch(e => {
        LoadingBoxService.close()
        TipBoxService.open('数据加载失败', 2)
      })
    },
    onOpenSelector () {
      let that = this
      if (that.unlinkedData.length > 0) {
        this.isShowUserGroup = true
        LoadingBoxService.close()
      } else {
        LoadingBoxService.close()
        TipBoxService.open('当前无可用的用户组关联', 2)
      }
    },
    getUserGroupUnjoinedList () {
      let that = this
      let param = {
        userId: that.userId,
        orgId: that.entId,
        keyword: that.keyword.trim()
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('userGroup/getUnjoinedUserGroup', param).then(data => {
        that.unlinkedData = data
        LoadingBoxService.close()
      }).catch(e => {
        LoadingBoxService.close()
        TipBoxService.open('数据加载失败', 2)
      })
    },
    setJoinedUserGroup (data) {
      let that = this
      if (!data.length) {
        TipBoxService.open('关联的用户组不能为空', 2)
        return
      }
      let orgList = []
      for (let i = 0; i < data.length; i++) {
        orgList.push(data[i].id)
      }
      let param = {
        userId: that.userId,
        groupIds: orgList.join(',')
      }
      LoadingBoxService.open('请稍候...')
      ApiClient.get('userGroup/joinUserAndGroup?', param).then(data => {
        if (data === 'success') {
          TipBoxService.open('关联用户组成功', 0)
          LoadingBoxService.close()
          that.getUserGroupJoinedList()
          that.getUserGroupUnjoinedList()
          that.isShowUserGroup = false
        } else {
          TipBoxService.open('关联用户组失败', 2)
          LoadingBoxService.close()
        }
      }).catch(e => {
        TipBoxService.open('关联用户组失败', 2)
        LoadingBoxService.close()
      })
    },
    getUnlinkedUserGroupForKeyWord (val) {
      this.keyword = val
      this.getUserGroupUnjoinedList()
    },
    setQuitUserGroup () {
      let that = this
      let param = {
        userId: that.userId,
        groupId: that.delId
      }
      LoadingBoxService.open('请稍候...')
      ApiClient.get('userGroup/unjoinUserAndGroup', param).then(data => {
        if (data === 1) {
          TipBoxService.open('用户组移除成功', 0)
          LoadingBoxService.close()
          that.getUserGroupJoinedList()
          that.getUserGroupUnjoinedList()
        } else {
          TipBoxService.open('用户组移除失败', 2)
          LoadingBoxService.close()
        }
      }).catch(e => {
        TipBoxService.open('用户组移除失败', 2)
        LoadingBoxService.close()
      })
    }
  }
}
</script>
<style src="../../css/UserGroupLinked.css" scoped>

</style>
