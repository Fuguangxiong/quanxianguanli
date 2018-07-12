<template>
  <div class="publicContainer" v-if="loaded">
    <left-nav :nav-data="leftNavData" v-on:linkchange="linkChangeHandler" :change="leftDataChange"></left-nav>
    <div class="publicRightContainer">
      <div class="publicWidthHeightContainer">
        <div class="publicRightTopContainer">
          <public-header :hide-menu='hideMenu' :nav-data="topNavData" :userchange="publicTopUserChange" :modular-name="modularName" :has-msg="hasMsg" v-on:linkchange="linkChangeHandler"></public-header>
        </div>
        <div class="publicRightBottomContainer">
          <div class="publicRightBottomContentContainer">
            <!--添加Dom的地方-->
            <router-view>

            </router-view>
          </div>
        </div>
        <public-bottom></public-bottom>
      </div>
    </div>
  </div>
</template>
<script>
import leftNav from '../publicComponent/publicLeftNavComponent.vue'
import header from '../publicComponent/publicTopNavComponent.vue'
import bottomComponent from '../publicComponent/publicBottomComponent.vue'
import '../css/public.css'
import apiclient from '../publicJs/ApiClient'
import constants from '../publicJs/Constants'
import $ from 'jquery'
import {getPermissionCode, permissionCode} from '../publicJs/verifyPermission'
export default {
  name: 'authorityManagement',
  data () {
    return {
      defaultLeftNavData: [
        {name: '用户管理',
          link: 'UserManagement',
          imageClass: 'iconfont icon-yonghuguanli',
          active: false,
          code: '001'
        },
        {name: '用户组管理',
          link: 'UserGroupManagement',
          imageClass: 'iconfont icon-renqun',
          active: false,
          code: '002'
        },
        {name: '组织管理',
          link: 'OrganizationManagement',
          imageClass: 'iconfont icon-zuzhiguanli',
          active: false,
          code: '003'
        },
        {name: '资源管理',
          link: 'PermissionsPointManagement',
          imageClass: 'iconfont icon-erji-quanxianguanli',
          active: false,
          code: '004'
        },
        {name: '角色管理',
          link: 'RoleManagement',
          imageClass: 'iconfont icon-jiaoseguanli',
          active: false,
          code: '005'
        },
        {name: '系统配置',
          link: '',
          imageClass: 'iconfont icon-xitongpeizhi',
          active: false,
          children: [
            {name: '导入管理', link: 'ImportManagement', active: false, code: '006001'}
          ],
          code: '006'
        }
      ],
      leftNavData: [],
      publicTopUserChange: 0,
      modularName: {name: '权限管理', link: ''},
      hasMsg: true,
      leftDataChange: 0,
      topNavData: [],
      prividata: null,
      hideMenu: true,
      isRoot: false,
      isRootRole: false,
      loaded: false
    }
  },
  components: {
    'left-nav': leftNav,
    'public-header': header,
    'public-bottom': bottomComponent
  },
  beforeRouteUpdate (to, from, next) {
    this.changeNavActive(to.meta.activeName)
    next()
  },
  created () {
    this.init()
  },
  mounted () {
    if (this.$route.path === '/AuthorityManagement' && this.leftNavData.length > 0) {
      this.$router.replace({name: this.leftNavData[0].link})
    }
    this.changeNavActive(this.$route.meta.activeName)
    this.$on('changeNavActive', name => {
      this.changeNavActive(name)
    })
  },
  computed: {
    permissionCode () {
      return permissionCode
    }
  },
  methods: {
    init () {
      this.getLeftData()
      this.isRootRoleFunc()
    },
    getLeftData () {
      this.leftNavData = this.defaultLeftNavData
      for (let k = 0; k < this.permissionCode.rule.length; k++) {
        const el = this.permissionCode.rule[k]
        if (el === '*') {
          return
        }
      }
      for (let i = 0; i < this.leftNavData.length; i++) {
        const el = this.leftNavData[i]
        if (this.permissionCode.codes.indexOf(el.code) === -1) {
          this.leftNavData.splice(i, 1)
          i--
        } else {
          if (el.children && el.children.length > 0) {
            for (let j = 0; j < el.children.length; j++) {
              const cel = el.children[j]
              if (this.permissionCode.codes.indexOf(cel.code) === -1) {
                el.children.splice(j, 1)
                j--
              }
            }
          }
        }
      }
      this.leftDataChange++
    },
    changeNavActive (name) {
      for (let i = 0; i < this.leftNavData.length; i++) {
        let pel = this.leftNavData[i]
        pel.active = false
        if (pel.link === name) {
          pel.active = true
          if (pel.children) {
            for (let j = 0; j < pel.children.length; j++) {
              pel.children[j].active = false
            }
          }
        } else {
          if (pel.children) {
            for (let j = 0; j < pel.children.length; j++) {
              let cel = pel.children[j]
              cel.active = false
              if (cel.link === name) {
                pel.active = true
                cel.active = true
              }
            }
          }
        }
      }
      this.leftDataChange++
    },
    isRootRoleFunc () {
      // apiclient.get('isHaveRootRole').then(data => {
      //   this.isRoot = data
      // })
      apiclient.get('getLoginInfo').then(data => {
        console.log(data)
        sessionStorage.setItem('account', data.account)
        sessionStorage.setItem('enterprise', JSON.stringify(data.currentEnterprise))
        sessionStorage.setItem('userId', data.userId)
        sessionStorage.setItem('token', data.token)
        this.loaded = true
        let that = this
        let eId = JSON.parse(sessionStorage.getItem('enterprise')).id
        $.ajax({
          url: constants.apiBaseUrl + '/isHaveRootRole',
          type: 'GET', // GET
          async: false, // 或false,是否异步
          data: {
            token: sessionStorage.getItem('token')
          },
          xhrFields: {
            withCredentials: true
          },
          timeout: 5000, // 超时时间
          dataType: 'json', // 返回的数据格式：
          beforeSend: function (xhr) {},
          success: function (data, textStatus, jqXHR) {
            that.isRoot = data.results && eId === 'iscloud'
            that.isRootRole = data.results
          },
          error: function (xhr, textStatus) {
            console.error('获取角色错误', xhr)
            if (xhr.status === 403 || xhr.status === 401) {

            }
          },
          complete: function () {}
        })
      })
    },
    linkChangeHandler (item) {
      // console.log(item, 'item')
      this.$router.push({name: item.link})
    }
  }
}
</script>
<style lang="css" scoped>
.publicContainer {
  min-width: 1024px;
  min-height: 600px;
}
</style>
