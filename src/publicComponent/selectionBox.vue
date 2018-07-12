<template>
  <div class="shade" v-show="isShow">
    <div>
      <div class="head-title">
        <span class="title-text">{{title.text}}</span>
        <span class="title-tip" v-show="title.tip">(组织：{{title.tip}})</span>
        <i class="iconfont icon--" @click="onClose"></i>
      </div>
      <div class="body-content">
        <div class="content-left">
          <div class="content-title">{{title.name}}</div>
          <div class="content-box">
            <div class="search-box">
              <input class="key-word" type="text" v-model="keyWord" @keyup.enter="onGetDataForKeyWord">
              <i class="search-btn iconfont icon-xiazai5" @click="onGetDataForKeyWord"></i>
            </div>
            <div class="info">
              <div class="info-item" v-for="(item,index) in infoItemData" :key="index">
                <el-checkbox @change="onChangeLinked(item)" v-model="item.isChecked"></el-checkbox>
                <span class="info-text">{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="content-right">
          <div class="content-title">已选</div>
          <div class="content-box">
            <div class="info-linked" v-for="(item,index) in linkedData" :key="index">
              <span>{{item.name}}</span>
              <i class="iconfont icon--" @click="onCencelLinked(item, index)"></i>
            </div>
          </div>
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
  name: 'selectionBox',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    data: Array,
    title: Object
  },
  watch: {
    // 数据更新时，根据右边已选的数据来决定更新的数据是否被选中
    data (val) {
      this.infoItemData = val
      for (let i = 0; i < this.infoItemData.length; i++) {
        this.infoItemData[i].isChecked = false
      }
      for (let i = 0; i < this.linkedData.length; i++) {
        const el1 = this.linkedData[i]
        for (var j = 0; j < this.infoItemData.length; j++) {
          const el2 = this.infoItemData[j]
          if (el1.id === el2.id) {
            el2.isChecked = true
            break
          }
        }
      }
    },
    isShow (val) {
      if (val === false) {
        this.keyWord = ''
        this.onGetDataForKeyWord()
        this.linkedData = []
      }
    }
  },
  created () {
    // this.infoItemData = this.data
  },
  data () {
    return {
      // 获取的数据
      infoItemData: [],
      // 要关联的数据
      linkedData: [],
      // 关键字
      keyWord: ''
    }
  },
  methods: {
    // 左边勾选事件
    onChangeLinked (item) {
      if (item.isChecked) {
        this.linkedData.push(item)
      } else {
        for (let i = 0; i < this.linkedData.length; i++) {
          const el = this.linkedData[i]
          if (el.id === item.id) {
            this.linkedData.splice(i, 1)
            break
          }
        }
      }
    },
    // 右边取消事件
    onCencelLinked (item, index) {
      this.linkedData.splice(index, 1)
      for (let i = 0; i < this.infoItemData.length; i++) {
        const el = this.infoItemData[i]
        if (el.id === item.id) {
          el.isChecked = false
          break
        }
      }
    },
    // 关键字搜索
    onGetDataForKeyWord () {
      // alert(this.keyWord)
      this.$emit('keyWord', this.keyWord.trim())
    },
    // 保存更新
    onUpdate () {
      this.$emit('update', this.linkedData)
      this.linkedData = []
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
  width: 680px;
  height: 450px;
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
  padding: 24px 19px 10px;
}
.content-left,
.content-right {
  width: 50%;
  height: 100%;
  float: left;
  padding-right: 10px;
}
.content-right {
  padding-left: 10px;
  padding-right: 0;
}
.content-title {
  height: 20px;
  line-height: 14px;
  color: #55adf8;
  font-size: 14px;
}
.content-box {
  border: 1px solid #f8f8f8;
  height: 312px;
  width: 100%;
  padding: 10px;
}
.content-right .content-box {
  overflow-y: auto;
}
.search-box {
  height: 30px;
  line-height: 30px;
  margin-bottom: 9px;
  position: relative;
}
.key-word {
  width: 288px;
  height: 100%;
  padding-left: 5px;
  margin-right: 15px;
  border: 1px solid #eee;
  border-radius: 3px;
  outline: none;
}
.key-word:focus {
  border-color: #55adf8;
}
.search-btn {
  position: absolute;
  right: 8px;
  top: 0;
  font-size: 18px;
  color: #3d82ea;
  cursor: pointer;
}
.info {
  height: 260px;
  overflow-y: auto;
}
.info-item {
  height: 34px;
  line-height: 34px;
}
.info-text {
  float: right;
  width: calc(100% - 20px);
  height: 100%;
  font-size: 14px;
  margin-left: 3px;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/
}
.info-linked {
  height: 34px;
  line-height: 34px;
  padding-left: 5px;
  background-color: #f7fbff;
  margin-bottom: 10px;
}
.info-linked .icon-- {
  float: right;
  font-size: 10px;
  padding-right: 10px;
  color: #55adf8;
  cursor: pointer;
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
