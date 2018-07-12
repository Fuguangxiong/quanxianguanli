<template>
  <div id="PermissionsPointManagement">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-select-system">
      <span>系统：</span>
      <select-down 
        :val="systemName" 
        :data="systemData" 
        @change="onChangeSystem">
      </select-down>
    </div>
    <div class="pa-module-nav">
      <div class="pa-nav-item-list">
        <span class="pa-nav-item" 
          :title="item.name" 
          :style="'width:' + 100 / moduleData.length + '%'" 
          @click="onChangeModule(item, index)" 
          :class="{active: moduleId === item.id}" 
          v-for="(item, index) in moduleData" :key="index">{{item.name}}</span>
      </div>
      <div class="pa-export-import">
         <div class="pa-export" v-if="verifyPermission('004005')" @click="onExport">
          <i class="iconfont icon-daochu-tianchong"></i><span>导出</span>
        </div>
        <div class="pa-import" v-if="$parent.isRootRole" @click="onImport">
          <i class="iconfont icon-daoru"></i><span>导入</span>
        </div>
      </div>
    </div>
    <div class="pa-resource pa-res-normal" v-show="!isAPI">
      <div class="pa-resource-left">
        <div class="pa-left-title">
           <i class="iconfont icon-shuxuanzeqi"></i><span class="pa-title-text">资源树</span>
           <div class="pa-add-root" v-if="verifyPermission('004001')" @click="onAddRoot">
             <i class="iconfont icon-tianjiayuzhuceqiye"></i><span>添加根节点</span>
           </div>
        </div>
        <div class="pa-left-tree">
          <el-tree
            ref="tree"
            :props="defaultProps"
            class="pa-tree-areainfo"
            :data="resourceTreeData"
            node-key="id"
            :default-expanded-keys="defaultKey"
            :highlight-current="hLightStatus"
            @node-click="onShowResData"
            :expand-on-click-node="false">
            <span v-show="data.id !== '-1'" class="custom-tree-node" slot-scope="{ node, data }">
              <span class="pa-tree-label" :title="node.label">{{ node.label }}</span>
              <span class="pa-tree-icon" v-show="nodeKey === node.key">
                <span
                  v-if="verifyPermission('004002')"
                  @click.stop="onAdd(data, node)"
                  :class="{active: isEdit === 'add'}"
                  title="新增"
                  class="iconfont icon-tianjiayuzhuceqiye icon">
                </span>
                <span
                  v-if="verifyPermission('004003')"
                  @click.stop="onEdit(data, node)"
                  :class="{active: isEdit === 'edit'}"
                  title="编辑"
                  class="iconfont icon-bianji1 icon">
                </span>
                <span
                  v-if="verifyPermission('004004')"
                  @click.stop="onDelete(data, node)"
                  title="删除"
                  class="iconfont icon-xiazai14 icon">
                </span>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="pa-resource-right">
        <div class="pa-right-title">
          <i class="dian"></i><span>{{rightTitle}}</span>
        </div>
        <div class="pa-resource-info">
          <el-row>
            <div class="pa-input-line">
              <el-col :span="7"><span class="pa-input-title must">资源名称：</span></el-col>
              <el-col :span="17">
                <div class="pa-input">
                  <span v-show="!isEdit">{{resourceName}}</span>
                  <input v-show="isEdit" maxlength="15" ref="firstInput" v-va.must="{reg: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, errorTip: '！资源名称只能由汉字、字母、数字组成'}" type="text" v-model.trim="resourceName"/>
                </div>
              </el-col> 
            </div> 
          </el-row>
          <el-row>
            <div class="pa-input-line" v-show="isShowFa">
              <el-col :span="7"><span class="pa-input-title must">上级资源：</span></el-col>
              <el-col :span="17">
                <div class="pa-input">
                  <span v-show="!isEdit">{{resourceParent}}</span>
                  <div class="pa-parent-res" v-show="isEdit">
                    <input disabled type="text" v-model="resourceParent"/>
                    <i class="iconfont icon-zuzhiguanli" @click.stop="onToggle"></i>
                    <div v-show="isShowResTree" ref="resourceParent" class="pa-parent-tree">
                      <el-tree
                        ref="tree2"
                        node-key="id"
                        :data="resourceTreeData"
                        default-expand-all
                        :filter-node-method="filterSelf"
                        :props="defaultProps"
                        @node-click="onChangeResParent">
                      </el-tree>
                    </div>
                  </div>
                </div>
              </el-col> 
            </div> 
          </el-row>
          <el-row>
            <div class="pa-input-line">
              <el-col :span="7"><span class="pa-input-title must">资源类型：</span></el-col>
              <el-col :span="17">
                <div class="pa-input">
                  <select-down 
                    v-show="isEdit === 'add'"
                    :width="270"
                    :defaultProps="{name: 'label'}" 
                    :val="resourceTypeLabel" 
                    :data="resourceTypeList" 
                    @change="onChangeType">
                  </select-down>
                  <span v-show="isEdit !== 'add'">{{resourceTypeLabel}}</span>
                </div>
              </el-col> 
            </div> 
          </el-row>
          <el-row>
            <div class="pa-input-line">
              <el-col :span="7"><span class="pa-input-title must">序号：</span></el-col>
              <el-col :span="17">
                <div class="pa-input">
                  <span v-show="!isEdit">{{resourceSort}}</span>
                  <input v-show="isEdit" ref="sort" maxlength="3" v-va.must="{reg: /^[0-9]+$/, errorTip: '！必须由非负整数组成'}" v-model.trim.number="resourceSort"/>
                </div>
              </el-col> 
            </div> 
          </el-row>
          <el-row>
            <div class="pa-input-line" v-show="resourceType === 'API'">
              <el-col :span="7"><span class="pa-input-title must">URL：</span></el-col>
              <el-col :span="17">
                <div class="pa-input">
                  <span v-show="!isEdit" :title="APIUrl">{{APIUrl}}</span>
                  <input v-show="isEdit" :title="APIUrl" ref="url" v-va.must="{reg: /^[A-Za-z0-9:.?+&@#%=~_|\/]+$/, errorTip: '！url由字母、数字和.:/?+&@#%=~_|组成'}" type="text" v-model.trim="APIUrl"/>
                </div>
              </el-col> 
            </div> 
          </el-row>
          <el-row>
            <div class="pa-input-line">
              <el-col :span="7"><span class="pa-input-title must">操作：</span></el-col>
              <el-col :span="17">
                <div class="pa-input">
                  <div class="pa-operate-box" v-show="resourceType !== 'API'">
                    <div class="pa-box-head clearfix">
                      <span class="pa-col1">操作名</span>
                      <span class="pa-col2">权限码</span>
                    </div>
                    <div class="pa-box-row clearfix" v-for="(item, index) in resourceOperate" :key="index">
                      <span class="pa-col1">
                        <span :title="item.permissionOperationName" v-show="isEdit !== 'add' || resourceType !== 'CUSTOM'">{{item.permissionOperationName}}</span>
                        <input class="code-input" maxlength="8" v-show="isEdit === 'add' && resourceType === 'CUSTOM'" type="text" v-model.trim="item.permissionOperationName">
                      </span>
                      <span class="pa-col2">
                        <input class="code-input" maxlength="15" v-show="isEdit === 'add' || (isEdit === 'edit' && resourceType !== 'CUSTOM')" type="text" v-model.trim="item.permissionCode">
                        <span v-show="isEdit !== 'add' && (isEdit !== 'edit' || resourceType === 'CUSTOM')">{{item.permissionCode}}</span>
                      </span>
                      <span class="pa-operate-icon">
                        <i class="iconfont icon-bianji1" @click="onEditOperate(item, index)" v-show="resourceType === 'CUSTOM' && isEdit === 'edit'"></i>
                        <i class="iconfont icon-xiazai14" @click="onDeleteOperate(item, index)" v-show="resourceType === 'CUSTOM' && isEdit && resourceOperate.length > 1"></i>
                      </span>
                    </div>
                  </div>
                  <i v-show="resourceType === 'CUSTOM' && isEdit" @click="onAddOperate" class="iconfont icon-xinzeng"></i>
                  <select-down 
                    v-show="resourceType === 'API' && isEdit"
                    :width="270" 
                    :val="apiMethod" 
                    :data="apiOption" 
                    @change="onChangeApi">
                  </select-down>
                  <span v-show="resourceType === 'API' && !isEdit">{{apiMethod}}</span>
                </div>
              </el-col> 
            </div> 
          </el-row>
          <el-row>
            <div class="pa-input-line">
              <el-col :span="7">
                <span class="pa-blank"></span>
              </el-col>
              <el-col :span="17">
                <div class="pa-input-btn" v-show="isEdit">
                  <button type="button" class="btnBlue btn-left" @click="onChange">保存</button>
                  <button type="button" class="btnGray btn-right" @click="onCancle">取消</button>
                </div>
              </el-col> 
            </div> 
          </el-row>
        </div>
      </div>
    </div>
    <div class="pa-resource pa-res-api" v-show="isAPI">
      <div class="pa-resource-main">
        <div class="pa-resource-top">
          <div class="pa-resource-input">
            <span>资源名称：</span>
            <input type="text" v-model="searchName" @keyup.enter="onSearchAPI">
          </div>
          <div class="pa-resource-input">
            <span>URL：</span>
            <input type="text" v-model="searchURL" @keyup.enter="onSearchAPI">
          </div>
          <button class="btnBlue" @click="onSearchAPI">查找</button>
        </div>
        <div class="pa-resource-list">
          <span class="pa-link-add" @click="onAddAPI">
            <i class="iconfont icon-xinzeng"></i>
            <span class="pa-add-text">新增</span>
          </span>
          <div class="pa-linked-table">
            <div class="pa-table-head">
              <span class="pa-table-col1">资源名称</span>
              <span class="pa-table-col2">资源类型</span>
              <span class="pa-table-col3">URL</span>
              <span class="pa-table-col4">操作</span>
              <span class="pa-table-col5"></span>
            </div>
            <div class="pa-nothing" v-show="!APIList.length">
              <div class="nothing-img"></div>
              <div class="nothing-text">未查找到相关数据</div>
            </div>
            <div class="pa-table-body">
              <div class="pa-table-row" v-for="(item ,index) in APIList" :key=index>
                <span class="pa-table-col1">{{item.resourceName}}</span>
                <span class="pa-table-col2">{{item.resourceType}}</span>
                <span class="pa-table-col3">{{item.url}}</span>
                <span class="pa-table-col4">{{item.permissionOperationName}}</span>
                <span class="pa-table-col5">
                  <span
                    v-if="verifyPermission('004003')"
                    title="编辑"
                    @click.stop="onEditAPI(item)"
                    class="iconfont icon-bianji1 icon">
                  </span>
                  <span
                    v-if="verifyPermission('004004')"
                    title="删除"
                    @click.stop="onDeleteShow(item)"
                    class="iconfont icon-xiazai14 icon">
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
    <notice-box v-show="isDelete" :type="2" @closeBox="isDelete = false" @confirm="deleteRes" :content="'删除此资源会自动删除对应的授权，您确认要删除此资源吗？'"></notice-box>
    <notice-box v-show="isConfirm" :title="confirmTitle" :type="confirmType" @closeBox="isConfirm = false" @confirm="confirmFunction" :content="confirmText"></notice-box>
    <notice-box v-show="isDeleteAPI" :type="2" @closeBox="isDeleteAPI = false" @confirm="onDeleteAPI" :content="'删除此API会自动删除对应的授权，您确认要删除此资源吗？'"></notice-box>
    <edit-code-box v-show="isEditCode" @closeBox="isEditCode = false" @confirm="confirmFunction" :data="operateForEdit" :isEdit="operateEditType"></edit-code-box>
    <edit-API-box v-show="isAPIEdit" @closeBox="isAPIEdit = false" @confirm="onSetAPI" :isEdit="EditAPIType" :data="APIEditInfo"></edit-API-box>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import selectDown from '../../publicComponent/selectDown'
import noticeBox from '../../publicComponent/noticeBox'
import EditCodeBox from './EditCodeBox'
import EditAPIBox from './EditAPIBox'
import ApiClient from '../../publicJs/ApiClient'
import tip from '../../publicJs/TipBoxService'
import loading from '../../publicJs/LoadingBoxService.js'
import constants from '../../publicJs/Constants'
export default {
  name: 'PermissionsPointManagement',
  components: {
    'BreadCrumb': breadCrumb,
    'select-down': selectDown,
    'notice-box': noticeBox,
    'edit-code-box': EditCodeBox,
    'edit-API-box': EditAPIBox
  },
  data () {
    return {
      navActiveName: 'PermissionsPointManagement',
      va_error_flag: 0,
      onlyone: true,
      breadcrumb: [
        {name: '资源管理', link: ''}
      ],
      // 系统名称
      systemName: '',
      systemId: '',
      // 是否显示系统下拉列表
      isShowSystemList: false,
      // 获取的系统
      systemData: [],
      // 获取的模块数据
      moduleData: [],
      moduleId: 0,
      moduleName: '',
      moduleWidth: 0,
      // 资源树数据
      resourceTreeData: [],
      // 高亮显示的状态
      hLightStatus: true,
      // 默认展开的ID
      defaultKey: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      nodeKey: '',
      isEdit: '',
      // 右边标题
      rightTitle: '资源信息',
      // 当前资源的类型
      currentResType: '',
      // 资源信息
      resInfo: {},
      resourceSort: null,
      resourceName: '',
      resourceId: '',
      resourceParent: '',
      resourceParentId: '',
      resourceType: '',
      resourceTypeList: [
        {label: '菜单', type: 'MENU'},
        {label: '按钮', type: 'BUTTON'},
        {label: '自定义', type: 'CUSTOM'}
      ],
      APIUrl: '',
      resourceOperate: [],
      // api方法
      apiOption: [
        {name: 'GET'},
        {name: 'POST'},
        {name: 'PUT'},
        {name: 'DELETE'}
      ],
      apiMethod: '',
      // 显示上级资源树
      isShowResTree: false,
      // 是否显示上级资源栏
      isShowFa: true,
      // 显示删除提示框
      isDelete: false,
      // 确认框信息
      confirmFunction: '',
      confirmText: '',
      confirmType: 2,
      confirmTitle: '',
      isConfirm: false,
      // 自定义编辑操作框
      isEditCode: false,
      operateForEdit: {
        permissionOperationName: '',
        permissionCode: ''
      },
      operateEditType: '',
      isAPI: false, // 是否API模块
      isAPIEdit: false,
      searchName: '',
      searchURL: '',
      isSearch: false,
      EditAPIType: '',
      APIEditInfo: {
        resourceName: '',
        checkList: [],
        url: '',
        isAll: false
      },
      APIResId: '',
      APIPermissionId: '',
      APIList: [],
      isDeleteAPI: false
    }
  },
  computed: {
    resourceTypeLabel () {
      for (let i = 0; i < this.resourceTypeList.length; i++) {
        const el = this.resourceTypeList[i]
        if (el.type === this.resourceType) {
          return el.label
        }
      }
    }
  },
  watch: {
    isEdit (v, o) {
      if (v !== o) {
        this.va_error_flag = 0
        let inputArray = [this.$refs.firstInput, this.$refs.url, this.$refs.sort]
        for (let i = 0; i < inputArray.length; i++) {
          inputArray[i].nextSibling.textContent = ''
          inputArray[i].style.borderColor = ''
        }
      }
      if (v !== 'add' && !this.hLightStatus) {
        this.hLightStatus = true
      }
      let filterIds = [this.nodeKey]
      function findChild (data) {
        for (let i = 0; i < data.length; i++) {
          filterIds.push(data[i].id)
          if (data[i].children.length !== 0) {
            findChild(data[i].children)
          }
        }
      }
      if (v === 'edit') {
        let data = this.$refs.tree2.getNode(this.nodeKey).data
        findChild(data.children)
        this.$refs.tree2.filter(filterIds)
      } else {
        this.$refs.tree2.filter()
      }
    },
    resourceType (v, o) {
      if (o === 'API') {
        this.$refs.url.nextSibling.textContent = ''
        this.$refs.url.style.borderColor = ''
      }
      if (this.isEdit === 'add') {
        if (v === 'MENU' || v === 'BUTTON') {
          this.resourceOperate = [{permissionOperationName: '是否可见', permissionCode: ''}]
        } else if (v === 'CUSTOM') {
          this.resourceOperate = [{permissionOperationName: '', permissionCode: ''}]
        } else if (v === 'API') {
          this.resourceOperate = [{permissionOperationName: 'GET', permissionCode: ''}]
          this.apiMethod = 'GET'
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getSystemData()
    },
    // 获取系统列表
    getSystemData () {
      let eId = JSON.parse(sessionStorage.getItem('enterprise')).id
      loading.open('数据加载中...')
      ApiClient.get('system/getSystemsByEnterpriseId/' + eId).then(data => {
        loading.close()
        this.systemData = data
        this.systemName = data[0].name
        this.systemId = data[0].id
        this.getModuleData(this.systemData[0].id)
      })
    },
    // 获取模块列表
    getModuleData (id) {
      loading.open('数据加载中...')
      ApiClient.get('module/getModulesBySystemId/' + id).then(data => {
        loading.close()
        if (data.length === 0) {
          this.moduleData = [{name: this.systemName, id: id}]
        } else {
          this.moduleData = data
        }
        this.moduleId = this.moduleData[0].id
        this.moduleName = this.moduleData[0].name
        if (this.moduleName === 'API权限') {
          this.isAPI = true
          this.searchName = ''
          this.searchURL = ''
          this.isSearch = false
          this.getAPIData(this.systemId)
        } else {
          this.isAPI = false
          this.getResTreeData()
        }
      })
    },
    // 获取资源树列表
    getResTreeData (id, type) {
      loading.open('数据加载中...')
      ApiClient.get('resource/queryResourceTreesByResourceId/' + this.moduleId).then(data => {
        // console.log('data', data)
        loading.close()
        this.resourceTreeData = data.children
        if (id === undefined) {
          let data = this.resourceTreeData[0]
          if (data) {
            this.$nextTick(function () {
              this.defaultKey = [data.id]
              this.$refs.tree.setCurrentKey(data.id)
            })
            this.onShowResData(data, {level: 1})
          } else {
            // 如果没有资源 显示空白
            this.resourceName = ''
            this.resourceId = ''
            this.resourceParent = ''
            this.resourceParentId = ''
            this.resourceType = ''
            this.resourceOperate = []
          }
        } else {
          this.$nextTick(function () {
            this.defaultKey = [id]
            this.$refs.tree.setCurrentKey(id)
            // console.log(this.$refs.tree.getNode(id).expanded)
            // this.$refs.tree.getNode(id).parent.expanded = true
            this.onShowResData({id: id, type: type}, this.$refs.tree.getNode(id))
          })
        }
      })
    },
    // 获取资源信息
    getResData (id, type) {
      let params = {id: id, resourceType: type}
      loading.open('数据加载中...')
      ApiClient.get('resource/getById', params).then(data => {
        // console.log(data)
        loading.close()
        this.resInfo = data
        this.resourceSort = this.resInfo[0].resourceSort
        this.resourceId = this.resInfo[0].resourceId
        this.resourceName = this.resInfo[0].resourceName
        this.resourceParent = this.resInfo[0].resourceParentName
        this.resourceParentId = this.resInfo[0].resourceParentId
        this.resourceType = type
        this.APIUrl = this.resInfo[0].url
        if (type === 'API') {
          this.apiMethod = this.resInfo[0].permissionOperationName
        }
        this.resourceOperate = []
        for (let i = 0; i < this.resInfo.length; i++) {
          this.resourceOperate.push(this.resInfo[i])
        }
      })
    },
    // 获取API信息
    getAPIData (id, name, url) {
      let param = {
        systemId: id,
        name: name,
        url: url
      }
      loading.open('数据加载中...')
      ApiClient.get('resource/queryApiList', param).then(data => {
        loading.close()
        this.APIList = data.data
      }).catch(e => {
        console.error(e)
        tip.open('数据加载失败', 2)
      })
    },
    // 切换系统
    onChangeSystem (item) {
      this.systemName = item.name
      this.systemId = item.id
      this.resourceOperate = []
      this.resourceName = ''
      this.resourceSort = null
      this.resourceType = ''
      this.getModuleData(item.id)
    },
    // 切换模块
    onChangeModule (item) {
      this.moduleName = item.name
      this.moduleId = item.id
      if (this.moduleName === 'API权限') {
        this.isAPI = true
        this.searchName = ''
        this.searchURL = ''
        this.isSearch = false
      } else {
        this.isAPI = false
        this.getResTreeData()
      }
    },
    // 显示资源信息
    onShowResData (data, node) {
      // console.log('node', node)
      this.nodeKey = data.id
      this.rightTitle = '资源信息'
      this.isEdit = ''
      this.currentResType = data.type
      this.isShowFa = node.level !== 1
      // this.resourceParent = node.parent ? node.parent.data.name : ''
      this.getResData(data.id, data.type)
    },
    // 新增根节点
    onAddRoot () {
      this.isEdit = 'add'
      this.$nextTick(() => {
        this.$refs.firstInput.focus()
      })
      this.rightTitle = '添加资源根节点'
      this.isShowFa = false
      this.resourceName = ''
      this.resourceParentId = this.moduleId
      this.resourceParent = ''
      this.resourceType = 'MENU'
      this.resourceOperate = [{permissionOperationName: '是否可见', permissionCode: ''}]
      this.APIUrl = ''
      this.hLightStatus = false
      this.nodeKey = -1
    },
    // 新增
    onAdd (data, node) {
      this.isEdit = 'add'
      this.$nextTick(() => {
        this.$refs.firstInput.focus()
      })
      this.rightTitle = '添加资源'
      this.isShowFa = true
      this.isShowResTree = false
      this.resourceName = ''
      this.resourceParent = data.name
      this.resourceParentId = data.id
      this.resourceSort = data.children.length
      this.resourceType = 'MENU'
      this.resourceOperate = [{permissionOperationName: '是否可见', permissionCode: ''}]
      this.APIUrl = ''
    },
    // 编辑
    onEdit (data, node) {
      this.isEdit = 'edit'
      this.rightTitle = '编辑资源'
      this.isShowFa = node.level !== 1
      this.isShowResTree = false
      this.resourceName = this.resInfo[0].resourceName
      this.resourceId = this.resInfo[0].resourceId
      this.resourceParent = this.resInfo[0].resourceParentName
      this.resourceParentId = this.resInfo[0].resourceParentId
      this.resourceSort = this.resInfo[0].resourceSort
      this.resourceType = data.type
      this.APIUrl = this.resInfo[0].url
      this.resourceOperate = []
      for (let i = 0; i < this.resInfo.length; i++) {
        this.resourceOperate.push(this.resInfo[i])
      }
    },
    // 删除
    onDelete (data, node) {
      if (!node.isLeaf) {
        tip.open('该节点下存在子资源，不能删除', 2)
      } else {
        this.isDelete = true
      }
    },
    deleteRes () {
      ApiClient.delete('resource/delete/' + this.resourceId + '?resourceType=' + this.resourceType).then(data => {
        console.log(data)
        tip.open('删除成功')
        this.isDelete = false
        this.defaultKey = []
        let parentNode = this.$refs.tree.getNode(this.resInfo[0].resourceParentId)
        if (parentNode) {
          this.getResTreeData(this.resInfo[0].resourceParentId, parentNode.data.type)
        } else {
          this.getResTreeData()
        }
      }).catch(e => {
        console.log(e)
        tip.open('删除失败', 2)
        this.isDelete = false
      })
    },
    onChangeResParent (data, node) {
      this.resourceParent = data.name
      this.resourceParentId = data.id
      this.isShowResTree = false
    },
    // 切换资源类型
    onChangeType (item) {
      this.resourceType = item.type
      if (item.type === 'API') {
        this.$nextTick(() => {
          this.$refs.url.focus()
        })
      }
    },
    // 切换api方法
    onChangeApi (item) {
      this.apiMethod = item.name
      this.resourceOperate = [{permissionId: this.resInfo[0].permissionId, permissionCode: '', permissionOperationName: this.apiMethod}]
    },
    // 编辑时 上级资源树过滤掉自己以下的部门
    filterSelf (value, data) {
      if (!value) {
        return true
      }
      return value.indexOf(data.id) === -1
    },
    // 修改操作权限码
    onEditOperate (item, index) {
      this.isEditCode = true
      this.operateEditType = 'edit'
      this.operateForEdit = item
      this.confirmFunction = (data) => {
        if (!data.permissionCode) {
          tip.open('操作名和权限码不能为空', 2)
          return
        }
        if (!/^[A-Za-z0-9]+$/.test(data.permissionCode)) {
          tip.open('权限码只能由字母和数字组成', 2)
          return
        }
        let params = {
          id: data.permissionId,
          operationName: data.permissionOperationName,
          code: data.permissionCode,
          resource: {
            id: this.resourceId
          }
        }
        ApiClient.post('permission/saveOrUpdate/' + this.systemId, params).then(data => {
          console.log(data)
          this.isEditCode = false
        }).catch(e => {
          if (e.response.status === 501) {
            tip.open(e.response.data.exception, 2)
          } else {
            tip.open('修改失败', 2)
          }
        })
      }
    },
    // 删除操作
    onDeleteOperate (item, index) {
      if (!item.permissionId) {
        this.resourceOperate.splice(index, 1)
      } else {
        this.confirmFunction = () => {
          let params = {
            id: item.permissionId
          }
          ApiClient.delete('permission/delete', params).then(data => {
            console.log(data)
            this.resourceOperate.splice(index, 1)
            this.isConfirm = false
          }).catch(e => {
            console.log(e)
            if (e.response.status === 501) {
              tip.open(e.response.data.exception, 2)
              this.isConfirm = false
              return
            }
            tip.open('删除失败', 2)
          })
        }
        this.confirmText = '删除此操作会自动删除对应的授权，您确认要删除此操作吗？'
        this.confirmTitle = ''
        this.confirmType = 2
        this.isConfirm = true
      }
    },
    onAddOperate (item) {
      if (this.isEdit === 'add') {
        this.resourceOperate.push({permissionOperationName: '', permissionCode: ''})
      } else if (this.isEdit === 'edit') {
        this.isEditCode = true
        this.operateEditType = 'add'
        this.operateForEdit = {permissionOperationName: '', permissionCode: ''}
        this.confirmFunction = (data) => {
          if (!data.permissionCode || !data.permissionOperationName) {
            tip.open('操作名和权限码不能为空', 2)
            return
          }
          if (!/^[A-Za-z0-9]+$/.test(data.permissionCode)) {
            tip.open('权限码只能由字母和数字组成', 2)
            return
          }
          for (let i = 0; i < this.resourceOperate.length; i++) {
            const el = this.resourceOperate[i]
            if (el.permissionOperationName === data.permissionOperationName) {
              tip.open('操作名不能重复', 2)
              return
            }
          }
          let params = {
            operationName: data.permissionOperationName,
            code: data.permissionCode,
            resource: {
              id: this.resourceId
            }
          }
          ApiClient.post('permission/saveOrUpdate/' + this.systemId, params).then(data => {
            console.log(data)
            this.getResData(this.resourceId, this.resourceType)
            this.isEditCode = false
          }).catch(e => {
            if (e.response.status === 501) {
              tip.open(e.response.data.exception, 2)
            } else {
              tip.open('修改失败', 2)
            }
          })
        }
      }
    },
    // 更新和保存
    onChange () {
      if (this.resourceName === '' || !/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(this.resourceName)) {
        this.$refs.firstInput.focus()
        return
      }
      if (this.resourceSort === '' || !/^[0-9]+$/.test(this.resourceSort)) {
        this.$refs.sort.focus()
        return
      }
      if (this.resourceType === 'API' && (this.APIUrl === '' || !/^[A-Za-z0-9:.?+&@#%=~_|/]+$/.test(this.APIUrl))) {
        this.$refs.url.focus()
        return
      }
      if (this.resourceName === this.resourceParent) {
        tip.open('资源名称不能与上级资源同名', 2)
        return
      }
      let url = ''
      if (this.isEdit === 'add') {
        url = 'resource/save'
        if (this.resourceType === 'CUSTOM') {
          let arr = []
          for (let i = 0; i < this.resourceOperate.length; i++) {
            const el = this.resourceOperate[i]
            if (arr.indexOf(el.permissionOperationName) !== -1) {
              tip.open('操作名不能重复', 2)
              return
            } else {
              arr.push(el.permissionOperationName)
            }
          }
        }
      } else if (this.isEdit === 'edit') {
        url = 'resource/update'
      }
      let permissionList = []
      if (this.isEdit !== 'edit' || this.resourceType !== 'CUSTOM') {
        for (let i = 0; i < this.resourceOperate.length; i++) {
          const el = this.resourceOperate[i]
          if (!el.permissionOperationName || (!el.permissionCode && this.resourceType !== 'API')) {
            tip.open('操作名和权限码不能为空', 2)
            return
          }
          if (!/^[A-Za-z0-9]+$/.test(el.permissionCode) && this.resourceType !== 'API') {
            tip.open('权限码只能由字母和数字组成', 2)
            return
          }
          permissionList.push({id: el.permissionId, code: el.permissionCode, operationName: el.permissionOperationName})
        }
      }
      let params = {
        resource: {
          id: this.resourceId,
          type: this.resourceType,
          name: this.resourceName,
          parentId: this.resourceParentId,
          sort: this.resourceSort,
          systemId: this.systemId
        },
        permissions: permissionList,
        url: this.APIUrl
      }
      this.defaultKey = []
      // console.log(params)
      ApiClient.post(url, params).then(data => {
        // console.log(data)
        if (this.isEdit === 'add') {
          tip.open('新增成功')
          this.getResTreeData(data, this.resourceType)
        } else {
          tip.open('编辑成功')
          this.getResTreeData(this.resourceId, this.resourceType)
        }
        this.isEdit = ''
        this.rightTitle = '资源信息'
      }).catch(e => {
        if (e.response.status === 501) {
          tip.open(e.response.data.exception, 2)
        } else {
          tip.open('保存失败', 2)
        }
      })
    },
    onCancle () {
      if (this.nodeKey === -1) {
        this.nodeKey = this.resourceId
      }
      this.isShowFa = this.resInfo[0].resourceParentName
      this.isEdit = ''
      this.rightTitle = '资源信息'
      this.resourceName = this.resInfo[0].resourceName
      this.resourceId = this.resInfo[0].resourceId
      this.resourceParent = this.resInfo[0].resourceParentName
      this.resourceParentId = this.resInfo[0].resourceParentId
      this.resourceSort = this.resInfo[0].resourceSort
      this.resourceType = this.currentResType
      this.APIUrl = this.resInfo[0].url
      this.resourceOperate = []
      for (let i = 0; i < this.resInfo.length; i++) {
        this.resourceOperate.push(this.resInfo[i])
      }
    },
    // API方法
    onAddAPI () {
      this.EditAPIType = 'add'
      this.APIEditInfo = {
        resourceName: '',
        checkList: [],
        url: '',
        isAll: false
      }
      this.isAPIEdit = true
    },
    onEditAPI (data) {
      this.APIResId = data.resourceId
      this.APIPermissionId = data.permissionId
      this.EditAPIType = 'edit'
      this.isAPIEdit = true
      this.APIEditInfo.resourceName = data.resourceName
      this.APIEditInfo.url = data.url
      if (data.permissionOperationName === '*') {
        this.APIEditInfo.checkList = ['GET', 'PUT', 'POST', 'DELETE', '全部']
        this.APIEditInfo.isAll = true
      } else {
        this.APIEditInfo.checkList = data.permissionOperationName.split(',')
        this.APIEditInfo.isAll = false
      }
    },
    onDeleteShow (data) {
      this.isDeleteAPI = true
      this.APIResId = data.resourceId
    },
    onDeleteAPI () {
      ApiClient.delete('resource/delete/' + this.APIResId + '?resourceType=API').then(data => {
        this.isDeleteAPI = false
        tip.open('删除成功')
        if (this.isSearch) {
          this.getAPIData(this.systemId, this.searchName, this.searchURL)
        } else {
          this.getAPIData(this.systemId)
        }
      }).catch(e => {
        console.error(e)
        this.isDeleteAPI = false
        tip.open('删除失败', 2)
      })
    },
    onSearchAPI () {
      if (this.searchName.trim() !== '' && this.searchURL.trim() !== '') {
        this.isSearch = true
      } else {
        this.isSearch = false
      }  
      this.getAPIData(this.systemId, this.searchName, this.searchURL)
    },
    onSetAPI (data) {
      let urlReg = /^[A-Za-z0-9:.*?+&@#%=~_|\/]+$/
      if (data.resourceName.trim() === '') {
        tip.open('资源名称不能为空', 2)
        return
      }
      if (data.checkList.length === 0) {
        tip.open('操作不能为空', 2)
        return
      }
      if (data.url.trim() === '') {
        tip.open('URL不能为空', 2)
        return
      }
      let regTest = urlReg.test(data.url)
      if (!regTest) {
        tip.open('url由字母、数字和.:*/?+&@#%=~_|组成', 2)
        return
      }
      let operationInfo = ''
      if (data.checkList.length === 5) {
        operationInfo = '*'
      } else {
        operationInfo = data.checkList.join('/')
      }
      let params = {
        resource: {
          type: 'API',
          name: data.resourceName,
          parentId: this.moduleId,
          sort: 0,
          systemId: this.systemId,
          id: this.APIResId
        },
        permissions: [{
          code: '',
          operationName: operationInfo,
          id: this.APIPermissionId
        }],
        url: data.url
      }
      let url = ''
      if (this.EditAPIType === 'add') {
        url = 'resource/save'
      } else {
        url = 'resource/update'
      }
      ApiClient.post(url, params).then(data => {
        if (this.EditAPIType === 'add') {
          tip.open('新增成功', 0)
        } else {
          tip.open('编辑成功', 0)
        }
        this.isAPIEdit = false
        this.APIEditInfo = {
          resourceName: '',
          checkList: [],
          url: '',
          isAll: false
        }
        if (this.isSearch) {
          this.getAPIData(this.systemId, this.searchName, this.searchURL)
        } else {
          this.getAPIData(this.systemId)
        }
      }).catch(e => {
        console.error(e)
        tip.open(e.response.data.exception, 2)
      })
    },
    // 导入
    onImport () {
      if (!this.isAPI) {
        this.$router.push({path: '/ResourceImport', query: {app: this.systemName, appId: this.systemId, module: this.moduleName, id: this.moduleId}})
      } else {
        this.$router.push({path: '/APIImport'})
      }
    },
    // 导出
    onExport () {
      this.isConfirm = true
      this.confirmTitle = '导出提示'
      this.confirmType = 5
      this.confirmText = '您确认要导出' + this.systemName + '系统的' + this.moduleName + '模块的资源吗？'
      if (!this.isAPI) {
        this.confirmFunction = this.exportResource
      } else { 
        this.confirmFunction = this.exportAPIRes
      }
    },
    exportResource () {
      window.open(constants.apiBaseUrl + '/resource/export/' + this.moduleId)
      this.isConfirm = false
    },
    exportAPIRes () {
      if (this.isSearch) {
        window.open(constants.apiBaseUrl + '/resource/apiExport?systemId=' + this.systemId + '&name=' + this.searchName + '&url=' + this.searchURL)
      } else {
        window.open(constants.apiBaseUrl + '/resource/apiExport?systemId=' + this.systemId)
      }
      this.isConfirm = false
    },
    onToggle () {
      this.isShowResTree ? this.hide() : this.show()
    },
    show () {
      this.isShowResTree = true
      document.addEventListener('click', this.hidePanel, false)
    },
    hide () {
      this.isShowResTree = false
      document.removeEventListener('click', this.hidePanel, false)
    },
    hidePanel (e) {
      if (!this.$refs.resourceParent.contains(e.target)) {
        this.hide()
      }
    }
  },
  beforeDestroy () {
    this.hide()
  }
}
</script>
<style lang="css" src="../../css/PermissionsPointManagement.css" scoped></style>
<style>
#PermissionsPointManagement .el-tree-node__label {
  font-size: 12px;
}
#PermissionsPointManagement .el-tree-node__content {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}
#PermissionsPointManagement
  .el-tree
  .el-tree-node__children
  .el-tree-node__content {
  font-weight: normal;
}
</style>

