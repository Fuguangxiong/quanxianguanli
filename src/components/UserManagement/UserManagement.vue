<template>
  <div id="UserManagement">
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="pa-tree-area">
        <el-tree
          class="filter-tree pa-tree-areainfo"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          :filter-node-method="filterNode"
          ref="tree2"
          render-after-expand
          :highlight-current=true
          :expand-on-click-node=false
          :default-expand-all=false
          @node-click="handleNodeClick"
          :default-expanded-keys="expandKeys"
        >
        </el-tree>
    </div>
    <div class="pa-detail-area">
      <div class="pa-detail-searchArea">
        <div class="pa-detail-searchAreaOne">
          <div>账号：<input type="text" v-model='account' @keyup.enter="OnsearchUser"></div>
          <div>昵称：<input type="text" v-model='name' @keyup.enter="OnsearchUser"></div>
          <div>手机号：<input type="text" v-model='phone' @keyup.enter="OnsearchUser"></div>
          <div>用户状态：<select-down :val="stateName" :data="stateList" @change="onChangeState" :width="128"></select-down></div>
        </div>
        <div class="pa-detail-searchAreaTwo">
          <div class="pa-detail-btn">
            <button class="btnGray" @click='OnReset'>重置</button>
            <button class="btnBlue" @click='OnsearchUser'>查找</button>
          </div>
        </div>
      </div>
      <div class="pa-detail-listArea">
        <div class="pa-detail-listOperation">
          <span @click="onGoUserImport" v-if="$parent.isRootRole"><i class="iconfont icon-daoru"></i> 导入</span>
          <span @click="onGoUserImportOut" v-if="verifyPermission('001007')"><i class="iconfont icon-daochu-tianchong"></i> 导出</span>
          <span @click="OnGoUserInformationAdd" v-if="verifyPermission('001001')"><i class="iconfont icon-xinzeng"></i> 新增</span>
        </div>
        <div class="pa-detail-listAreaBottom">
          <div class="pa-detail-listAreaBottomDetail">
            <span>账号</span><span>昵称</span><span>手机号</span><span>组织</span><span>部门</span><span>用户状态</span><span>操作</span>
          </div>
          <div class="pa-detail-listAreaBottomDetailinfoGundong">
          <div class="pa-detail-listAreaBottomDetailinfo" v-for="(item,index) in listData" @mouseleave="controlIndex()" :ref="'op' + index" :key='index' @click="expand(item)">
            <span :title='item.account'>{{item.account}}</span><span :title='item.nick_name'>{{item.nick_name}}</span><span :title='item.phone'>{{item.phone}}</span><span :title='item.enterpriseName'>{{item.enterpriseName}}</span><span :title="item.department_level_name.substr(item.department_level_name.indexOf('/')+1).split('/').join('-')">{{item.department_level_name.substr(item.department_level_name.indexOf('/')+1).split('/').join('-')}}</span><span class="pa-img"><img class="img1" v-if="item.status==='NORMAL'" src="../../publicImg/yishengxiao.png" alt="已生效" ><img class="img2" v-else-if="item.status==='UNACTIVATED'" src="../../publicImg/weijihuo.png" alt="未激活"><img class="img2" v-else-if="item.status==='DISABLE'" src="../../publicImg/yijinyong.png" alt="已禁用">{{item.status==='NORMAL'?'已生效':item.status==='UNACTIVATED'?'未激活':'已禁用'}}</span><span>
            <i class="el-icon-more" @click="operationFunc(index)"></i>
            </span>
            <transition name="el-zoom-in-top">
              <div class="pa-operation-area" v-show="operationShow===index">
                <div @click="OnActivate(item)" v-show="item.status === 'UNACTIVATED'">重新激活</div>
                <div @click="OnGoUserInformationEdit(item)"  v-if="verifyPermission('001009')" v-show="!(item.status === 'UNACTIVATED')&&!(item.status === 'DISABLE')">编辑</div>
                <div @click="OnGoOrganizationLinked(item)" v-if="verifyPermission('001002')" v-show="!(item.status === 'UNACTIVATED')&&!(item.status === 'DISABLE')">关联组织</div>
                <div @click="OnGoUserGroupLinked(item)" v-if="verifyPermission('001003')" v-show="!(item.status === 'UNACTIVATED')&&!(item.status === 'DISABLE')">关联用户组</div>
                <div @click="OnGoRoleLinked(item)" v-if="verifyPermission('001004')" v-show="!(item.status === 'UNACTIVATED')&&!(item.status === 'DISABLE')">关联角色</div>
                <div @click="OnshowForbidden(item)" v-show="!(item.status === 'UNACTIVATED')" v-if="verifyPermission('001005')">{{item.status==='DISABLE'?'启用':'禁用'}}</div>
                <div @click="OnshowQuitBox(item)" v-show="!(item.enterpriseName ==='智享云平台')&&!(item.status === 'UNACTIVATED')&&!(item.status === 'DISABLE')" v-if="verifyPermission('001010')">退出组织</div>
                <div @click="OnshowResetBox(item.id)" v-if="verifyPermission('001006')" v-show="!(item.status === 'UNACTIVATED')&&!(item.status === 'DISABLE')">重置密码</div>
              </div>
            </transition>
          </div>
            <div class="pa-nothing" v-show="!listData.length">
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
    </div>
    <!--重置密码提示框-->
    <noticeBox v-show="passwordShow" :type="1" @closeBox="closeBoxPassword" @confirm="confirmPassword" :content='content'></noticeBox>
    <!--退出组织提示框-->
    <noticeBox v-show="organizationShow" :type="3" @closeBox="closeBoxOrganization" @confirm="confirmOrganization" :content='content_info'></noticeBox>
    <!--禁用用户提示框-->
    <noticeBox v-show="deleteUserShow" :type="2" @closeBox="closeBoxUserShow" @confirm="confirmUserShow" :content='content_infoshow'></noticeBox>
    <!-- 导出提示框 -->
    <noticeBox v-show="importOutShow" :type="5" @closeBox="closeImportOut" @confirm="confirmImportOut" :content='importOut_info'></noticeBox>
      <!--激活确认提示框-->
    <noticeBox v-show="activationShow" :type="1" @closeBox="closeBoxactivation" @confirm="confirmPasswordactivation" :content='content_1'></noticeBox>
  </div>
</template>
<script>
import selectDown from '../../publicComponent/selectDown'
import Constants from '../../publicJs/Constants.js'
import breadCrumb from '../../publicComponent/breadCrumb.vue'
import noticeBox from '../../publicComponent/noticeBox.vue'
import ApiClient from '../../publicJs/ApiClient.js'
import TipBoxService from '../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
import $ from 'jquery'

export default {
  name: 'UserManagement',
  components: {
    'breadcrumb': breadCrumb,
    'noticeBox': noticeBox,
    'select-down': selectDown
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  data () {
    return {
      stateName: '',
      stateList: [{name: '全部状态'}, {name: '已生效'}, {name: '未激活'}, {name: '已禁用'}],
      navActiveName: 'UserManagement',
      importOut_info: '您确定要导出当前展示的用户列表吗？',
      importOutShow: false,
      activationShow: false,
      expandKeys: [],
      // 查询所需字段
      account: '',
      name: '',
      phone: '',
      content_1: '您确定要激活当前用户吗？',
      content: '您确定要重置密码为123456吗？ ',
      content_info: '您确定要退出当前组织吗？',
      content_infoshow: '您确定要禁用当前用户吗？',
      // 查询树结构所用id
      orgIds: '',
      passwordShow: false,
      organizationShow: false,
      deleteUserShow: false,
      breadcrumb: [
        {name: '用户管理', link: 'UserManagement'},
        {name: '用户列表', link: ''}
      ],
      operationShow: -1,
      filterText: '',
      // 用户列表
      listData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 分页器数据
      currentPage3: 1,
      pageSize: 10,
      pageNum: 1,
      total: 1,
      userId: '',
      // 查询树结构id
      orgID: '',
      // 登陆信息里面拿到的组织id
      enterpriseId: '',
      // 点击树节点对应的组织id或部门id
      enterpriseID: '',
      departmentID: '',
      // 删除用户 退出组织所用的id
      user: '',
      enterprise: '',
      idArr: [],
      orgIdChange: false,
      isSA: false,
      // 激活状态
      status: ''
    }
  },
  directives: {
    top: {

    }
  },
  methods: {
    // 获取树结构
    init () {
      var that = this
      LoadingBoxService.open('数据加载中...')
      var enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
      // var isSA = encryption.encryptionGetItem('isSA')
      this.isSA = this.$root.$children[0].$children[0].isRoot
      if (this.isSA === true) {
        this.orgID = ''
      } else {
        this.orgID = enterprise.id
      }
      ApiClient.get('/org/queryOrgTrees/' + this.orgID).then(data => {
        // console.log(data, '树数据')
        that.treeData = data
        for (var i = 0; i < this.treeData.length; i++) {
          var obj = this.treeData[i]
          this.idArr.push(obj.id)
        }
        this.$nextTick(function () {
          for (let i = 0; i < data.length; i++) {
            let obj = data[i]
            if (obj.id === 'iscloud') {
              this.expandKeys = ['iscloud']
              if (that.$refs.tree2 !== undefined) {
                that.$refs.tree2.setCurrentKey('iscloud')
              }
            } else {
              let Arr = []
              Arr.push(data[0].id)
              this.expandKeys = Arr
              if (that.$refs.tree2 !== undefined) {
                that.$refs.tree2.setCurrentKey(data[0].id)
              }
            }
          }
        })
        // 编辑的时候返回用户管理页面的时候 树默认展开到刚才编辑的用户所在的部门并且默认高亮 新增的时候用户新增到那个部门展开那个部门
        if (sessionStorage.getItem('operationType') === 'add' && this.$route.query.expand === 'true') {
          that.$nextTick(function () {
            let Arr = []
            Arr.push(that.listData[0].departmentId)
            // 设置展开
            that.expandKeys = Arr
            // 设置高亮
            if (that.$refs.tree2 !== undefined) {
              that.$refs.tree2.setCurrentKey(that.listData[0].departmentId)
            }
          })
        } else if (sessionStorage.getItem('operationType') === 'edit' && this.$route.query.expand === 'true') {
          that.$nextTick(function () {
            if (that.$refs.tree2 !== undefined) {
              that.$refs.tree2.setCurrentKey(JSON.parse(sessionStorage.getItem('operationItem')).departmentId)
            }
            let Arr = []
            Arr.push(JSON.parse(sessionStorage.getItem('operationItem')).departmentId)
            that.expandKeys = Arr
          })
        }
        sessionStorage.removeItem('operationType')
        LoadingBoxService.close()
      }).catch(e => {
        console.log(e)
        LoadingBoxService.close()
      })
    },
    // 通过id获取组织下的用户列表
    showTreeList () {
      this.orgIdChange = true
      var that = this
      this.name = ''
      this.account = ''
      this.phone = ''
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('/user/list', {
        account: '',
        name: '',
        phone: '',
        userStatus: that.status,
        pageNum: that.pageNum,
        pageSize: that.pageSize,
        enterpriseId: that.enterpriseID,
        departmentId: that.departmentID,
        orderBy: 'create_time',
        orderType: 'desc'
      }).then(data => {
        // console.log(data, '组织下列表数据2')
        that.total = data.total
        that.listData = data.data
        LoadingBoxService.close()
      }).catch(e => {
        console.log(e)
        LoadingBoxService.close()
      })
    },
    // 没有点击树节点的时候显示用户列表
    listDirectShow () {
      // console.log('测试2')
      this.orgIdChange = false
      var enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
      this.enterpriseId = enterprise.id
      var that = this
      ApiClient.get('/user/list', {
        account: that.account.trim(),
        name: that.name.trim(),
        phone: that.phone.trim(),
        pageNum: that.pageNum,
        pageSize: that.pageSize,
        userStatus: that.status,
        enterpriseId: that.enterpriseId,
        departmentId: that.departmentID,
        orderBy: 'create_time',
        orderType: 'desc'
      }).then(data => {
        // console.log(data, '组织下列表数据1')
        that.total = data.total
        that.listData = data.data
        //          console.log(that.listData[0].departmentId,'that.listData[0].departmentId');
      }).catch(e => {
        console.log(e)
      })
    },
    // 查询
    OnsearchUser () {
      var that = this
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('/user/list', {
        account: that.account.trim(),
        name: that.name.trim(),
        phone: that.phone.trim(),
        pageNum: that.pageNum,
        userStatus: that.status,
        pageSize: that.pageSize,
        enterpriseId: that.enterpriseID,
        departmentId: that.departmentID,
        orderBy: 'create_time',
        orderType: 'desc'
      }).then(data => {
        //            console.log(data, '组织下列表数据')
        that.total = data.total
        that.listData = data.data
        LoadingBoxService.close()
      }).catch(e => {
        console.log(e)
        LoadingBoxService.close()
      })
    },
    // 重置
    OnReset () {
      this.name = ''
      this.account = ''
      this.phone = ''
      this.stateName = '全部状态'
      this.status = ''
      this.pageNum = 1
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    operationFunc (index) {
      this.operationShow = index
      console.log($('.pa-operation-area').children('div'))
      this.$nextTick(function () {
        if ($('.pa-operation-area').height() === 0) {
          $('.pa-operation-area').css('border', 0)
          TipBoxService.open('您无权限进行相关操作！', 2)
        }
      })
      console.log(this.$refs['op' + index], index)
    },
    controlIndex () {
      this.operationShow = -1
    },
    handleSizeChange (val) {
      //        console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      var enterprise = JSON.parse(sessionStorage.getItem('enterprise'))
      this.enterpriseId = enterprise.id
      // 如果没有点击树节点获取enterpriseID的时候默认使用登陆传过来的enterpriseId
      if (this.enterpriseID === '') {
        this.enterpriseID = this.enterpriseId
      } else {}
      //        var Id = sessionStorage.getItem('Id')
      this.showTreeList()
      //        console.log(`当前页: ${val}`)
    },
    OnGoUserInformationAdd () {
      sessionStorage.setItem('operationType', 'add')
      this.$router.push({path: '/UserInformation', query: {way: 'add'}})
    },
    OnGoUserInformationEdit (item) {
      sessionStorage.setItem('operationType', 'edit')
      sessionStorage.setItem('operationItem', JSON.stringify(item))
      this.$router.push({path: '/UserInformation', query: {way: 'edit', userId: item.id}})
    },
    OnGoOrganizationLinked (item) {
      this.$router.push({path: '/OrganizationLinked', query: {account: item.account, userId: item.id}})
    },
    OnGoUserGroupLinked (item) {
      sessionStorage.setItem('entpriseName', item.enterpriseName)
      this.$router.push({path: '/UserGroupLinked', query: {entId: item.enterpriseId, userId: item.id, account: item.account}})
    },
    OnGoRoleLinked (item) {
      sessionStorage.setItem('entpriseName', item.enterpriseName)
      sessionStorage.setItem('accountName', item.account)
      this.$router.push({path: '/RoleLinked', query: {entId: item.enterpriseId, userId: item.id}})
    },
    closeBoxPassword (val) {
      //        console.log(val);
      this.passwordShow = false
    },
    closeBoxOrganization () {
      this.organizationShow = false
    },
    OnshowResetBox (val) {
      this.passwordShow = true
      this.userId = val
    },
    onGoUserImport () {
      this.$router.push({path: '/UserImport'})
    },
    // 删除用户
    OnshowForbidden (item) {
      if (item.status === 'DISABLE') {
        this.content_infoshow = '您确定要启用当前用户吗？'
      } else {
        this.content_infoshow = '您确定要禁用当前用户吗？'
      }
      this.deleteUserShow = true
      this.user = item.id
      this.enterprise = item.enterpriseId
      this.enterpriseID = item.enterpriseId
    },
    closeBoxUserShow () {
      this.deleteUserShow = false
    },
    confirmUserShow () {
      this.deleteUserShow = false
      var that = this
      // 把删除用户按钮改成禁用启用保存前端逻辑
      // ApiClient.post('/user/delete' + '?userId=' + that.user + '&enterpriseId=' + that.enterprise
      // ).then(data => {
      //   if (data === true) {
      //     TipBoxService.open('删除用户成功！', 0)
      //     that.showTreeList()
      //   }
      // }).catch(e => {
      //   //          console.log(e.response)
      //   TipBoxService.open(e.response.data.exception, 2)
      // })
      if (this.content_infoshow === '您确定要启用当前用户吗？') {
        ApiClient.post('/user/switchState' + '?userId=' + that.user + '&state=' + 'true'
        ).then(data => {
          if (data === true) {
            TipBoxService.open('启用用户成功！', 0)
            that.showTreeList()
          }
        }).catch(e => {
        //          console.log(e.response)
          TipBoxService.open(e.response.data.exception, 2)
        })
      } else {
        ApiClient.post('/user/switchState' + '?userId=' + that.user + '&state=' + 'false'
        ).then(data => {
          if (data === true) {
            TipBoxService.open('禁用用户成功！', 0)
            that.showTreeList()
          }
        }).catch(e => {
        //          console.log(e.response)
          TipBoxService.open(e.response.data.exception, 2)
        })
      }
    },
    // 退出组织
    OnshowQuitBox (item) {
      this.organizationShow = true
      this.user = item.id
      this.enterprise = item.enterpriseId
      this.enterpriseID = item.enterpriseId
    },
    confirmPassword (val) {
      this.passwordShow = false
      var that = this
      ApiClient.post('/user/resetPassword' + '?userId=' + that.userId
      ).then(data => {
        //          console.log(data, '重置密码')
        if (data === true) {
          TipBoxService.open('密码已重置为123456！', 0)
        } else {
          TipBoxService.open('重置密码失败！', 1)
        }
      }).catch(e => console.log(e))
    },
    confirmOrganization (val) {
      this.organizationShow = false
      var that = this
      ApiClient.post('/user/quit' + '?userId=' + that.user + '&enterpriseId=' + that.enterprise
      ).then(data => {
        if (data === true) {
          TipBoxService.open('退出组织成功！', 0)
          this.showTreeList()
        } else {
          TipBoxService.open('退出组织失败！', 1)
        }
      }).catch(e => console.log(e))
    },
    handleNodeClick (obj, node, component) {
      // obj是节点对应的对象
      //              console.log(obj.type, '节点对应的类型')
      //              console.log(obj.id, '节点对应的id')
      this.pageNum = 1
      if (obj.type === 'ENTERPRISE') {
        this.enterpriseID = obj.id
        this.departmentID = ''
      }
      if (obj.type === 'DEPARTMENT') {
        this.enterpriseID = ''
        this.departmentID = obj.id
      }
      this.showTreeList()
    },
    expand (item) {
      let Arr = []
      Arr.push(item.departmentId)
      // 设置展开
      this.expandKeys = Arr
      this.$nextTick(function () {
        if (this.$refs.tree2 !== undefined) {
          this.$refs.tree2.setCurrentKey(item.departmentId)
        }
      })
    },
    onGoUserImportOut () {
      this.importOutShow = true
    },
    closeImportOut () {
      this.importOutShow = false
    },
    confirmImportOut () {
      this.importOutShow = false
      if (this.orgIdChange === false) {
        // 第一次进来直接导出;没有改变企业id
        console.log('1')
        window.location.href = Constants.apiBaseUrl + '/user/export' +
       '?name=' + this.name + '&account=' +
        this.account + '&userStatus=' +
         this.status + '&phone=' +
         this.phone + '&enterpriseId=' +
         this.enterpriseId + '&departmentId=' +
          this.departmentID
      } else {
        // 改变企业id之后
        console.log('2')
        window.location.href = Constants.apiBaseUrl + '/user/export' +
       '?name=' + this.name + '&account=' +
        this.account + '&userStatus=' +
         this.status + '&phone=' +
         this.phone + '&enterpriseId=' +
         this.enterpriseID + '&departmentId=' +
          this.departmentID
      }
    },
    onChangeState (item) {
      this.stateName = item.name
      switch (this.stateName) {
      case '全部状态':this.status = ''
        break
      case '已生效':this.status = 'NORMAL'
        break
      case '未激活':this.status = 'UNACTIVATED'
        break
      case '已禁用':this.status = 'DISABLE'
        break
      }
    },
    OnActivate (item) {
      this.activationShow = true
      this.userId = item.id
    },
    closeBoxactivation () {
      this.activationShow = false
    },
    confirmPasswordactivation () {
      this.activationShow = false
      ApiClient.post('/user/activeUser' + '?userId=' + this.userId
      ).then(data => {
        if (data === true) {
          TipBoxService.open('激活申请已发送，请等待激活！', 0)
          this.showTreeList()
        } else {
          TipBoxService.open('发送激活申请失败！', 2)
        }
      }).catch(e =>
        TipBoxService.open((e.response.data.exception), 2))
    }
  },
  beforeDestroy () {

  },
  mounted () {
    this.stateName = '全部状态'
    this.init()
    this.listDirectShow()
    console.log($('#UserManagement').height())
  }
}
</script>
<style src="../../css/UserManagement.css" scoped></style>
<style lang="css">
/* 修改树的默认样式 */
#UserManagement .el-tree {
  color: #2a2a2a;
}
#UserManagement .el-tree-node__label {
  font-size: 12px;
  width: 100%;
}
#UserManagement .is-leaf {
  visibility: hidden;
}
#UserManagement .el-tree-node__content {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}
#UserManagement .el-input__inner {
  border:none;
  border-radius: 0px;
  width: 65%;
}
#UserManagement .el-pagination__editor.el-input .el-input__inner {
  height: 25px;
}
#UserManagement .el-tree .el-tree-node__children .el-tree-node__content {
  display: block;
  font-weight: 500;
}
#UserManagement .el-pager li{
  font-weight: normal;
}
#UserManagement .el-tree >.el-tree-node{
  border-bottom: 1px dashed #EEEEEE;
  padding-bottom: 4px;
}
#UserManagement .el-tree >.el-tree-node:last-child{
  border-bottom: 0 dashed red;
  padding-bottom: 4px;
}
</style>
