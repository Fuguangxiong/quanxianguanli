<template>
  <div id="UserImport">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-web1" v-show="isImport">
      <div class="pa-top-box">
        <div class="pa-top-left">
          <div class="pa-left-line">
            <span class="pa-line-title">1</span>
            <span class="pa-line-text">下载用户导入模板，批量填写用户信息</span>
            <button class="btnBlue" @click="onDownload">下载</button>
          </div>
          <div class="pa-left-line">
            <span class="pa-line-title">2</span>
            <span class="pa-line-text">上传填写好的用户模板文件不超过5M</span>
            <a href="javascript:;" class="a-upload">
              <input type="file" @change="getFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">{{inputName}}
            </a>
            <span>{{fileName}}</span>
          </div>
        </div>
        <div class="pa-top-right">
          <div class="pa-right-title">模板说明：</div>
          <div class="pa-right-text">
            <span title="1.请上传具备标准行列的excel文件，支持xsl,xslx格式（有合并单元格的数据请处理过后再上传）">1.请上传具备标准行列的excel文件，支持xls,xlsx格式（有合并单元格的数据请处理过后再上传）</span>
            <span>2.组织，用户名，手机号和部门为必填字段</span>
            <span>3.组织：组织必须先创建好，否则导入会报错</span>
            <span title="4.部门：上下级部门间从最上级部门开始用“/”隔开，例如“研发部/研发一部”,如该部门不存在，导入会报错">4.部门：上下级部门间从最上级部门开始用“/”隔开，例如“研发部/研发一部”,如该部门不存在，导入会报错</span>
            <span>5.用户名：用户名必须唯一，否则导入会报错</span>
            <span>6.手机号：手机号必须唯一，否则导入会报错</span>
            <span>7.邮箱：邮箱必须唯一，否则导入会报错</span>
            <span>8.角色：多角色用“/”隔开</span>
          </div>
        </div>
      </div>
      <div class="pa-bottom-box">
        <div class="pa-table-short">
          <span class="pa-short-th">组织</span>
          <span class="pa-short-td">北京神州泰岳软件股份有限公司</span>
        </div>
        <div class="pa-table-long">
          <div class="pa-long-th">
            <span class="pa-table-col1">用户账号</span>
            <span class="pa-table-col2">昵称</span>
            <span class="pa-table-col3">手机号</span>
            <span class="pa-table-col4">邮箱</span>
            <span class="pa-table-col5">部门</span>
            <span class="pa-table-col6">职位</span>
            <span class="pa-table-col7">角色</span>
          </div>
          <div class="pa-long-td">
            <span class="pa-table-col1">zhangfei</span>
            <span class="pa-table-col2">张飞</span>
            <span class="pa-table-col3">13988918765</span>
            <span class="pa-table-col4">zhangfei@163.com</span>
            <span class="pa-table-col5">研发部/开发一组</span>
            <span class="pa-table-col6">经理</span>
            <span class="pa-table-col7">管理员/运维人员</span>
          </div>
        </div>
      </div>
      <div class="pa-button-box">
        <button class="btnBlue" @click="onImport">导入</button>
      </div>
    </div>
    <div class="pa-web2" v-show="!isImport">
      <div class="pa-tips">
        <img src="../../publicImg/submitsuccess.png">文件导入开始，{{count}}s后跳转到<span @click="onImportManagement">导入管理</span>页面查看进度。
      </div>
    </div>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import constants from '../../publicJs/Constants'
import apiClient from '../../publicJs/ApiClient'
import tipBoxService from '../../publicJs/TipBoxService'
import loadingBoxService from '../../publicJs/LoadingBoxService'
var countBack = ''
var uploadFile = ''
export default {
  name: 'UserImport',
  data () {
    return {
      navActiveName: 'UserManagement',
      breadcrumb: [
        {name: '用户管理', link: 'UserManagement'},
        {name: '用户导入', link: ''}
      ],
      inputName: '选择文件',
      fileName: '未选择文件',
      isImport: true,
      count: 3
    }
  },
  components: {
    'BreadCrumb': breadCrumb
  },
  methods: {
    getFile (e) {
      if (e.target.files.length !== 0) {
        uploadFile = e.target.files[0]
        this.fileName = uploadFile.name
        if (this.fileName !== '未选择文件') {
          this.inputName = '更改文件'
        }
      } else {
        uploadFile = ''
        this.fileName = '未选择文件'
        this.inputName = '选择文件'
      }
    },
    onImportManagement () {
      clearInterval(countBack)
      this.$parent.$emit('changeNavActive', 'ImportManagement')
      this.$router.push({path: '/ImportManagement'})
    },
    onImport () {
      if (this.fileName === '未选择文件') {
        tipBoxService.open('您未选择上传文件', 2)
        return
      } else if (uploadFile.size > 5242880) {
        tipBoxService.open('文件大小不能超过5M', 2)
        return
      }
      loadingBoxService.open('请稍候...')
      apiClient.upload('/user/upload', uploadFile, '').then(data => {
        loadingBoxService.close()
        if (data === true) {
          this.onImportSuccess()
        }
      }).catch(e => {
        loadingBoxService.close()
        tipBoxService.open(e.response.data.exception, 2)
      })
    },
    onImportSuccess () {
      let that = this
      that.isImport = false
      countBack = setInterval(function () {
        if (that.count > 0) {
          that.count--
        } else {
          that.onImportManagement()
        }
      }, 1000)
    },
    onDownload () {
      window.open(constants.apiBaseUrl + '/template/downloadImportTemplate?type=USER')
    }
  }
}
</script>
<style src="../../css/UserImport.css" scoped>

</style>

