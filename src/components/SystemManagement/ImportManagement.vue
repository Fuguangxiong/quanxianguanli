<template>
    <div id='ImportManagement'>
      <bread-crumb :data="breadcrumb"></bread-crumb>
    <div class='pa-big-box'>
      <div class="pa-search-area">
      <div class='pa-search-condition'>
        <span class='pa-span-info'>组织：<select-down :val="orgName" :data="orgList" @change="onChangeOrg" :width="128"></select-down></span>
        <span class='pa-span-info'>导入类型：<select-down :val="typeName" :data="typeList" @change="onChangeType" :width="128"></select-down></span>
        <span class='pa-span-info'>状态：<select-down :val="stateName" :data="stateList" @change="onChangeState" :width="128"></select-down></span>
        <span class='pa-span-info'>导入时间：<div class='pa-time-area'>
                <span >
                <el-date-picker
                  align="left"
                  v-model="value11"
                  type="date"
                  :editable=false
                  placeholder="请选择时间"
                  format="yyyy-MM-dd"
                  :picker-options="pickerOptions0"
                >
                </el-date-picker>
                  </span>
                     <span class='pa-time-line'>—</span>
			             <span>
                <el-date-picker
                  align="left"
                  :editable=false
                  v-model="value12"
                  type="date"
                  placeholder="请选择时间"
                  format="yyyy-MM-dd"
                  :picker-options="pickerOptions1"
                >
                </el-date-picker>
               </span>
			</div>
			</span>
      </div>
      <div class='pa-search-button'>
        <button class="btnGray" @click='OnReset'>重置</button>
        <button class="btnBlue" @click='OnSearch'>查找</button>
      </div>
    </div>
    <div class='pa-list-area'>
      <div class="pa-table-head">
        <span class="pa-table-col0">上传文件名</span>
        <span class="pa-table-col1">导入类型</span>
        <span v-show='isTypeRESOURCE' class="pa-table-col2">组织名</span>
        <span class="pa-table-col3" :class="{typeresource: !isTypeRESOURCE }">记录数</span>
        <span class="pa-table-col4">导入时间</span>
        <span class="pa-table-col5">状态</span>
        <span class="pa-table-col6">错误原因</span>
        <span class="pa-table-col8">出错文件</span>
      </div>
      <div class="pa-list-content">
        <div class="pa-table-row" v-for="(value,index) in listData" :key='index'>
          <span class="pa-table-col0" :title="value.uploadFile">{{value.uploadFile}}</span>
          <span class="pa-table-col1" :title="value.type ==='USER'?'用户':value.type ==='ORGANIZATION'?'组织':'资源'">{{value.type ==='USER'?'用户':value.type ==='ORGANIZATION'?'组织':'资源'}}</span>
          <span v-show='isTypeRESOURCE' class="pa-table-col2" :title="value.organization === null?'':value.organization.name">{{value.organization === null?'':value.organization.name}}</span>
          <span :class="{typeresource: !isTypeRESOURCE }" class="pa-table-col3" :title='value.recordNum'>{{value.recordNum}}</span>
          <span class="pa-table-col4" :title='value.createTime | formatDuring'>{{value.createTime | formatDuring}}</span>
          <span class="pa-table-col5" :title="value.status ==='PROCESSING'?'导入中':value.status ==='SUCCESS'?'导入完成':'导入失败'">{{value.status ==='PROCESSING'?'导入中':value.status ==='SUCCESS'?'导入完成':'导入失败'}}</span>
          <span class="pa-table-col61" :title='value.errorMsg'>{{value.errorMsg}}</span>
          <span class="pa-table-col7" @click="onDownLoad(value.type,value.errorFile)">{{value.errorFile?'下载':''}}</span>
        </div>
        <div class="pa-nothing" v-show="!listData.length">
          <div class="nothing-img"></div>
          <div class="nothing-text">未查找到相关数据</div>
        </div>
        <div class="paginationBlock block" v-show="total>10">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total=total>
          </el-pagination>
        </div>
      </div>
    </div>
    </div>
    </div>
</template>
<script>
  import Constants from '../../publicJs/Constants.js'
import UtilService from '../../publicJs/UtilService.js'
import breadCrumb from '../../publicComponent/breadCrumb'
import selectDown from '../../publicComponent/selectDown'
import ApiClient from '../../publicJs/ApiClient.js'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'

export default {
    name: 'ImportManagement',
    filters: {
      formatDuring (time) {
        return UtilService.formatDuring(time, 'yyyy-MM-dd HH:mm:ss')
      }
    },
    data () {
      return {
        isTypeRESOURCE: true,
        navActiveName: 'ImportManagement',
        orgName: '',
        orgList: [],
        orgId: '',
        breadcrumb: [
          {name: '导入管理', link: 'ImportManagement'},
          {name: '导入任务列表', link: ''}
        ],
        typeName: '',
        typeList: [{name: '全部类型'}, {name: '用户'}, {name: '组织'}, {name: '资源'}],
        stateName: '',
        stateList: [{name: '全部状态'}, {name: '导入完成'}, {name: '导入中'}, {name: '导入失败'}],
        value11: '',
        value12: '',
        type: '',
        status: '',
        pickerOptions0: {
          disabledDate: time => {
            if (this.value12 !== '') {
              return time.getTime() > Date.now() || time.getTime() > this.value12
            } else {
              return time.getTime() > Date.now()
            }
          }
        },
        pickerOptions1: {
          disabledDate: time => {
            return time.getTime() < this.value11 || time.getTime() > Date.now()
          }
        },
        pageNum: 1,
        pageSize: 10,
        listData: [],
        currentPage: 1,
        total: 1,
        startTime: '',
        endTime: ''
      }
    },
    mounted () {
      this.typeName = '全部类型'
      this.stateName = '全部状态'
      this.init()
    },
    components: {
      'BreadCrumb': breadCrumb,
      'select-down': selectDown
    },
    methods: {
      init () {
        LoadingBoxService.open('数据加载中...')
        var that = this
        ApiClient.get('/org/getAllEnterprises'
        ).then(data => {
          that.orgList = data
          that.orgList.unshift({
            id: '',
            type: 'ENTERPRISE',
            name: '全部组织',
            sourceId: null,
            parentId: null,
            sort: 0
          })
          this.orgName = that.orgList[0].name
          console.log(this.orgName, 'this.orgName')
        }).catch(e => {
        })
        ApiClient.get('/importRecord/list', {
          orgId: that.orgId,
          type: that.type,
          status: that.status,
          startTime: that.value11,
          endTime: that.value12,
          pageNum: that.pageNum,
          pageSize: that.pageSize
        }
        ).then(data => {
          this.listData = data.list
          this.total = data.total
          LoadingBoxService.close()
        }).catch(e => {
          LoadingBoxService.close()
        })
      },
      onChangeType (item) {
        this.typeName = item.name
        switch (this.typeName) {
        case '全部类型':this.type = ''
          break
        case '用户':this.type = 'USER'
          break
        case '组织':this.type = 'ORGANIZATION'
          break
        case '资源':this.type = 'RESOURCE'
          break
        }
      },
      onChangeState (item) {
        this.stateName = item.name
        switch (this.stateName) {
        case '全部状态':this.status = ''
          break
        case '导入完成':this.status = 'SUCCESS'
          break
        case '导入中':this.status = 'PROCESSING'
          break
        case '导入失败':this.status = 'FAIL'
          break
        }
      },
      OnReset () {
        this.orgName = '全部组织'
        this.typeName = '全部类型'
        this.stateName = '全部状态'
        this.value11 = ''
        this.value12 = ''
        this.orgId = ''
        this.type = ''
        this.status = ''
      },
      OnSearch () {
        var that = this
        // 判断如果导入类型type类型是资源的话 组织名列删除
        that.isTypeRESOURCE = that.type !== 'RESOURCE'
        console.log(that.value11, that.value12, 'value')
        if (that.value11 === '') {
          that.startTime = that.value11
        } else {
          let monthstart = that.value11.getMonth() + 1
          that.startTime =
          that.value11.getFullYear() +
          '-' +
          monthstart +
          '-' +
          that.value11.getDate()
        }
        if (that.value12 === '') {
          that.endTime = that.value12
        } else {
          let monthend = that.value12.getMonth() + 1
          that.endTime =
          that.value12.getFullYear() +
          '-' +
          monthend +
          '-' +
          (that.value12.getDate() + 1)
        }
        console.log(that.startTime)
        console.log(that.endTime)
        LoadingBoxService.open('数据加载中...')
        ApiClient.get('/importRecord/list', {
          orgId: that.orgId,
          type: that.type,
          status: that.status,
          startTime: that.startTime,
          endTime: that.endTime,
          pageNum: that.pageNum,
          pageSize: that.pageSize
        }
        ).then(data => {
          this.listData = data.list
          this.total = data.total
          LoadingBoxService.close()
        }).catch(e => {
          LoadingBoxService.close()
        })
      },
      handleCurrentChange (val) {
        this.pageNum = val
        this.OnSearch()
      },
      onChangeOrg (item) {
        this.orgName = item.name
        this.orgId = item.id
      },
      onDownLoad (item1, item2) {
        if (item1 === 'USER') {
          window.location.href = Constants.apiBaseUrl + '/template/errorFileDownload/user?fileName=' + item2
        } else if (item1 === 'ORGANIZATION') {
          window.location.href = Constants.apiBaseUrl + '/template/errorFileDownload/org?fileName=' + item2
        } else {
          window.location.href = Constants.apiBaseUrl + '/template/errorFileDownload/resource?fileName=' + item2
        }
      }
    }
}
</script>
<style src='../../css/ImportManagement.css' scoped>
</style>
<style>
#ImportManagement .el-date-editor {
  width: 128px;
  height: 30px;
  border-color: #ddd;
}
#ImportManagement .el-input__inner {
  height: 30px;
  font-size: 12px;
}
#ImportManagement .el-input__prefix .el-input__icon {
  line-height: 25px;
}
#ImportManagement .el-pagination__editor.el-input .el-input__inner {
  height: 25px;
}
#ImportManagement .el-pager li {
  font-weight: normal;
}
#ImportManagement .el-pagination__editor .el-input__inner {
  border: none;
  border-radius: 0px;
  width: 65%;
}
span.pa-table-col3.typeresource{
  width:15%;
}
</style>
