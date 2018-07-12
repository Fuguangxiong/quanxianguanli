<template>
  <div class="shade" v-show="show">
    <div>
      <div class="head-title">
        <span class="title-text">{{title.head}}</span>
        <i class="iconfont icon--" @click="onClose"></i>
      </div>
      <div class="content">
        <span class="must">{{title.name}}</span><select-down :val="data[0].name" @change="onChange" :data="data" :width="250"></select-down>
      </div>
      <div class="bottom-btn">
        <button class="save" @click="onUpdate">确认</button>
        <button class="cancel" @click="onClose">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
import selectDown from '../../publicComponent/selectDown'
export default {
  name: 'OrganizationExport',
  props: {
    title: Object,
    show: Boolean,
    data: Array
  },
  watch: {
    data (val) {
      this.exportData = val[0]
    }
  },
  components: {
    'select-down': selectDown
  },
  data () {
    return {
      exportData: ''
    }
  },
  methods: {
    onChange (item) {
      this.exportData = item
    },
    onUpdate () {
      this.$emit('update', this.exportData)
    },
    onClose () {
      this.$emit('close')
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
  width: 400px;
  height: 250px;
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
.content {
  height: 170px;
  padding: 50px 40px 70px;
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
