<template>
  <div id="APIImport">
    <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class="pa-web1" v-show="isImport">
      <div class="pa-top-box">
        <div class="pa-top-left">
          <div class="pa-left-line">
            <span class="pa-line-title">1</span>
            <span class="pa-line-text">下载API导入模板，批量填写API信息</span>
            <button class="btnBlue" @click="onDownload">下载</button>
          </div>
          <div class="pa-left-line">
            <span class="pa-line-title">2</span>
            <span class="pa-line-text">上传填写好的API模板文件不超过5M</span>
            <a href="javascript:;" class="a-upload">
              <input type="file" @change="getFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">{{inputName}}
            </a>
            <span>{{fileName}}</span>
          </div>
        </div>
        <div class="pa-top-right">
          <div class="pa-right-title">模板说明：</div>
          <div class="pa-right-text">
            <span>1.请上传具备标准行列的excel文件，支持xls,xlsx格式（有合并单元格的数据请处理过后再上传）</span>
            <span>2.红色字段为必填字段，黑色字段为选填字段</span>
            <span>3.操作：操作只能是：GET，POST，PUT，DELETE，多个操作用英文的“/”隔开，输入“*”代表所有的操作</span>
            <span>4.资源名称必须唯一，否则导入会报错</span>
            <span>5.URL和操作组合必须唯一，否则导入会报错</span>
            <span>6.URL格式要正确，否则导入会报错</span>
          </div>
        </div>
      </div>
      <div class="pa-bottom-box">
        <div class="pa-table-long">
          <div class="pa-long-th">
            <span class="pa-table-col1">资源名称</span>
            <span class="pa-table-col2">URL</span>
            <span class="pa-table-col3">操作</span>
          </div>
          <div class="pa-long-td">
            <span class="pa-table-col1">获取用户信息</span>
            <span class="pa-table-col2">/user/getUserInfo</span>
            <span class="pa-table-col3">POST/GET</span>
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
        {name: '资源管理', link: 'PermissionsPointManagement'},
        {name: 'API导入', link: ''}
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
<style src="../../css/APIImport.css" scoped>

</style>