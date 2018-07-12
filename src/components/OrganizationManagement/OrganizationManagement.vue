<template>
  <div id="OrganizationManagement">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-left-area">
      <div class="pa-left-title">
        <i class="iconfont icon-shuxuanzeqi"></i><span class="pa-title-text">组织结构树</span>
      </div>
      <div class="search-box">
        <input placeholder="输入部门名称" class="key-word" type="text" v-model.trim="keyWord" @keyup.enter="filterTree">
        <i class="search-btn iconfont icon-xiazai5" @click="filterTree"></i>
      </div>
      <el-tree
        ref="tree1"
        :props="defaultProps"
        class="pa-tree-areainfo"
        :default-expanded-keys="defaultKey"
        :data="orgTreeData"
        node-key="id"
        highlight-current
        :filter-node-method="filterNode"
        @node-click="onShowDepData"
        :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="pa-tree-label" :title="node.label">{{ node.label }}</span>
        <span class="pa-tree-icon" v-show="nodeKey === node.key && data.ext.sourceType !== 'DEFAULT'">
          <span
            v-if="verifyPermission('003001')"
            @click.stop="onAddDep(data, node)"
            :class="{active: isEdit === 'add'}"
            title="新增"
            class="iconfont icon-tianjiayuzhuceqiye icon">
          </span>
          <span
            v-if="verifyPermission('003002')" 
            v-show="node.level !== 1"
            @click.stop="onEditDep(data, node)"
            :class="{active: isEdit === 'edit'}"
            title="编辑"
            class="iconfont icon-bianji1 icon">
          </span>
          <span
            v-if="verifyPermission('003003')"
            v-show="node.level !== 1"
            @click.stop="onDeleteDep(data, node)"
            title="删除"
            class="iconfont icon-xiazai14 icon">
          </span>
        </span>
      </span>
    </el-tree>
    </div>
    <div class="pa-right-area">
      <div class="pa-content-title">
        <i class="dian"></i><span>{{rightTitle}}</span>
        <div class="pa-adjustment-btn" v-if="verifyPermission('003004')" v-show="!isEdit && !isShowAdjustment && depMemberNum !== 0" @click="isShowAdjustment = true;rightTitle = '部门人员'">
          <i class="iconfont icon-qiehuanjiaose"></i><span>人员调整</span>
        </div>
        <div class="pa-change-dep" v-show="isShowAdjustment" @click="isShowDep = true">
          <i class="iconfont icon-Adjust"></i><span>调整部门</span>
        </div>
        <div class="pa-cancle-adjustment" v-show="isShowAdjustment" @click="isShowAdjustment = false;rightTitle = '部门信息'">
          <i class="iconfont icon-guanbi"></i><span>取消</span>
        </div>
        <div class="pa-export-import">
          <div class="pa-export" v-if="verifyPermission('003005')" @click="isShowExport = true">
            <i class="iconfont icon-daochu-tianchong"></i><span>导出</span>
          </div>
          <div class="pa-import" v-if="$parent.isRootRole" @click="onGoOrganizationImport">
            <i class="iconfont icon-daoru"></i><span>导入</span>
          </div>
        </div>
        
      </div>
      <div class="pa-main-box" v-show="!isShowAdjustment">
        <el-row>
          <div class="pa-input-line">
            <el-col :span="7"><span class="pa-input-title pa-required">组织名称：</span></el-col>
            <el-col :span="17">
              <div class="pa-input">
                <span>{{organizationName}}</span>
              </div>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line" v-show="!isOrg">
            <el-col :span="7"><span class="pa-input-title pa-required">部门名称：</span></el-col>
            <el-col :span="17">
              <div class="pa-input">
                <span v-show="!isEdit">{{departmentName}}</span>
                <input v-show="isEdit" maxlength="15" ref="depName" v-va.must="{reg: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, errorTip: '！部门名称只能由汉字、字母、数字组成'}" type="text" v-model.trim="departmentName"/>
              </div>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line" v-show="isShowFa && !isOrg">
            <el-col :span="7"><span class="pa-input-title pa-required">上级部门：</span></el-col>
            <el-col :span="17">
              <div class="pa-input">
                <span v-show="!isEdit">{{superiorOrganization}}</span>
                <div class="pa-father-dep" v-show="isEdit">
                  <input disabled type="text" v-model="superiorOrganization"/>
                  <i class="iconfont icon-zuzhiguanli" @click.stop="onToggle"></i>
                  <div v-show="isShowDepTree" ref="main" class="pa-dep-tree">
                    <el-tree
                      ref="tree2"
                      node-key="id"
                      :data="depTreeData"
                      default-expand-all
                      :filter-node-method="filterOther"
                      :auto-expand-parent="false"
                      :expand-on-click-node="false"
                      :props="defaultProps"
                      @node-click="handleNodeClick">
                    </el-tree>
                  </div>
                </div>
              </div>
            </el-col>
          </div>
        </el-row>
         <el-row>
          <div class="pa-input-line" v-show="isEdit !== 'add' && !isOrg">
            <el-col :span="7"><span class="pa-input-title">部门人数：</span></el-col>
            <el-col :span="17">
              <div class="pa-input">
                <span>{{depMemberNum + ' 人'}}</span>
              </div>
            </el-col>
          </div>
        </el-row>
         <el-row>
          <div class="pa-input-line"  v-show="!isOrg">
            <el-col :span="7"><span class="pa-input-title">部门电话：</span></el-col>
            <el-col :span="17">
              <div class="pa-input">
                <span v-show="!isEdit">{{departmentTel}}</span>
                <input v-show="isEdit" ref="depPhone" maxlength="13" v-va:officePhone type="text" v-model="departmentTel"/>
              </div>
            </el-col>
          </div>
        </el-row>
         <el-row>
          <div class="pa-input-line" v-show="!isOrg">
            <el-col :span="7"><span class="pa-input-title">部门邮箱：</span></el-col>
            <el-col :span="17">
              <div class="pa-input">
                <span v-show="!isEdit">{{departmentEmail}}</span>
                <input v-show="isEdit" ref="depMail" maxlength="50" v-va:email type="text" v-model="departmentEmail"/>
              </div>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <div class="pa-input-line pa-text-area" v-show="!isOrg">
            <el-col :span="7"><span class="pa-input-title">备注：</span></el-col>
            <el-col :span="17">
              <div class="pa-input">
                <span v-show="!isEdit" class="pa-textarea-span">{{remark}}</span>
                <textarea v-show="isEdit" name="remark" maxlength="50" v-model="remark"></textarea>
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
                <button type="button" class="btnBlue btn-left" @click="onSaveData">保存</button>
                <button type="button" class="btnGray btn-right" @click="onCancle">取消</button>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
      <div class="pa-adjustment" v-show="isShowAdjustment">
        <div class="pa-adjustment-search">
          <div>账号：<input @keyup.enter="getDepUserData(depInfo.id)" type="text" v-model="searchKeyword.account"></div>
          <div>昵称：<input @keyup.enter="getDepUserData(depInfo.id)" type="text" v-model="searchKeyword.name"></div>
          <div>手机号：<input @keyup.enter="getDepUserData(depInfo.id)" type="text" v-model="searchKeyword.phone"></div>
          <button class="btnBlue" @click="getDepUserData(depInfo.id)">搜索</button>
        </div>
        <div class="pa-user-table">
          <div class="pa-table-head">
            <span class="pa-table-col0"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="onChangeAll"></el-checkbox></span>
            <span class="pa-table-col1">帐号</span>
            <span class="pa-table-col2">昵称</span>
            <span class="pa-table-col3">手机号</span>
            <span class="pa-table-col4">部门</span>
          </div>
          <div class="pa-table-body" :class="{'more-height': pageTotal <= 10}">
            <el-checkbox-group v-model="checkedList" @change="onCheckedChange">
              <div class="pa-table-items" v-for="(item, index) in userData" :key="index">
                <span class="pa-table-col0"><el-checkbox :label="item.id">{{''}}</el-checkbox></span>
                <span class="pa-table-col1">{{item.account}}</span>
                <span class="pa-table-col2">{{item.nick_name}}</span>
                <span class="pa-table-col3">{{item.phone}}</span>
                <span class="pa-table-col4">{{item.departName}}</span>
              </div>
            </el-checkbox-group>
            <div class="pa-nothing" v-show="userData.length === 0">
              <div class="nothing-img"></div>
              <div class="nothing-text">未查找到相关数据</div>
            </div>
          </div>
          <el-pagination
            class="pa-page"
            v-show="pageTotal > 10"
            @current-change="pageNumChange"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :current-page.sync="pageNum"
            :total="pageTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <selection-dep
      :title="{text:'选择部门', tip: organizationName}"
      :data="depTreeData"
      :isShowPostion="false"
      :isShow="isShowDep"
      :currentDepartment="{name:departmentName}"
      @update="onChangeDep"
      @close="isShowDep = false">
    </selection-dep>
    <noticeBox v-show="isNotice" :type="2" @closeBox="isNotice = false" @confirm="deleteDep" :content="'您确认要删除此部门吗？'"></noticeBox>
    <organization-export 
      :show="isShowExport"
      :data="orgList"
      @update="onOrgExport"
      @close="isShowExport = false"
      :title="{head: '选择组织', name: '组织：'}">
    </organization-export>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import ApiClient from '../../publicJs/ApiClient'
import tip from '../../publicJs/TipBoxService'
import searchBox from '../../publicComponent/selectionBoxForDepartment'
import noticeBox from '../../publicComponent/noticeBox'
import OrganizationExport from './OrganizationExport'
import constants from '../../publicJs/Constants'
import loading from '../../publicJs/LoadingBoxService.js'
export default {
  name: 'OrganizationManagement',
  data () {
    return {
      navActiveName: 'OrganizationManagement',
      // 校验标志
      va_error_flag: 0,
      breadcrumb: [
        {name: '组织管理', link: ''}
      ],
      // 组织树
      orgTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 默认展开的节点
      defaultKey: [],
      nodeKey: 0,
      keyWord: '',
      // 右边标题
      rightTitle: '部门信息',
      // 获取的部门信息
      depInfo: {},
      // 展示部门信息
      organizationName: '',
      enterpriseId: '',
      departmentName: '',
      departmentId: '',
      superiorOrganization: '',
      parentId: '',
      departmentTel: '',
      departmentEmail: '',
      remark: '',
      depMemberNum: 0,
      // 是否编辑
      isEdit: '',
      // 显示上级部门树
      isShowDepTree: false,
      // 完整上级部门树
      depTreeData: [],
      // 是否显示上级部门
      isShowFa: true,
      // 是否是组织节点
      isOrg: false,
      // 页面加载时执行一次
      onlyone: true,
      // 显示人员调整
      isShowAdjustment: false,
      // 显示人员部门调整框
      isShowDep: false,
      // element-ui变量
      isIndeterminate: false,
      checkAll: false,
      // 被选中的用户id列表
      checkedList: [],
      // 用户信息
      userData: [],
      // 所有用户id
      userIdOptions: [],
      // 搜索的关键字
      searchKeyword: {name: '', phone: '', account: ''},
      // 分页信息
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      isNotice: false,
      // 权限code
      permissionCode: {codes: [], rule: ''},
      // 组织列表
      orgList: [{name: ''}],
      isShowExport: false
    }
  },
  watch: {
    isEdit (v, o) {
      if (v !== o) {
        this.va_error_flag = 0
        let inputArray = [this.$refs.depName, this.$refs.depPhone, this.$refs.depMail]
        for (let i = 0; i < inputArray.length; i++) {
          inputArray[i].nextSibling.textContent = ''
          inputArray[i].style.borderColor = ''
        }
      }
      let filterIds = [this.departmentId]
      function findChild (data) {
        for (let i = 0; i < data.length; i++) {
          filterIds.push(data[i].id)
          if (data[i].children.length !== 0) {
            findChild(data[i].children)
          }
        }
      }
      if (v === 'edit') {
        let data = this.$refs.tree2.getNode(this.departmentId).data
        findChild(data.children)
        this.$refs.tree2.filter(filterIds)
      } else {
        this.$refs.tree2.filter()
      }
    },
    isShowAdjustment (val) {
      if (!val) {
        this.searchKeyword = {name: '', phone: '', account: ''}
        this.getDepUserData(this.departmentId)
      }
    }
  },
  components: {
    'BreadCrumb': breadCrumb,
    'selection-dep': searchBox,
    'noticeBox': noticeBox,
    'organization-export': OrganizationExport
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.getOrgTreeData()
    },
    // 获取组织树
    getOrgTreeData (id) {
      let enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
      let eId = enterprise.id
      // let roleId = sessionStorage.getItem('roleId')
      let isSA = this.$root.$children[0].$children[0].isRoot
      if (isSA) {
        eId = ''
        ApiClient.get('org/getAllEnterprises').then(data => {
          this.orgList = data
        })
      } else {
        this.orgList = [{id: eId, name: enterprise.name}]
      }
      loading.open('数据加载中...')
      ApiClient.get('org/queryOrgTrees/' + eId).then(data => {
        loading.close()
        this.orgTreeData = data
        if (isSA) {
          for (let i = 0; i < data.length; i++) {
            const el = data[i]
            if (el.id === 'iscloud') {
              this.orgTreeData.splice(i, 1)
              this.orgTreeData.unshift(el)
              break
            }
          }
        }
        if (this.onlyone) {
          this.onlyone = false
          let data = this.orgTreeData[0].children[0]
          let node = {level: 2}
          this.$nextTick(function () {
            this.$refs.tree1.setCurrentKey(data.id)
            this.defaultKey.push(data.id)
          })
          this.onShowDepData(data, node)
        }
        if (id) {
          this.$nextTick(function () {
            this.$refs.tree1.setCurrentKey(id)
            this.defaultKey = [id]
            this.onShowDepData({id: id}, this.$refs.tree1.getNode(id))
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 获取部门用户信息
    getDepUserData (id) {
      this.checkedList = []
      this.userIdOptions = []
      this.isIndeterminate = false
      let param = {
        departmentId: id,
        name: this.searchKeyword.name.trim(),
        account: this.searchKeyword.account.trim(),
        phone: this.searchKeyword.phone.trim(),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      ApiClient.get('user/list', param).then(data => {
        // console.log(data)
        this.pageTotal = data.total
        this.userData = data.data
        for (let i = 0; i < this.userData.length; i++) {
          this.userIdOptions.push(this.userData[i].id)
        }
      })
    },
    // 分页跳页
    pageNumChange (val) {
      this.pageNum = val
      this.getDepUserData(this.depInfo.id)
    },
    // 获取上级部门树
    getDepTreeData (eId, dId) {
      // console.log(dId, 'dId')
      ApiClient.get('org/queryOrgTrees/' + eId).then(data => {
        this.depTreeData = data[0].children
      })
    },
    // 过滤上级部门树中的“其他”部门
    filterOther (value, data) {
      // console.log(data.sourceType !== 'DEFAULT')
      if (data.ext.sourceType === 'DEFAULT') {
        return false
      }
      if (!value) {
        return true
      }
      return value.indexOf(data.id) === -1
    },
    // 过滤树
    filterTree () {
      this.$refs.tree1.filter(this.keyWord)
    },
    // 过滤树的方法
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 点击左侧树节点，展示部门信息,获取部门人员信息
    onShowDepData (data, node) {
      console.log(node)
      this.isShowAdjustment = false
      this.rightTitle = '部门信息'
      this.isEdit = ''
      this.nodeKey = data.id
      this.isShowFa = node.level !== 2
      if (node.level === 1) {
        this.organizationName = data.name
        this.enterpriseId = data.id
        this.isOrg = true
        return
      }
      this.isOrg = false
      loading.open('数据加载中...')
      ApiClient.get('org/getDepartmentById/' + data.id).then(data => {
        // console.log(data)
        loading.close()
        this.depInfo = data
        this.depMemberNum = this.depInfo.memberNum
        this.organizationName = this.depInfo.enterprise.name
        this.enterpriseId = this.depInfo.enterprise.id
        this.departmentName = this.depInfo.name
        this.departmentId = this.depInfo.id
        let depArray = this.depInfo.departmentLevelName.split('/')
        this.superiorOrganization = depArray[depArray.length - 2]
        this.parentId = this.depInfo.parentId
        this.departmentTel = this.depInfo.phone
        this.departmentEmail = this.depInfo.email
        this.remark = this.depInfo.remark
        this.getDepTreeData(this.depInfo.enterprise.id, this.depInfo.id)
        this.getDepUserData(this.depInfo.id, this.searchKeyword)
      })
    },
    // 新增部门
    onAddDep (data, node) {
      this.isOrg = false
      this.isShowDepTree = false
      this.isShowAdjustment = false
      this.isEdit = 'add'
      this.rightTitle = '新增部门'
      this.isShowFa = node.level !== 1
      this.departmentName = ''
      this.departmentId = ''
      this.superiorOrganization = data.name
      this.parentId = data.id
      this.departmentTel = ''
      this.departmentEmail = ''
      this.remark = ''
      this.$nextTick(() => {
        this.$refs.depName.focus()
      })
    },
    // 编辑部门
    onEditDep (data, node) {
      this.isShowDepTree = false
      this.isEdit = 'edit'
      this.isShowAdjustment = false
      this.rightTitle = '编辑部门'
      this.isShowFa = node.level !== 2
      this.departmentName = this.depInfo.name
      this.departmentId = this.depInfo.id
      this.superiorOrganization = node.parent.data.name
      this.parentId = node.parent.data.id
      this.departmentTel = this.depInfo.phone
      this.departmentEmail = this.depInfo.email
      this.remark = this.depInfo.remark
      // this.$refs.tree2.remove(data.id)
    },
    // 删除部门
    onDeleteDep (data, node) {
      this.isShowDepTree = false
      // console.log(node)
      if (!node.isLeaf) {
        tip.open('该节点下存在子部门，不能删除', 2)
        return
      }
      if (this.depMemberNum) {
        tip.open('该部门有成员，不能删除', 2)
        return
      }
      this.isNotice = true
    },
    deleteDep () {
      ApiClient.delete('org/deleteDepartment/' + this.depInfo.id).then(data => {
        tip.open('删除成功')
        this.getOrgTreeData(this.depInfo.parentId)
        this.isNotice = false
      }).catch(e => {
        console.log(e)
        tip.open('删除失败', 2)
      })
    },
    // 选择上级部门
    handleNodeClick (data, node) {
      this.superiorOrganization = data.name
      this.parentId = data.id
      this.isShowDepTree = false
      // this.getOrgTreeData()
    },
    // 新增和编辑的保存方法
    onSaveData () {
      let inputArray = [this.$refs.depName, this.$refs.depPhone, this.$refs.depMail]
      if (this.va_error_flag) {
        for (let i = 0; i < inputArray.length; i++) {
          const el = inputArray[i]
          if (JSON.parse(el.dataset.mustErrorFlag) || JSON.parse(el.dataset.regErrorFlag)) {
            el.focus()
            return
          }
        }
      }
      if (this.departmentName === this.superiorOrganization) {
        tip.open('部门名称不能与上级部门同名', 2)
        return
      }
      let url = ''
      let deplevel = this.depInfo.departmentLevelName
      if (this.isEdit === 'add') {
        url = 'org/saveDepartment'
        deplevel = ''
      } else if (this.isEdit === 'edit') {
        url = 'org/updateDepartment'
      }
      let param = {
        departmentLevelName: deplevel,
        id: this.departmentId,
        name: this.departmentName,
        enterprise: {
          id: this.enterpriseId
        },
        parentId: this.parentId,
        email: this.departmentEmail,
        phone: this.departmentTel,
        remark: this.remark
      }
      ApiClient.post(url, param).then(data => {
        tip.open('保存成功')
        if (this.isEdit === 'add') {
          this.getOrgTreeData(data)
          this.onCancle()
          return
        }
        this.onCancle()
        this.getOrgTreeData(this.departmentId)
        // this.onShowDepData({id: this.departmentId}, this.$refs.tree1.getNode(this.departmentId))
      }).catch(e => {
        console.log(e.response)
        if (e.response.status === 501) {
          tip.open(e.response.data.exception, 2)
        }
      })
    },
    onCancle () {
      this.isEdit = ''
      this.rightTitle = '部门信息'
      this.enterpriseId = this.depInfo.enterprise.id
      this.departmentName = this.depInfo.name
      this.departmentId = this.depInfo.id
      let depArray = this.depInfo.departmentLevelName.split('/')
      this.superiorOrganization = depArray[depArray.length - 2]
      this.parentId = this.depInfo.parentId
      this.departmentTel = this.depInfo.phone
      this.departmentEmail = this.depInfo.email
      this.remark = this.depInfo.remark
    },
    // 转移人员
    onChangeDep (data) {
      if (this.checkedList.length === 0) {
        tip.open('请选择要调整的人员！', 2)
        this.isShowDep = false
        return
      }
      if (!data.id) {
        tip.open('请选择要调整的部门！', 2)
        return
      }
      let url = 'org/transferDepartment?userIds=' + this.checkedList.join(',') +
                '&fromDepartmentId=' + this.depInfo.id +
                '&toDepartmentId=' + data.id
      ApiClient.post(url).then(data => {
        // console.log(data)
        this.isShowDep = false
        tip.open('调整成功')
        this.getDepUserData(this.depInfo.id)
        this.checkAll = false
        this.isIndeterminate = false
      }).then(() => {
        ApiClient.get('org/getOrgUsersNum/' + this.depInfo.id).then(data => {
          this.depMemberNum = data
          if (!data) {
            this.isShowAdjustment = false
          }
        })
      }).catch(e => {
        console.log(e)
        tip.open('调整失败', 2)
      })
    },
    onChangeAll (val) {
      this.checkedList = val ? this.userIdOptions : []
      this.isIndeterminate = false
    },
    onCheckedChange (val) {
      let checkedCount = val.length
      this.checkAll = checkedCount === this.userIdOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.userIdOptions.length
    },
    // 跳转组织导入页面
    onGoOrganizationImport () {
      this.$router.push('/OrganizationImport')
    },
    // 导出组织事件
    onOrgExport (item) {
      window.open(constants.apiBaseUrl + '/org/export/' + item.id)
      this.isShowExport = false
    },
    onToggle () {
      this.isShowDepTree ? this.hide() : this.show()
    },
    show () {
      this.isShowDepTree = true
      document.addEventListener('click', this.hidePanel, false)
    },
    hide () {
      this.isShowDepTree = false
      document.removeEventListener('click', this.hidePanel, false)
    },
    hidePanel (e) {
      if (!this.$refs.main.contains(e.target)) {
        this.hide()
      }
    }
  },
  beforeDestroy () {
    this.hide()
  }
}
</script>
<style lang="css" src="../../css/OrganizationManagement.css" scoped>

</style>
<style>
.pa-tree-areainfo {
  padding: 5px 0;
}
#OrganizationManagement .pa-left-area .el-tree-node__content {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}
#OrganizationManagement
  .pa-left-area
  .el-tree
  .el-tree-node__children
  .el-tree-node__content {
  font-weight: normal;
}
#OrganizationManagement .pa-left-area .el-tree > .el-tree-node {
  border-bottom: 1px dashed #eeeeee;
  padding-bottom: 4px;
}
#OrganizationManagement .pa-left-area .el-tree > .el-tree-node:last-child {
  border-bottom: 0;
  padding-bottom: 4px;
}
#OrganizationManagement .el-tree-node__label {
  font-size: 12px;
}
#OrganizationManagement .el-pagination__editor.el-input .el-input__inner {
  height: 25px;
}
#OrganizationManagement .el-pager li {
  font-weight: normal;
}
#OrganizationManagement .el-input__inner {
  border: none;
  border-radius: 0px;
  width: 65%;
}
</style>

