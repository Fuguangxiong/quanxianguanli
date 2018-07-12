import Vue from 'vue'
import Router from 'vue-router'
import {verifyPermission, permissionCode, getPermissionCode} from '../publicJs/verifyPermission'
// import LoginSelector from '@/components/LoginSelector'
import enterpriseSelect from '@/components/enterpriseSelect'
import notPermission from '@/components/notPermission'

import AuthorityManagement from '@/components/AuthorityManagement'
// 组织管理
import OrganizationManagement from '../components/OrganizationManagement/OrganizationManagement.vue'
// 组织导入
import OrganizationImport from '../components/OrganizationManagement/OrganizationImport.vue'
// 资源管理
import PermissionsPointManagement from '../components/PermissionsPointManagement/PermissionsPointManagement.vue'
import ResourceImport from '../components/PermissionsPointManagement/ResourceImport.vue'
import APIImport from '../components/PermissionsPointManagement/APIImport.vue'

import RoleManagement from '../components/RoleManagement/RoleManagement.vue'
import UserGroupManagement from '../components/UserGroupManagement/UserGroupManagement.vue'
import RoleLinkToUserGroup from '../components/UserGroupManagement/RoleLinkToUserGroup.vue'
import EditUserGroupMember from '../components/UserGroupManagement/EditUserGroupMember.vue'
// 用户管理
import UserManagement from '../components/UserManagement/UserManagement.vue'
// 关联组织
import OrganizationLinked from '../components/UserManagement/OrganizationLinked.vue'

import UserInformation from '../components/UserManagement/UserInformation.vue'
import UserGroupLinked from '../components/UserManagement/UserGroupLinked.vue'
import RoleLinked from '../components/UserManagement/RoleLinked.vue'
import RoleManageRoleLinked from '../components/RoleManagement/RoleManageRoleLinked.vue'
import RoleManageUserGroupLinked from '../components/RoleManagement/RoleManageUserGroupLinked.vue'
import RoleAuthorize from '../components/RoleManagement/RoleAuthorize.vue'
import UserImport from '../components/UserManagement/UserImport.vue'
import ImportManagement from '../components/SystemManagement/ImportManagement.vue'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'enterpriseSelect',
      component: enterpriseSelect
    },
    {
      path: '/AuthorityManagement',
      name: 'AuthorityManagement',
      component: AuthorityManagement,
      children: [
        {
          path: '/notPermission',
          name: 'notPermission',
          component: notPermission
        },
        {
          path: '/OrganizationManagement',
          name: 'OrganizationManagement',
          component: OrganizationManagement,
          meta: {
            activeName: 'OrganizationManagement',
            permissionCode: '003'
          }
        },
        {
          path: '/OrganizationImport',
          name: 'OrganizationImport',
          component: OrganizationImport,
          meta: {
            activeName: 'OrganizationManagement',
            permissionCode: '003'
          }
        },
        {
          path: '/PermissionsPointManagement',
          name: 'PermissionsPointManagement',
          component: PermissionsPointManagement,
          meta: {
            activeName: 'PermissionsPointManagement',
            permissionCode: '004'
          }
        },
        {
          path: '/ResourceImport',
          name: 'ResourceImport',
          component: ResourceImport,
          meta: {
            activeName: 'PermissionsPointManagement',
            permissionCode: '004'
          }
        },
        {
          path: '/APIImport',
          name: 'APIImport',
          component: APIImport,
          meta: {
            activeName: 'PermissionsPointManagement',
            permissionCode: '004'
          }
        },
        {
          path: '/RoleManagement',
          name: 'RoleManagement',
          component: RoleManagement,
          meta: {
            activeName: 'RoleManagement',
            permissionCode: '005'
          }
        },
        {
          path: '/UserGroupManagement',
          name: 'UserGroupManagement',
          component: UserGroupManagement,
          meta: {
            activeName: 'UserGroupManagement',
            permissionCode: '002'
          }
        },
        {
          path: '/RoleManageRoleLinked',
          name: 'RoleManageRoleLinked',
          component: RoleManageRoleLinked,
          meta: {
            activeName: 'RoleManagement',
            permissionCode: '005'
          }
        },
        {
          path: '/RoleManageUserGroupLinked',
          name: 'RoleManageUserGroupLinked',
          component: RoleManageUserGroupLinked,
          meta: {
            activeName: 'RoleManagement',
            permissionCode: '005'
          }
        },
        {
          path: '/UserManagement',
          name: 'UserManagement',
          component: UserManagement,
          meta: {
            activeName: 'UserManagement',
            permissionCode: '001'
          }
        },
        {
          path: '/OrganizationLinked',
          name: 'OrganizationLinked',
          component: OrganizationLinked,
          meta: {
            activeName: 'UserManagement',
            permissionCode: '001'
          }
        },
        {
          path: '/UserInformation',
          name: 'UserInformation',
          component: UserInformation,
          meta: {
            activeName: 'UserManagement',
            permissionCode: '001'
          }
        },
        {
          path: '/UserGroupLinked',
          name: 'UserGroupLinked',
          component: UserGroupLinked,
          meta: {
            activeName: 'UserManagement',
            permissionCode: '001'
          }
        },
        {
          path: '/RoleLinked',
          name: 'RoleLinked',
          component: RoleLinked,
          meta: {
            activeName: 'UserManagement',
            permissionCode: '001'
          }
        },
        {
          path: '/RoleLinkToUserGroup',
          name: 'RoleLinkToUserGroup',
          component: RoleLinkToUserGroup,
          meta: {
            activeName: 'UserGroupManagement',
            permissionCode: '002'
          }
        },
        {
          path: '/EditUserGroupMember',
          name: 'EditUserGroupMember',
          component: EditUserGroupMember,
          meta: {
            activeName: 'UserGroupManagement',
            permissionCode: '002'
          }
        },
        {
          path: '/RoleAuthorize',
          name: 'RoleAuthorize',
          component: RoleAuthorize,
          meta: {
            activeName: 'RoleManagement',
            permissionCode: '005'
          }
        },
        {
          path: '/UserImport',
          name: 'UserImport',
          component: UserImport,
          meta: {
            activeName: 'UserManagement',
            permissionCode: '001'
          }
        },
        {
          path: '/ImportManagement',
          name: 'ImportManagement',
          component: ImportManagement,
          meta: {
            activeName: 'ImportManagement',
            permissionCode: '006001'
          }
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path !== '/' && permissionCode.flag) {
    getPermissionCode()
  }
  if (to.meta.permissionCode && !verifyPermission(to.meta.permissionCode)) {
    next({path: '/notPermission', replace: true})
  } else {
    next()
  }
})
export default router
