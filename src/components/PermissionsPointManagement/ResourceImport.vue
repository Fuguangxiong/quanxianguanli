<template>
  <div id="ResourceImport">
    <bread-crumb :data="breadcrumb"></bread-crumb>
      <div class="pa-import-box clearfix" v-show="!isImport">
        <div class="pa-left-box">
          <div class="pa-title">
            <div>
              <span class="pa-title-name">系统：</span><span>{{app}}</span>
            </div>
            <div>
              <span class="pa-title-name">权限模块：</span><span>{{module}}</span>
            </div>
          </div>
          <div class="pa-download-upload">
            <div class="pa-row">
              <span class="pa-sort">1</span>
              <span>下载资源导入模板，填写资源信息</span>
              <button class="btnBlue" @click="onDownload">下载</button>
            </div>
            <div class="pa-row">
              <span class="pa-sort">2</span>
              <span>上传填写好的资源模版文件不超过5M</span>
              <a href=";" class="pa-upload">选择文件<input accept="text/xml" @change="setFile" type="file" title=" "></a>
              <span class="pa-fileName" :title="fileName">{{fileName}}</span>
            </div>
          </div>
          <div class="pa-caption">
            <p>模版说明：</p>
            <p>1. 请上传标准格式的XML文件，格式请参考右边示例</p>
            <p>2. 如果模板中的资源已经存在于系统中，会被忽略，不会重复导入</p>
            <p>3. 权限码在当前系统必须唯一，必须是字母和数字的组合，否则导入报错</p>
            <p>4. 资源类型只能是菜单，按钮和自定义</p>
            <p>5. 如果类型是菜单和按钮，operation节点只能有一个，操作名是是否可见</p>
          </div>
        </div>
        <div class="pa-right-box">
  <pre class="pa-template">
&lt;?xml version=<span class="string">"1.0"</span> encoding=<span class="string">"UTF-8"</span> standalone=<span class="string">"no"</span>?&gt;
&lt;resource&gt;
  &lt;sub-resource&gt;
      &lt;resource&gt;
        &lt;name&gt;<span class="content">服务管理</span>&lt;/name&gt;
        &lt;type&gt;<span class="content">菜单</span>&lt;/type&gt;
        &lt;operations&gt;
          &lt;operation&gt;
            &lt;name&gt;<span class="content">是否可见</span>&lt;/name&gt;
            &lt;code&gt;<span class="content">12345678</span>&lt;/code&gt;
          &lt;/operation&gt;
        &lt;/operations&gt;
        &lt;sub-resource&gt;
          &lt;resource&gt;
            &lt;name&gt;<span class="content">原子服务</span>&lt;/name&gt;
            &lt;type&gt;<span class="content">自定义</span>&lt;/type&gt;
            &lt;operations&gt;
              &lt;operation&gt;
                &lt;name&gt;<span class="content">新增</span>&lt;/name&gt;
                &lt;code&gt;<span class="content">12345678</span>&lt;/code&gt;
              &lt;/operation&gt;
              &lt;operation&gt;
                &lt;name&gt;<span class="content">删除</span>&lt;/name&gt;
                &lt;code&gt;<span class="content">2245678</span>&lt;/code&gt;
              &lt;/operation&gt;
            &lt;/operations&gt;
          &lt;/resource&gt;
        &lt;/sub-resource&gt;
      &lt;/resource&gt;
  &lt;/sub-resource&gt; 
&lt;/resource&gt;
  </pre>
        </div>
        <div class="pa-btn"><button class="btnBlue" @click="onConfirm">导入</button></div>
      </div>
      <div class="pa-success-tip" v-show="isImport">
        <div class="pa-tips">
          <img src="../../publicImg/submitsuccess.png">文件导入开始，{{count}}s后跳转到<span @click="onImportManagement">导入管理</span>页面查看进度。
        </div>
      </div>
      <notice-box :title="'导入提示'" v-show="isConfirm" :type="5" @closeBox="isConfirm = false" @confirm="confirmFunction" :content="confirmText"></notice-box>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import noticeBox from '../../publicComponent/noticeBox'
import tip from '../../publicJs/TipBoxService'
import constants from '../../publicJs/Constants.js'
import ApiClient from '../../publicJs/ApiClient'
import loading from '../../publicJs/LoadingBoxService.js'
let countBack = ''
export default {
  name: 'PermissionsPointManagement',
  components: {
    'bread-crumb': breadCrumb,
    'notice-box': noticeBox
  },
  data () {
    return {
      navActiveName: 'OrganizationManagement',
      breadcrumb: [{name: '资源管理', link: 'PermissionsPointManagement'}, {name: '资源导入', link: ''}],
      fileName: '未选择文件',
      file: '',
      isImport: false,
      count: 3,
      app: '',
      appId: '',
      module: '',
      confirmFunction: null,
      confirmText: '',
      isConfirm: false
    }
  },
  created () {
    this.app = this.$route.query.app
    this.appId = this.$route.query.appId
    this.module = this.$route.query.module
    this.id = this.$route.query.id
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
    onConfirm () {
      if (this.file === '') {
        tip.open('请选择上传文件', 2)
        return
      }
      this.isConfirm = true
      this.confirmText = '您确认要向' + this.app + '系统的' + this.module + '模块导入资源吗？'
      this.confirmFunction = this.onImport
    },
    onImport () {
      loading.open('请稍候...')
      ApiClient.upload('resource/importResource/' + this.id + '/' + this.appId, this.file, null).then(data => {
        console.log(data)
        this.isConfirm = false
        loading.close()
        this.onImportSuccess()
      }).catch(e => {
        loading.close()
        this.isConfirm = false
        console.error(e)
        tip.open(e.response.data.exception, 2)
      })
    },
    onImportManagement () {
      clearInterval(countBack)
      // this.$parent.$emit('changeNavActive', 'ImportManagement')
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
      window.open(constants.apiBaseUrl + '/template/downloadImportTemplate?type=RESOURCE')
    }
  },
  beforeDestroy () {
    clearInterval(countBack)
  }
}
</script>
<style lang="css" src="../../css/OrganizationImport.css" scoped></style>
<style scoped>
#ResourceImport {
  height: 100%;
}
</style>

