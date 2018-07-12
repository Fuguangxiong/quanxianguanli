<template>
  <div id="selectionBoxForDepartment" class="shade" v-show="isShow">
    <div>
      <div class="head-title">
        <span class="title-text">{{title.text}}</span>
        <span class="title-tip" v-show="title.tip">(组织：{{title.tip}})</span>
        <i class="iconfont icon--" @click="onClose"></i>
      </div>
      <div class="body-content">
        <div class="content-item">
          <span class="content-title must">部门：</span><input disabled v-model="name" class="linked-data" type="text">
        </div>
        <div class="content-box" :class="{'more-height': !isShowPostion}">
          <el-tree
            default-expand-all
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="handleNodeClick">
          </el-tree>
        </div>
        <div class="content-item" v-show="isShowPostion">
          <span class="content-title ">职位：</span><input maxlength="10" v-model="position" class="linked-data" type="text">
        </div>
      </div>
      <div class="bottom-btn">
        <button class="save" @click="onUpdate">确认</button>
        <button class="cancel" @click="onClose">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'selectionBoxForDepartment',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    data: Array,
    title: Object,
    currentDepartment: {
      type: Object,
      default: function () {
        return {
          name: '',
          position: '',
          id: ''
        }
      }
    },
    isShowPostion: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    isShow (val) {
      if (!val) {
        this.linkedData = {id: this.currentDepartment.id}
        this.name = this.currentDepartment.name
      }
    },
    data (val) {
      this.treeData = val
    },
    'currentDepartment.name': function (val) {
      this.name = val
    },
    'currentDepartment.position': function (val) {
      this.position = val
    },
    'currentDepartment.id': function (val) {
      this.linkedData.id = val
    }
  },
  data () {
    return {
      name: '',
      // 需要关联的数据
      linkedData: {},
      // 部门树
      treeData: [],
      // 职位
      position: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    onClose () {
      this.position = this.currentDepartment.position
      this.$emit('close')
    },
    onUpdate () {
      this.linkedData.position = this.position
      this.$emit('update', this.linkedData)
    },
    handleNodeClick (data) {
      // console.log(data)
      this.name = data.name
      this.linkedData = data
    }
  }
}
</script>
<style lang="css" scoped>
@keyframes vicp {
  0% {
    opacity: 0;
    -webkit-transform: scale(0) translatey(-60px);
    transform: scale(0) translatey(-60px);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1) translatey(0);
    transform: scale(1) translatey(0);
  }
}
.shade {
  position: fixed;
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
}
.shade > div {
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  position: fixed;
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 10000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 442px;
  height: 418px;
  background-color: #fff;
  border-radius: 5px;
  -webkit-animation: vicp 0.12s ease-in;
  animation: vicp 0.12s ease-in;
  overflow: hidden;
}
.head-title {
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  background-color: #3d82ea;
  color: #fff;
  font-weight: 700;
}
.title-text {
  font-size: 14px;
}
.head-title .icon-- {
  float: right;
  padding-right: 10px;
  transform: translateY(1px);
  cursor: pointer;
}

.body-content {
  position: absolute;
  top: 40px;
  left: 0;
  bottom: 40px;
  right: 0;
  padding: 15px 50px 10px;
}
.content-item {
  height: 30px;
  line-height: 30px;
}
.content-title {
  position: relative;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
}
.linked-data {
  width: 300px;
  height: 100%;
  padding-left: 5px;
  border: 1px solid #eee;
  border-radius: 3px;
  outline: none;
  background-color: #fff;
}
.linked-data:focus {
  border-color: #55adf8;
}
.content-box {
  border: 1px solid #eee;
  border-radius: 3px;
  height: 222px;
  width: calc(100% - 42px);
  padding: 10px;
  overflow-y: auto;
  margin: 5px 0 10px 42px;
}
.content-box.more-height {
  height: 252px;
}
.shade .bottom-btn {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
}
.shade .bottom-btn > button {
  width: 50%;
  border: none;
  outline: none;
  height: 100%;
  padding: 0;
  float: left;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
}
.shade .bottom-btn > button.save {
  background-color: #3d82ea;
}
.shade .bottom-btn > button.save:hover {
  background-color: #639fea;
}
.shade .bottom-btn > button.cancel {
  background-color: #e2e2e2;
}
.shade .bottom-btn > button.cancel:hover {
  background-color: #dcdcdc;
}
</style>

<style>
#selectionBoxForDepartment .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  /* background-color: #fff; */
  color: #3d82ea;
}
#selectionBoxForDepartment .el-tree-node__label {
  font-size: 12px;
}
</style>
