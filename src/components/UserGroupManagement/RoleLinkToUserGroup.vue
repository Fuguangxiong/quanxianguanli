<template>
  <div id="RoleLinkToUserGroup">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-linked-box">
      <div class="pa-linked-box-title">已关联角色列表<span>（用户组：{{groupName}}）</span></div>
      <span class="pa-link-add" @click="onOpenSelector">
        <i class="iconfont icon-xinzeng"></i>
        <span class="pa-add-text">新增</span>
      </span>
      <div class="pa-linked-table">
        <div class="pa-table-head">
          <span class="pa-table-col1">角色名</span>
          <span class="pa-table-col2">组织</span>
          <span class="pa-table-col3">描述</span>
          <span class="pa-table-col4">操作</span>
        </div>
        <div class="pa-nothing" v-show="!roleData.length">
          <div class="nothing-img"></div>
          <div class="nothing-text">未查找到相关数据</div>
        </div>
        <div class="pa-table-body">
          <div class="pa-table-row" v-for="(item,index) in roleData" :key="index">
            <span class="pa-table-col1" :title="item.name">{{item.name}}</span>
            <span class="pa-table-col2" :title="entName">{{entName}}</span>
            <span class="pa-table-col3" :title="item.remark">{{item.remark}}</span>
            <span class="pa-table-col4">
              <i class="iconfont icon-yichu" @click="onNoticeBoxShow(item)" title="移除"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <notice-box v-show="showNoticeBox" :type="4" :content="noticeBoxInfo" @closeBox="onCancelNotice" @confirm="delRoleData" ></notice-box>
    <selection-box :title="{text:'选择角色',tip:entName,name:'角色列表'}" :data="unlinkedData" :isShow="isShowRole" @close="isShowRole = false" @update="setRoleJoined" @keyWord="getUnlinkedRoleForKeyWord"></selection-box>
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
  name: 'RoleLinked',
  data () {
    return {
      breadcrumb: [
        {name: '用户组管理', link: 'UserGroupManagement'},
        {name: '关联角色', link: ''}
      ],
      roleData: [],
      showNoticeBox: false,
      noticeBoxInfo: '',
      delId: '',
      entId: '',
      account: '',
      entName: '',
      isShowRole: false,
      unlinkedData: [],
      keyword: '',
      groupId: '',
      groupName: ''
    }
  },
  mounted () {
    this.init()
  },
  components: {
    'BreadCrumb': breadCrumb,
    'NoticeBox': NoticeBox,
    'SelectionBox': SelectionBox
  },
  methods: {
    init () {
      this.groupId = this.$route.query.userGroupId
      this.entId = this.$route.query.orgId
      this.entName = sessionStorage.getItem('entpriseName')
      this.groupName = sessionStorage.getItem('groupName')
      this.getRoleJoinedList()
      this.getRoleUnjoinedList()
    },
    onNoticeBoxShow (item) {
      this.showNoticeBox = true
      this.delId = item.id
      this.noticeBoxInfo = '您确定要将此角色从该用户组移除吗？'
    },
    onCancelNotice () {
      this.showNoticeBox = false
    },
    delRoleData () {
      let that = this
      that.delRoleJoined()
      that.showNoticeBox = false
    },
    getRoleJoinedList () {
      let that = this
      let param = {
        usergroupId: that.groupId,
        enterpriseId: that.entId
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('role/getRelatedRolesByUsergroupIdAndEnterpriseId', param).then(data => {
        that.roleData = data
        LoadingBoxService.close()
      }).catch(e => {
        LoadingBoxService.close()
        TipBoxService.open('数据加载失败', 2)
      })
    },
    onOpenSelector () {
      let that = this
      if (that.unlinkedData.length > 0) {
        LoadingBoxService.close()
        that.isShowRole = true
      } else {
        TipBoxService.open('当前无可用的角色关联', 2)
        LoadingBoxService.close()
      }
    },
    getRoleUnjoinedList () {
      let that = this
      let param = {
        usergroupId: that.groupId,
        enterpriseId: that.entId,
        keyword: that.keyword.trim()
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('role/getUnRelatedRolesByUsergroupIdAndEnterpriseId', param).then(data => {
        that.unlinkedData = data
        LoadingBoxService.close()
      }).catch(e => {
        LoadingBoxService.close()
        TipBoxService.open('数据加载失败', 2)
      })
    },
    setRoleJoined (data) {
      let that = this
      if (!data.length) {
        TipBoxService.open('请选择要关联的角色！', 2)
        return
      }
      let roleList = []
      for (let i = 0; i < data.length; i++) {
        roleList.push(data[i].id)
      }
      let roleParam = roleList.join(',')
      LoadingBoxService.open('请稍候...')
      ApiClient.post('role/saveUsergroupRoleRel?usergroupId=' + that.groupId + '&roleIds=' + roleParam).then(data => {
        LoadingBoxService.close()
        if (data === true) {
          TipBoxService.open('角色关联成功', 0)
          that.isShowRole = false
          that.getRoleJoinedList()
          that.getRoleUnjoinedList()
        } else {
          TipBoxService.open('角色关联失败', 2)
        }
      }).catch(e => {
        TipBoxService.open('角色关联失败', 2)
        LoadingBoxService.close()
      })
    },
    getUnlinkedRoleForKeyWord (val) {
      this.keyword = val
      this.getRoleUnjoinedList()
    },
    delRoleJoined () {
      let that = this
      LoadingBoxService.open('请稍候...')
      ApiClient.post('role/deleteUsergroupRoleRel?usergroupId=' + that.groupId + '&roleId=' + that.delId).then(data => {
        LoadingBoxService.close()
        if (data === true) {
          TipBoxService.open('角色移除成功', 0)
          that.getRoleJoinedList()
          that.getRoleUnjoinedList()
        } else {
          TipBoxService.open('角色移除失败', 2)
        }
      }).catch(e => {
        TipBoxService.open('角色移除失败', 2)
        LoadingBoxService.close()
      })
    }
  }
}
</script>
<style src="../../css/RoleLinkToUserGroup.css" scoped>

</style>
