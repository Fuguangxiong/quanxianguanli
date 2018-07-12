<template>
  <div id="OrganizationLinked">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-linked-box">
      <div class="pa-linked-box-title">已关联组织列表<span class="pa-linked-box-account">(帐号：{{userAccount}})</span></div>
      <span v-if="isSA" class="pa-link-add" @click="onOpenOrgBox">
        <i class="iconfont icon-xinzeng"></i><span class="pa-add-text">新增</span>
      </span>
      <selection-box
        :title="{text:'选择组织', name:'组织列表'}"
        :data="unlinkedData"
        :isShow="isShowOrg"
        @keyWord="getUnlinkedDataForKeyWord"
        @update="onLinkedOrg"
        @close="isShowOrg = false">
      </selection-box>
      <div class="pa-linked-table">
        <div class="pa-table-head">
          <span class="pa-table-col1">组织</span>
          <span class="pa-table-col2">部门</span>
          <span class="pa-table-col3">职位</span>
          <span class="pa-table-col4">操作</span>
        </div>
        <div v-show="linkedData.length" class="pa-table-body" :class="{'one-page': pageTotal <= 10}">
          <div class="pa-table-row" v-for="(item,index) in linkedData" :key="index">
            <span class="pa-table-col1">{{item.enterpriseName}}</span>
            <span class="pa-table-col2">{{item.departmentName}}</span>
            <span class="pa-table-col3">{{item.position}}</span>
            <span class="pa-table-col4">
              <i v-if="isSA || item.enterpriseId === enterprise.id" title="更换部门" class="iconfont icon-tihuantupian" @click="onOpenDepBox(item)"></i>
              <!-- <a href="javascript:;" @click="isShowDep = true">更换部门</a> -->
            </span>
          </div>
        </div>
        <div class="pa-nothing" v-show="!linkedData.length">
          <div class="nothing-img"></div>
          <div class="nothing-text">未查找到相关数据</div>
        </div>
        <div class="pa-pagination">
          <el-pagination
            v-show="pageTotal > 10"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="pageTotal">
          </el-pagination>
        </div>
        <selection-dep
          :title="{text:'编辑部门', tip: orgNameForChange}"
          :data="departmentTreeData"
          :currentDepartment="currentDepartment"
          :isShow="isShowDep"
          @update="onLinkedDep"
          @close="isShowDep = false">
        </selection-dep>
      </div>
    </div>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import selectionBox from '../../publicComponent/selectionBox'
import selectionBoxForDep from '../../publicComponent/selectionBoxForDepartment'
import apiClient from '../../publicJs/ApiClient'
import tip from '../../publicJs/TipBoxService'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
export default {
  name: 'OrganizationLinked',
  data () {
    return {
      navActiveName: 'UserManagement',
      // 面包屑数据
      breadcrumb: [
        {name: '用户管理', link: 'UserManagement'},
        {name: '关联组织', link: ''}
      ],
      // 未关联组织
      unlinkedData: [],
      // 已关联组织
      linkedData: [],
      // 显示关联组织弹窗
      isShowOrg: false,
      // 显示关联部门弹窗
      isShowDep: false,
      // 部门树
      departmentTreeData: [],
      // 用户帐号
      userAccount: '',
      // 用户ID
      userId: '',
      // 分页数
      pageNum: 1,
      // 分页大小
      pageSize: 10,
      // 分页总数
      pageTotal: 0,
      // 查询未关联组织关键字
      keyWord: '',
      // 当前登录用户的角色类型
      isSA: '',
      // 当前登录用户所属的组织信息
      enterprise: {},
      ourId: '',
      // 更换部门的组织名
      orgNameForChange: '',
      // 更换部门的部门名和职位
      currentDepartment: {name: '', position: '', id: ''}
    }
  },
  components: {
    'BreadCrumb': breadCrumb,
    'selectionBox': selectionBox,
    'selectionDep': selectionBoxForDep
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.isSA = this.$root.$children[0].$children[0].isRoot
      this.enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
      this.userAccount = this.$route.query.account
      this.userId = this.$route.query.userId
      this.getLinkedData()
      this.getUnlinkedData()
    },
    // 获取已关联组织
    getLinkedData () {
      let params = {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      // if (!this.isSA) {
      //   params.enterpriseId = this.enterprise.id
      // }
      LoadingBoxService.open('数据加载中...')
      apiClient.get('org/getJoinedOrgsByUser', params).then(data => {
        console.log('getLinkedData', data)
        LoadingBoxService.close()
        this.pageTotal = data.total
        this.linkedData = data.data
      })
    },
    // 获取未关联组织
    getUnlinkedData () {
      if (!this.isSA) return
      let params = {
        userId: this.userId,
        keyword: this.keyWord
      }
      apiClient.get('org/getNotJoinedEnterpriseListByUser', params).then(data => {
        // console.log('getUnlinkedData', data)
        this.unlinkedData = data
      })
    },
    // 关键字查询未关联组织
    getUnlinkedDataForKeyWord (val) {
      this.keyWord = val
      this.getUnlinkedData()
    },
    // 获取部门树
    getDepartmentData (id) {
      apiClient.get('org/queryOrgTrees/' + id).then(data => {
        // console.log('getDepartmentData', data)
        this.departmentTreeData = data[0].children
        this.orgNameForChange = data[0].name
      })
    },
    // 显示关联组织窗口
    onOpenOrgBox () {
      if (this.unlinkedData.length === 0) {
        tip.open('当前无可用的组织关联', 2)
        return
      }
      this.isShowOrg = true
    },
    // 显示更换部门窗口
    onOpenDepBox (item) {
      console.log(item)
      this.isShowDep = true
      this.ourId = item.ourId
      this.currentDepartment.name = item.departmentName
      this.currentDepartment.position = item.position
      this.currentDepartment.id = item.departmentId
      this.getDepartmentData(item.enterpriseId)
    },
    // 为用户关联组织
    onLinkedOrg (data) {
      if (!data.length) {
        tip.open('关联的组织不能为空', 2)
        return
      }
      let eids = []
      for (let i = 0; i < data.length; i++) {
        eids.push(data[i].id)
      }
      let params = {
        userId: this.userId,
        eids: eids.join(',')
      }
      LoadingBoxService.open('数据加载中...')
      apiClient.get('org/joinEnterprises', params).then(data => {
        // console.log('onLinkedOrg', data)
        LoadingBoxService.close()
        tip.open('关联成功')
        this.isShowOrg = false
        this.getLinkedData()
        this.getUnlinkedData()
      }).catch(err => {
        console.log(err)
        LoadingBoxService.close()
        tip.open('关联失败', 2)
        this.isShowOrg = false
        this.unlinkedData = []
        this.getUnlinkedData()
      })
    },
    // 为用户更换部门
    onLinkedDep (data) {
      if (!data.id) {
        tip.open('请选择更换的部门', 2)
        return
      }
      let params = {
        id: this.ourId,
        depId: data.id,
        position: data.position
      }
      LoadingBoxService.open('数据加载中...')
      apiClient.get('org/changeDepartment', params).then(data => {
        // console.log('onLinkedDep', data)
        LoadingBoxService.close()
        tip.open('更换成功')
        this.isShowDep = false
        this.getLinkedData()
      }).catch(err => {
        console.log(err)
        LoadingBoxService.close()
        tip.open('更换失败', 2)
        this.isShowDep = false
      })
    },
    // 分页换页
    handleCurrentChange (val) {
      this.pageNum = val
      this.getLinkedData()
    },
    close () {
      this.isShowOrg = false
    }
  }
}
</script>
<style src="../../css/OrganizationLinked.css" scoped></style>
<style>
#OrganizationLinked .el-pager .number {
  font-weight: normal;
}
</style>

