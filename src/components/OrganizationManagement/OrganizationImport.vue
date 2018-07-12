<template>
  <div id="OrganizationImport">
    <bread-crumb :data="breadcrumb"></bread-crumb>
      <div class="pa-import-box clearfix" v-show="!isImport">
        <div class="pa-left-box">
          <div class="pa-download-upload">
            <div class="pa-row">
              <span class="pa-sort">1</span>
              <span>下载组织导入模板，填写组织信息</span>
              <button class="btnBlue" @click="onDownload">下载</button>
            </div>
            <div class="pa-row">
              <span class="pa-sort">2</span>
              <span>上传填写好的组织模版文件不超过5M</span>
              <a href=";" class="pa-upload">选择文件<input accept="text/xml" @change="setFile" type="file" title=" "></a>
              <span class="pa-fileName" :title="fileName">{{fileName}}</span>
            </div>
          </div>
          <div class="pa-caption">
            <p>模版说明：</p>
            <p>1. 请上传标准格式的XML文件，格式请参考右边示例</p>
            <p>2. 组织要先创建好，否则导入报错</p>
            <p>3. 同级部门的子部门不能重名，并且子部门不能和父部门同名，否则导入报错</p>
            <p>4. 电话，邮箱格式要合法，否则导入报错</p>
          </div>
        </div>
        <div class="pa-right-box">
  <pre class="pa-template">
  &lt;?xml version=<span class="string">"1.0"</span> encoding=<span class="string">"UTF-8"</span>?&gt;
  &lt;organization&gt;
    &lt;name&gt;<span class="content">北京神州泰岳软件股份有限公司</span>&lt;/name&gt;
    &lt;sub-org&gt;
      &lt;organization&gt;
        &lt;name&gt;<span class="content">战略产品创新中心</span>&lt;/name&gt;
        &lt;phone&gt;<span class="content">010-89867623</span>&lt;/phone&gt;
        &lt;mail&gt;<span class="content">sdfdf@163.com</span>&lt;/mail&gt;
        &lt;sub-org&gt;
          &lt;organization&gt;
            &lt;name&gt;<span class="content">武汉研发中心</span>&lt;/name&gt;
            &lt;phone&gt;<span class="content">010-89867923</span>&lt;/phone&gt;
            &lt;mail&gt;<span class="content">df@163.com</span>&lt;/mail&gt;
          &lt;/organization&gt;
        &lt;/sub-org&gt;
      &lt;/organization&gt;
    &lt;/sub-org&gt;
  &lt;/organization&gt;
  </pre>
        </div>
        <div class="pa-btn"><button class="btnBlue" @click="onImport">导入</button></div>
      </div>
      <div class="pa-success-tip" v-show="isImport">
        <div class="pa-tips">
          <img src="../../publicImg/submitsuccess.png">文件导入开始，{{count}}s后跳转到<span @click="onImportManagement">导入管理</span>页面查看进度。
        </div>
      </div>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import tip from '../../publicJs/TipBoxService'
import constants from '../../publicJs/Constants.js'
import ApiClient from '../../publicJs/ApiClient'
import loading from '../../publicJs/LoadingBoxService.js'
let countBack = ''
export default {
  name: 'OrganizationImport',
  components: {
    'bread-crumb': breadCrumb
  },
  data () {
    return {
      navActiveName: 'OrganizationManagement',
      breadcrumb: [{name: '组织管理', link: 'OrganizationManagement'}, {name: '组织导入', link: ''}],
      fileName: '未选择文件',
      file: '',
      isImport: false,
      count: 3
    }
  },
  methods: {
    setFile (e) {
      const file = e.target.files[0]
      console.log(file)
      if (file.type !== 'text/xml') {
        tip.open('请选择XML格式的文件', 2)
        return
      }
      if (file.size / 1024 / 1024 > 5) {
        tip.open('文件大小不能超过5M', 2)
        return
      }
      this.fileName = file.name
      this.file = file
    },
    onImport () {
      if (this.file === '') {
        tip.open('请选择上传文件', 2)
        return
      }
      loading.open('请稍候...')
      ApiClient.upload('org/importOrg', this.file, null).then(data => {
        console.log(data)
        loading.close()
        this.onImportSuccess()
      }).catch(e => {
        loading.close()
        console.error(e)
        tip.open(e.response.data.exception, 2)
      })
    },
    onImportManagement () {
      clearInterval(countBack)
      this.$parent.$emit('changeNavActive', 'ImportManagement')
      this.$router.push({path: '/ImportManagement'})
    },
    onImportSuccess () {
      this.isImport = true
      countBack = setInterval(() => {
        if (this.count > 0) {
          this.count--
        } else {
          this.onImportManagement()
        }
      }, 1000)
    },
    onDownload () {
      window.open(constants.apiBaseUrl + '/template/downloadImportTemplate?type=ORG')
    }
  }
}
</script>
<style lang="css" src="../../css/OrganizationImport.css" scoped></style>
