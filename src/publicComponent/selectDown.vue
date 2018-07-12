<template>
  <div @click.stop="onToggle" class="box">
    <input :style="'width:' + width + 'px'" type="text" disabled v-model="label">
    <i class="iconfont icon-xiala1" :class="{rotate: isShow}"></i>
    <ul :style="'width:' + width + 'px'" class="list" v-show="isShow" ref="main">
      <li v-for="(item, index) in data" :title="item[defaultProps.name]" :key="index" @click="onChange(item)">{{item[defaultProps.name]}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'selectDown',
  props: {
    width: {
      type: Number,
      default: 210
    },
    val: String,
    data: Array,
    defaultProps: {
      type: Object,
      default: function () {
        return {name: 'name'}
      }
    }
  },
  watch: {
    val (val) {
      this.label = val
    }
  },
  data () {
    return {
      isShow: false,
      label: ''
    }
  },
  // mounted () {
  //   // 默认选中第一个
  //   if (this.val !== '') {
  //     this.label = this.val
  //   }
  // },
  methods: {
    onChange (item) {
      this.label = item[this.defaultProps.name]
      this.$emit('change', item)
    },
    onToggle () {
      this.isShow ? this.hide() : this.show()
    },
    show () {
      this.isShow = true
      document.addEventListener('click', this.hidePanel, false)
    },
    hide () {
      this.isShow = false
      document.removeEventListener('click', this.hidePanel, false)
    },
    hidePanel (e) {
      if (!this.$refs.main.contains(e.target)) {
        this.hide()
      }
    }
  },
  beforeDestroy () {
    this.hide()
  }
}
</script>
<style lang="css" scoped>
.box {
  position: relative;
  display: inline-block;
  height: 30px;
  line-height: 30px;
}
.box > input {
  height: 30px;
  border-radius: 4px;
  border: solid 1px #ddd;
  background-color: #fff;
  padding-left: 5px;
  cursor: pointer;
}
.icon-xiala1 {
  position: absolute;
  right: 10px;
  top: 1px;
  color: #999;
  transition: transform 0.4s;
  cursor: pointer;
  font-size: 10px;
}
.icon-xiala1.rotate {
  transform: rotate(180deg);
}
.list {
  position: absolute;
  top: 35px;
  border-radius: 2px;
  border: solid 1px #eeeeee;
  max-height: 152px;
  overflow-y: auto;
  background-color: #fff;
  z-index: 1;
}
.list > li {
  padding-left: 5px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list > li:hover {
  background-color: #F5F8FD;
}
</style>
