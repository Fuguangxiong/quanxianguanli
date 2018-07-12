<template>
  <div id="RoleLinked">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-linked-box">
      <div class="pa-linked-box-title">已关联角色列表<span>（用户账号：{{account}}）</span></div>
      <span class="pa-link-add" @click="onOpenSelector" v-if="verifyPermission('001004001')">
        <i class="iconfont icon-xinzeng"></i>
        <span class="pa-add-text">新增</span>
      </span>
      <div class="pa-linked-table">
        <div class="pa-table-head">
          <span class="pa-table-col1">角色名</span>
          <span class="pa-table-col2">关联用户组</span>
          <span class="pa-table-col3">组织</span>
          <span class="pa-table-col4">描述</span>
          <span class="pa-table-col5">操作</span>
        </div>
        <div class="pa-nothing" v-show="!roleData.length">
          <div class="nothing-img"></div>
          <div class="nothing-text">未查找到相关数据</div>
        </div>
        <div class="pa-table-body">
          <div class="pa-table-row" v-for="(item,index) in roleData" :key="index">
            <span class="pa-table-col1" :title="item.name">{{item.name}}</span>
            <span class="pa-table-col2">{{item.userGroup?item.userGroup.name:'未关联'}}</span>
            <span class="pa-table-col3" :title="entName">{{entName}}</span>
            <span class="pa-table-col4" :title="item.remark">{{item.remark}}</span>
            <span class="pa-table-col5">
              <i class="iconfont icon-yichu" @click="onNoticeBoxShow(item)" title="移除" v-if="verifyPermission('001004002')"></i>
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
      navActiveName: 'UserManagement',
      breadcrumb: [
        {name: '用户管理', link: 'UserManagement'},
        {name: '关联角色', link: ''}
      ],
      roleData: [],
      showNoticeBox: false,
      noticeBoxInfo: '',
      delId: '',
      userId: '',
      entId: '',
      account: '',
      entName: '',
      isShowRole: false,
      unlinkedData: [],
      keyword: '',
      showNone: false,
      groupId: ''
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
      this.userId = this.$route.query.userId
      this.entId = this.$route.query.entId
      this.account = sessionStorage.getItem('accountName')
      this.entName = sessionStorage.getItem('entpriseName')
      this.getRoleJoinedList()
      this.getRoleUnjoinedList()
    },
    onNoticeBoxShow (item) {
      this.showNoticeBox = true
      this.delId = item.id
      if (item.userGroup === null || item.userGroup === '') {
        this.noticeBoxInfo = '您确定要移除该角色吗？'
      } else {
        this.noticeBoxInfo = '您确定要把用户从该用户组移除吗？'
        this.groupId = item.userGroup.id
      }
    },
    onCancelNotice () {
      this.showNoticeBox = false
    },
    delRoleData () {
      let that = this
      if (that.noticeBoxInfo === '您确定要移除该角色吗？') {
        that.delRoleJoined()
      } else {
        that.delUserGroup()
      }
      that.showNoticeBox = false
    },
    getRoleJoinedList () {
      let that = this
      let param = {
        userId: that.userId,
        enterpriseId: that.entId
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('/role/getRelatedRolesByUserIdAndEnterpriseId', param).then(data => {
        let newData = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].userGroup === null) {
            newData.push(data[i])
          } else {
            let filterData = []
            filterData = data[i]
            for (let j = i + 1; j < data.length; j++) {
              if (data[j].userGroup !== null) {
                if (data[j].userGroup.id === filterData.userGroup.id) {
                  filterData.name += '，' + data[j].name
                  filterData.remark = ''
                  data.splice(j, 1)
                  j--
                }
              }
            }
            newData.push(filterData)
          }
        }
        that.roleData = newData
        LoadingBoxService.close()
      }).catch(e => {
        LoadingBoxService.close()
        TipBoxService.open('数据加载失败', 2)
        console.error(e)
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
        userId: that.userId,
        enterpriseId: that.entId,
        keyword: that.keyword.trim()
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('/role/getUnRelatedRolesByUserIdAndEnterpriseId', param).then(data => {
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
        TipBoxService.open('关联的角色不能为空', 2)
        return
      }
      let roleList = []
      for (let i = 0; i < data.length; i++) {
        roleList.push(data[i].id)
      }
      let roleParam = roleList.join(',')
      LoadingBoxService.open('请稍候...')
      ApiClient.post('role/saveUserRoleRel?userId=' + that.userId + '&roleIds=' + roleParam).then(data => {
        LoadingBoxService.close()
        if (data === true) {
          TipBoxService.open('关联角色成功', 0)
          that.isShowRole = false
          that.getRoleJoinedList()
          that.getRoleUnjoinedList()
        } else {
          TipBoxService.open('关联角色失败', 2)
        }
      }).catch(e => {
        TipBoxService.open('关联角色失败', 2)
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
      ApiClient.post('/role/deleteUserRoleRel?userId=' + that.userId + '&roleId=' + that.delId).then(data => {
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
    },
    delUserGroup () {
      let that = this
      let param = {
        userId: that.userId,
        groupId: that.groupId
      }
      LoadingBoxService.open('请稍候...')
      ApiClient.get('userGroup/unjoinUserAndGroup', param).then(data => {
        if (data === 1) {
          TipBoxService.open('用户组移除成功', 0)
          LoadingBoxService.close()
          that.getRoleJoinedList()
          that.getRoleUnjoinedList()
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
<style src="../../css/RoleLinked.css" scoped>

</style>
