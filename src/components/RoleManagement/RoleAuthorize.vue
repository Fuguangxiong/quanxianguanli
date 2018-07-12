<template>
  <div id="RoleAuthorize">
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="pa-banner">
      <div>
        <span>角色名称：</span>
        <span>{{roleName}}</span>
      </div>
      <div>
        <span>所属组织：</span>
        <span>{{entName}}</span>
      </div>
      <div>
        <span>所属系统：</span>
        <!-- <span>{{systemName}}</span> -->
        <select-down 
          :val="systemName" 
          :data="systemData" 
          @change="onChangeSystem">
        </select-down>
      </div>
    </div>
    <div class="pa-main-box">
      <div class="pa-tabs-box">
        <div class="pa-nav-item-list">
          <span class="pa-nav-item" :title="item.name" :style="'width:' + 100 / moduleData.length + '%'" @click="onChangeModule(item, index)" :class="{active: moduleIndex === index}" v-for="(item, index) in moduleData" :key="index">{{item.name}}</span>
        </div>
      </div>
      <div class="pa-content-box" v-show="apiShow">
        <div class="pa-content-left">
          <i class="iconfont icon-shuxuanzeqi"></i><span class="pa-title-text">资源列表</span>
          <el-tree
            :data="branchData"
            node-key="id"
            ref="tree"
            highlight-current
            show-checkbox
            :expand-on-click-node="false"
            :filter-node-method="filterTreeNode"
            @node-click="handleNodeClick"
            @check="checkboxSelect"
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="pa-content-right">
          <div class="pa-right-title">
            <span>· 操作列表</span>（资源类型：{{typeName}}）
          </div>
          <div class="pa-list-area" :class="{'short-list': authorityList.length < 4}">
            <div class="pa-list-title">
              <span class="pa-tabel-col1">
                <el-checkbox 
                :indeterminate="isIndeterminate" 
                v-model="checkAll" 
                @change="handleCheckAllChange">
                </el-checkbox>
              </span>
              <span class="pa-tabel-col2" v-show="!isAPI">操作名</span>
              <span class="pa-tabel-col2" v-show="isAPI">操作</span>
              <span class="pa-tabel-col3" v-show="!isAPI">权限码</span>
              <span class="pa-tabel-col3" v-show="isAPI">URL</span>
            </div>
            <div class="pa-list-box">
              <el-checkbox-group v-model="checkedLists" @change="handleCheckedItemsChange">
              <div class="pa-list-content" v-for="(item,index) in authorityList" :key="index">
                <span class="pa-tabel-col1"><el-checkbox v-model="item.ext.isChecked" :label="item.id">{{''}}</el-checkbox></span>
                <span class="pa-tabel-col2" :class="{'scroll-show':authorityList.length>5}">{{item.name}}</span>
                <span class="pa-tabel-col3" :title="item.ext.code" v-show="!isAPI" :class="{'scroll-show':authorityList.length>5}">{{item.ext.code}}</span>
                <span class="pa-tabel-col3" :title="item.ext.url" v-show="isAPI">{{item.ext.url}}</span>
              </div>
              </el-checkbox-group>
            </div>
          </div>
          <div class="pa-button-box">
            <button class="btnBlue btnSpace" @click="onSaveData">保存</button>
            <button class="btnGray" @click="onCancel">取消</button>
          </div>
        </div>
      </div>
      <!-- api权限 -->
      <div class="pa-api" v-show="!apiShow">
        <div class="pa-search-area">
          <span>资源名称：<input type="text" v-model.trim="resourceName" @keyup.enter="searchApi"></span><span>URL：<input type="text" v-model.trim="urlName" @keyup.enter="searchApi"></span><span><button class="btnBlue" @click="searchApi">查找</button></span> 
        </div>
        <div class="pa-title-area"><span><el-checkbox v-model="checked" @change="selectAllFunc"></el-checkbox></span><span>资源名称</span><span>资源类型</span><span>URL</span><span>操作</span></div>
           <div class="pa-detail-areaAll">
           <div class="pa-detail-area" v-for="(item,index) in listDataOnePage" :key='index'><span><el-checkbox v-model="list[index]" @change="selectFunc(item)"></el-checkbox></span><span :title="item.resource.name">{{item.resource.name}}</span><span :title="item.resource.type">{{item.resource.type}}</span><span :title="item.url">{{item.url}}</span><span :title="item.operationName">{{item.operationName}}</span></div>
             <div class="pa-nothing" v-show="!listData.length">
               <div class="nothing-img"></div>
               <div class="nothing-text">未查找到相关数据</div>
             </div>
           </div>
           <div class="paginationBlock block">
             <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page.sync="currentPage3"
               :page-size="pageSize"
               layout="total, prev, pager, next, jumper"
               :total="total">
             </el-pagination>
           </div>
           <div class="pa-bottom"><button class="btnBlue" @click="saveApi">保存</button><button class="btnGray" @click="onCancelSelect">取消</button></div>
      </div>
    </div>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb.vue'
import ApiClient from '../../publicJs/ApiClient'
import TipBoxService from '../../publicJs/TipBoxService'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
import selectDown from '../../publicComponent/selectDown'
export default {
  name: 'RoleAuthorize',
  components: {
    'breadcrumb': breadCrumb,
    'select-down': selectDown
  },
  data () {
    return {
      urlName: '',
      resourceName: '',
      // 储存api授权已经勾选的id
      selectIdArr: [],
      // 储存选中状态的数组
      list: [false, false, false, false, false, false, false, false, false, false],
      // 当前展示的每一个分页的数据
      listDataOnePage: [],
      // 后台给我的全部api资源数据
      listData: [],
      checked: false,
      apiShow: true,
      currentPage3: 1,
      total: 1,
      pageSize: 10,
      navActiveName: 'RoleManagement',
      breadcrumb: [
        {name: '角色管理', link: 'RoleManagement'},
        {name: '授权', link: ''}
      ],
      treeData: [], // 权限树
      branchData: [], // tab分支树
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleName: '',
      entName: '',
      entId: '',
      authorityList: [], // 权限详情
      isAPI: false,
      typeName: '',
      checkAll: false,
      isIndeterminate: false,
      listOptions: [],
      checkedLists: [],
      isChecked: true,
      moduleData: [],
      moduleIndex: 0,
      moduleWidth: 0,
      chooseData: [],
      detailNode: {},
      selectedNodeId: '',
      saveList: [],
      // oldList: [],
      systemName: '',
      systemData: [],
      systemId: '',
      isRoot: false,
      account: '',
      resourceId: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.isRoot = this.$root.$children[0].$children[0].isRoot
      this.entId = this.$route.query.entId
      this.getSystemData()
      this.roleName = sessionStorage.getItem('roleName')
      this.entName = sessionStorage.getItem('entName')
      this.account = sessionStorage.getItem('account')
      this.oldList = []
    },
    // 控制分页的第一页进来时候默认的勾选状态 并且把所有已经授权选中的id放进一个数组
    apiFunc () {
      let param = {
        roleId: this.$route.query.roleId,
        resourceId: this.resourceId,
        enterpriseId: this.entId
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('resource/getAuthorizedApi', param).then(data => {
        this.listData = data
        this.total = this.listData.length
        this.listDataOnePage = this.listData.slice(0, 10)
        let checkedArr = []
        for (let index = 0; index < this.listDataOnePage.length; index++) {
          const element = this.listDataOnePage[index]
          checkedArr.push(element.auth)
        }
        this.list = checkedArr
        for (let i = 0; i < this.listData.length; i++) {
          const element = this.listData[i]
          if (element.auth === true) {
            this.selectIdArr.push(element.id)
          }
        }
        console.log(this.selectIdArr, 'this.selectIdArr')
        LoadingBoxService.close()
      }).catch(e => {
        TipBoxService.open('数据加载失败', 2)
        console.error(e)
        LoadingBoxService.close()
      })
    },
    getSystemData () {
      let that = this
      ApiClient.get('system/getSystemsByEnterpriseId/' + that.entId).then(data => {
        console.log(data, 'data11')
        that.systemData = data
        that.systemName = data[0].name
        that.systemId = data[0].id
        that.getTreeData(that.systemId)
      }).catch(e => {
        TipBoxService.open('数据加载失败', 2)
        console.error(e)
      })
    },
    getTreeData (systemId) {
      let that = this
      let param = {
        roleId: that.$route.query.roleId,
        id: systemId,
        enterpriseId: that.entId
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('resource/queryResourceWithOperationTreesByResourceId', param).then(data => {
        that.treeData = data.children
        let moduleList = []
        let newTreeData = [{
          name: that.systemName,
          type: 'MODULE',
          children: []
        }]
        let isModule = true
        for (let i = 0; i < that.treeData.length; i++) {
          if (that.treeData[i].type !== 'MODULE') {
            isModule = false
            newTreeData[0].children.push(that.treeData[i])
          } else {
            moduleList.push({name: that.treeData[i].name})
            this.resourceId = that.treeData[i].id
            // console.log(this.resourceId, 'this.resourceId')
          }
        }
        if (isModule) {
          that.moduleData = moduleList
          that.branchData = that.treeData[that.moduleIndex].children
        } else {
          that.treeData = newTreeData
          that.moduleData = [{name: that.systemName}]
          that.branchData = that.treeData[that.moduleIndex].children
        }
        that.onInitTree()
        that.onChangeModule(null, 0)
        LoadingBoxService.close()
      }).catch(e => {
        TipBoxService.open('数据加载失败', 2)
        console.error(e)
        LoadingBoxService.close()
      })
    },
    onChangeSystem (item) {
      this.systemName = item.name
      this.systemId = item.id
      this.authorityList = []
      this.typeName = ''
      this.getTreeData(this.systemId)
    },
    onInitTree () {
      this.$nextTick(() => { // 初始化树
      // fu
        if (this.$refs.tree !== undefined) {
          this.$refs.tree.filter()
        }
        this.setData()
        this.handleNodeClick(this.branchData[0])
        this.$refs.tree.setCurrentNode(this.branchData[0])
        /* this.oldList = []
        for (let i = 0; i < this.treeData.length; i++) {
          this.onSaveOldChecked(this.treeData[i].children)
        } */
      })
    },
    setData () {
      this.chooseData = []
      this.onSearchLeaves(this.branchData)
      // fu
      if (this.$refs.tree !== undefined) {
        this.$refs.tree.setCheckedKeys(this.chooseData)
      }
    },
    onFindCheckedNode (node) { // 如果没有子节点且被选中 返回id
      if (node.ext.isChecked) {
        this.chooseData.push(node.id)
      }
    },
    onSearchLeaves (node) { // 初始化遍历叶子节点
      if (!node) {
        return
      }
      for (let i = 0; i < node.length; i++) {
        if (node[i].children && node[i].children.length > 0) {
          this.onSearchLeaves(node[i].children)
        } else {
          this.onFindCheckedNode(node[i])
        }
      }
    },
    onAuthListReset (node) {
      let that = this
      if (!node) {
        return
      }
      for (let i = 0; i < node.length; i++) {
        if (node[i].id === that.selectedNodeId) {
          that.onReplaceAuthList(node[i])
        } else if (node[i].children && node[i].children.length > 0) {
          that.onAuthListReset(node[i].children)
        }
      }
    },
    onReplaceAuthList (data) { // 更新右边列表数据
      let that = this
      let arr = []
      that.isAPI = false
      if (data.type === 'API') {
        that.isAPI = true
      }
      if (data.children.length > 0) {
        for (let i = 0; i < data.children.length; i++) {
          if (data.children[i].type === '') {
            arr.push(data.children[i])
          }
        }
        that.authorityList = arr
        that.listOptions = []
        that.checkedLists = []
        for (let i = 0; i < that.authorityList.length; i++) {
          if (that.authorityList[i].ext.isChecked === true) {
            that.checkedLists.push(that.authorityList[i].id)
          }
          that.listOptions.push(that.authorityList[i].id)
        }
        if (that.checkedLists.length === that.listOptions.length && that.listOptions.length) {
          that.checkAll = true
          that.isIndeterminate = false
        } else if (that.checkedLists.length > 0 && that.checkedLists.length < that.listOptions.length) {
          that.checkAll = false
          that.isIndeterminate = true
        } else {
          that.checkAll = false
          that.isIndeterminate = false
        }
      }
    },
    handleNodeClick (data) {
      let that = this
      that.detailNode = data
      that.selectedNodeId = data.id
      that.onReplaceAuthList(data)
      if (data.type === 'MENU') {
        that.typeName = '菜单'
      } else if (data.type === 'BUTTON') {
        that.typeName = '按钮'
      } else if (data.type === 'API') {
        that.typeName = 'API'
      } else if (data.type === 'CUSTOM') {
        that.typeName = '自定义'
      }
    },
    handleCheckAllChange (val) {
      this.checkedLists = val ? this.listOptions : []
      this.isIndeterminate = false
      if (val) {
        this.chooseData = []
        this.onSelcetedForTree(this.listOptions, this.detailNode)
        this.setData()
      } else {
        this.chooseData = []
        this.onSelcetedForTree([], this.detailNode)
        this.setData()
      }
    },
    handleCheckedItemsChange (val) {
      let checkedCount = val.length
      this.checkAll = checkedCount === this.listOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listOptions.length
      this.chooseData = []
      this.onSelcetedForTree(val, this.detailNode)
      this.setData()
    },
    onSelcetedForTree (list, data) { // 右边选择左边树联动      首先将data的ID跟列表的ID匹配并变更然后替换原数组再重新渲染
      for (let i = 0; i < data.children.length; i++) {
        if (data.children[i].type === '') {
          data.children[i].ext.isChecked = false // 初始化
          for (let j = 0; j < list.length; j++) {
            if (list[j] === data.children[i].id) {
              data.children[i].ext.isChecked = true // 找到选择
            }
          }
        }
      }
      this.onsearchTreeById(data, this.branchData) // 替换原树
    },
    onsearchTreeById (val, node) { // 找替换数据在原树的位置 替换数据,原树
      if (!node) {
        return
      }
      this.onReplaceTree(val, node)
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          this.onsearchTreeById(val, node.children[i])
        }
      }
    },
    onReplaceTree (val, node) { // 找到并替换 替换数据,原树
      let id = val.id
      for (let i = 0; i < node.length; i++) {
        if (node[i].id === id) {
          node[i] = val
        }
      }
    },
    checkboxSelect (val, item) {
      let that = this
      let findId = false
      if (item.checkedKeys) {
        for (let i = 0; i < item.checkedKeys.length; i++) {
          if (val.id === item.checkedKeys[i]) {
            that.checkedLeaf(val.children, true) // 遍历树并联级更改chilren
            that.onFindLeaf(val.id, that.branchData, val) // 找到tree的分支并替换更新
            findId = true
          }
        }
      }
      if (findId === false) {
        that.checkedLeaf(val.children, false) // 遍历树并联级更改chilren
        that.onFindLeaf(val.id, that.branchData, val) // 找到tree的分支并替换更新
      }
      that.onAuthListReset(this.branchData)
    },
    checkedLeaf (node, checked) {
      let that = this
      if (!node) {
        return
      }
      for (let i = 0; i < node.length; i++) {
        if (node[i].type === '') {
          node[i].ext.isChecked = checked
        } else {
          that.checkedLeaf(node[i].children, checked)
        }
      }
    },
    onFindLeaf (id, node, val) {
      let that = this
      if (!node) {
        return
      }
      that.onSearchId(id, node, val)
      if (node.children && node.children.length > 0) {
        for (let j = 0; j < node.children.length; j++) {
          that.onFindLeaf(node.children[j])
        }
      }
    },
    onSearchId (id, node, val) { // 找到树并替换
      for (let i = 0; i < node.length; i++) {
        if (node[i].id === id) {
          node[i] = val
        }
      }
    },
    onChangeModule (item, index) { // 选择模块 过滤非root权限选项
      this.moduleIndex = index
      if (this.systemName !== '智享云 - 权限管理') {
        this.branchData = this.treeData[index].children
      } else if (this.systemName === '智享云 - 权限管理') {
        for (let i = 0; i < this.treeData[index].children.length; i++) {
          if (this.treeData[index].children[i].name === '用户管理' || this.treeData[index].children[i].name === '组织管理' || this.treeData[index].children[i].name === '资源管理') {
            for (let j = 0; j < this.treeData[index].children[i].children.length; j++) {
              if (this.treeData[index].children[i].children[j].name === '导入') {
                this.treeData[index].children[i].children.splice(j, 1)
                j--
              }
            }
          }
        }
        if (!this.isRoot || this.account !== 'root') {
          for (let i = 0; i < this.treeData[index].children.length; i++) {
            if (this.treeData[index].children[i].name === '角色管理') {
              this.treeData[index].children.splice(i, 1)
              i--
            }
          }
        }
        this.branchData = this.treeData[index].children
      }
      this.onInitTree()
    },
    filterTreeNode (value, data, node) { // 过滤处理树
      if (node.data.children && node.data.children.length === 1) {
        node.isLeaf = true
      } else if (node.data.type === 'CUSTOM' && node.data.children.length > 1) {
        for (let i = 0; i < node.data.children.length; i++) {
          if (node.data.children[i].type !== '') {
            node.isLeaf = false
            break
          }
          node.isLeaf = true
        }
      }
      return data.type !== ''
    },
    onSaveData () {
      let that = this
      this.saveList = []
      for (let i = 0; i < this.treeData.length; i++) {
        this.onSearchChecked(this.treeData[i].children)
      }
      /* if (this.oldList.sort().toString() === this.saveList.sort().toString()) {
        TipBoxService.open('授权未更改', 2)
        return false
      } */
      let param = {
        pIds: that.saveList,
        roleId: that.$route.query.roleId,
        resourceId: that.systemId,
        enterpriseId: that.entId
      }
      LoadingBoxService.open('请稍候...')
      ApiClient.post('authorization/authorize', param).then(data => {
        if (data === true) {
          TipBoxService.open('角色授权成功', 0)
          // that.oldList = that.saveList
          // that.getTreeData() 成功不刷新 刷新放出
        } else {
          TipBoxService.open('角色授权失败', 2)
        }
        LoadingBoxService.close()
      }).catch(e => {
        console.error(e)
        TipBoxService.open(e.response.data.exception, 2)
        LoadingBoxService.close()
      })
    },
    onSearchChecked (node) {
      let that = this
      if (!node) {
        return
      }
      for (let i = 0; i < node.length; i++) {
        if (node[i].children && node[i].children.length > 0) {
          that.onSearchChecked(node[i].children)
        } else {
          if (node[i].ext.isChecked) {
            that.saveList.push(node[i].id)
          }
        }
      }
    },
    /* onSaveOldChecked (node) {
      let that = this
      if (!node) {
        return
      }
      for (let i = 0; i < node.length; i++) {
        if (node[i].children && node[i].children.length > 0) {
          that.onSaveOldChecked(node[i].children)
        } else {
          if (node[i].checked) {
            that.oldList.push(node[i].id)
          }
        }
      }
    }, */
    onCancel () {
      this.getTreeData(this.systemId)
    },
    // 全选
    selectAllFunc () {
      console.log(this.listDataOnePage, this.checked)
      // 改变勾选的api权限的id数组
      if (this.checked === true) {
        for (let i = 0; i < this.listDataOnePage.length; i++) {
          const element = this.listDataOnePage[i]
          this.selectIdArr.push(element.id)
          for (let j = 0; j < this.listData.length; j++) {
            // 改变listDataOnePage对应的listData中的每一项的check状态
            const obj = this.listData[j]
            if (obj.id === element.id) {
              obj.auth = true
            }
          }
        }
        this.selectIdArr = [...new Set(this.selectIdArr)]
        this.list = [true, true, true, true, true, true, true, true, true, true]
      } else {
        for (let i = 0; i < this.listDataOnePage.length; i++) {
          for (let j = 0; j < this.listData.length; j++) {
            // 改变listDataOnePage对应的listData中的每一项的check状态
            const obj = this.listData[j]
            if (obj.id === this.listDataOnePage[i].id) {
              obj.auth = false
            }
          }
          for (let j = 0; j < this.selectIdArr.length; j++) {
            if (this.selectIdArr[j] === this.listDataOnePage[i].id) {
              this.selectIdArr.splice(j, 1)
            }
          }
        }
        this.list = [false, false, false, false, false, false, false, false, false, false]
      }
      console.log(this.selectIdArr, 'this.selectIdArr')
    },
    // 单选
    selectFunc (item) {
      // 每次单选的时候去改变对应项在原数据中的check状态
      for (let i = 0; i < this.listData.length; i++) {
        const element = this.listData[i]
        if (element.id === item.id) {
          element.auth = !element.auth
        }
      }
      // 判断单选的时候勾选的id在selectIdArr中有没有 有就删除 没有就添加
      if (this.selectIdArr.includes(item.id)) {
        console.log(item.id)
        console.log(1)
        for (let i = 0; i < this.selectIdArr.length; i++) {
          const element = this.selectIdArr[i]
          if (element === item.id) {
            console.log(2)
            this.selectIdArr.splice(i, 1)
          }
        }
      } else {
        this.selectIdArr.push(item.id)
      }
      console.log(this.selectIdArr, 'this.selectIdArr')
    },
    handleSizeChange () {

    },
    // 切换分页的时候前端截取当前页数据并把状态提取出来赋值给list数组来控制勾选状态
    handleCurrentChange (val) {
      this.listDataOnePage = this.listData.slice((val - 1) * 10, (val - 1) * 10 + 10)
      let checkedArr = []
      for (let index = 0; index < this.listDataOnePage.length; index++) {
        const element = this.listDataOnePage[index]
        checkedArr.push(element.auth)
      }
      this.list = checkedArr
    },
    onCancelSelect () {
      this.apiFunc()
      this.currentPage3 = 1
      this.resourceName = ''
      this.urlName = ''
    },
    saveApi () {
      let that = this
      let param = {
        pIds: that.selectIdArr,
        roleId: that.$route.query.roleId,
        resourceId: that.resourceId,
        enterpriseId: that.entId
      }
      LoadingBoxService.open('请稍候...')
      ApiClient.post('authorization/authorize', param).then(data => {
        if (data === true) {
          TipBoxService.open('角色授权成功', 0)
        } else {
          TipBoxService.open('角色授权失败', 2)
        }
        LoadingBoxService.close()
      }).catch(e => {
        console.error(e)
        TipBoxService.open(e.response.data.exception, 2)
        LoadingBoxService.close()
      })
    },
    // 重置listData的值 并且模拟查询效果
    resetListData () {
      let param = {
        roleId: this.$route.query.roleId,
        resourceId: this.resourceId,
        enterpriseId: this.entId
      }
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('resource/getAuthorizedApi', param).then(data => {
        this.listData = data
        LoadingBoxService.close()
      }).catch(e => {
        TipBoxService.open('数据加载失败', 2)
        console.error(e)
        LoadingBoxService.close()
      })
    },
    // 前端搜索过滤
    searchApi () {
      var listDataOther = []
      for (let i = 0; i < this.listData.length; i++) {
        const element = this.listData[i]
        if (element.resource.name.match(this.resourceName) && element.url.match(this.urlName)) {
          listDataOther.push(element)
        }
      }
      console.log(listDataOther, 'listDataOther')
      this.listData = listDataOther
      this.handleCurrentChange(1)
      this.total = listDataOther.length
      this.currentPage3 = 1
      this.resetListData()
      console.log(this.selectIdArr, 'this.selectIdArr')
    }
  },
  watch: {
    moduleData: {
      handler (val, oldVal) {
        if (val[0].name === 'API权限') {
          this.apiShow = false
          this.apiFunc()
        } else {
          this.apiShow = true
        }
      },
      deep: true
    },
    'list': function (val, oldval) {
      val.every(item => item === true) ? this.checked = true : this.checked = false
      if (val == []) {
        this.checked = false
      }
    }
  }
}
</script>
<style src="../../css/RoleAuthorize.css" scoped>

</style>
<style>
  #RoleAuthorize .el-checkbox-group{
    font-size: 12px;
  }
  #RoleAuthorize .pa-table-tr .el-checkbox__inner{
    margin-left: 10px;
  }
  #RoleAuthorize
    .pa-left-area
    .el-tree
    .el-tree-node__children
    .el-tree-node__content {
    font-weight: normal;
  }
  #RoleAuthorize .pa-left-area .el-tree > .el-tree-node {
    border-bottom: 1px dashed #eeeeee;
    padding-bottom: 4px;
  }
  #RoleAuthorize .pa-left-area .el-tree > .el-tree-node:last-child {
    border-bottom: 0;
    padding-bottom: 4px;
  }
  #RoleAuthorize .el-tree-node__label {
    font-size: 12px;
  }
  #RoleAuthorize .el-tree{
    overflow: auto;
    height: 100%;
  }
  #RoleAuthorize .el-checkbox-group{
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y:auto;
    overflow-x:hidden;
  }
  #RoleAuthorize .pa-list-box .el-checkbox__input{
    margin-left: 20%;
  }
  #RoleAuthorize .el-tree-node__label{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  #RoleAuthorize .el-tree{
    color: #444;
  }
  #RoleAuthorize .el-tree-node__content {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
  #RoleAuthorize .el-tree .el-tree-node__children .el-tree-node__content {
    display: block;
    font-weight: 500;
  }
  #RoleAuthorize .el-checkbox__input span{
    transform: translateY(2px);
  }
  #RoleAuthorize .el-tree .el-tree-node__children .el-tree-node__content span{
    transform: translateY(0px);
  }
  #RoleAuthorize .el-pagination__editor.el-input .el-input__inner {
  height: 25px;
  }
  #RoleAuthorize .el-pager li{
  font-weight: normal;
 }
  #RoleAuthorize .el-pagination__editor .el-input__inner {
  border: none;
  border-radius: 0px;
  width: 65%;
 }
</style>
