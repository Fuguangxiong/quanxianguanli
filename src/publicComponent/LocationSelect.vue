<template>
  <div class="msginput" @click.stop="toggle" :class="{active: showSelectlist}">
    <i class="iconfont icon-xiala1"></i>
    <input disabled :placeholder="preview" v-model="curdata" type="text">
    <transition>
      <div class="selectlist" v-show="showSelectlist" ref="main">
        <p class="selectlistItem" :title="item.name" @click="clickhandler(item)" v-for="(item,index) in data" :key="index">
          {{item.name}}
        </p>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    name: 'myselect',
    props: ['data', 'curvalue', 'selected', 'preview'],
    mounted () {
    },
    watch: {
      curvalue (val, oldval) {
        this.curdata = val
      },
      data (val, oldval) {
        this.num++
        if (this.num > 1) {
          this.curdata = ''
        }
      },
      selected (val, oldval) {
        if (val === false) {
          this.hide()
        }
      }
    },
    data () {
      return {
        curdata: '',
        showSelectlist: false,
        num: 0
      }
    },
    methods: {
      clickhandler (item) {
        this.curdata = item.name
        this.$emit('change', item)
      },
      toggle () {
        if (this.data.length === 0) return
        this.showSelectlist ? this.hide() : this.show()
        this.$emit('changeSelect')
      },
      show () {
        this.showSelectlist = true
        this.$refs.main.style.width = '150%'
        this.$refs.main.style.height = '156px'
        document.addEventListener('click', this.hidePanel, false)
      },
      hide () {
        this.showSelectlist = false
        this.$refs.main.style.width = '100%'
        this.$refs.main.style.height = '0px'
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
  .msginput {
    position: relative;
    width: 69px;
    display: inline-block;
  }
  .msginput input[disabled],
  .msginput input {
    border: 1px solid #ddd;
    outline: none;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    padding-left: 6px;
    padding-right: 13px;
    background-color: #fff;
    cursor: pointer;
    width: 100%;
    color: #333;
    overflow: hidden;
  }
  .msginput input:focus {
    border: 1px solid #55a8fd;
    box-shadow: 0 0 2px #55a8fd;
  }
  .msginput i.icon-xiala1 {
    line-height: 1;
    color: #999;
    font-size: 12px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 4px;
    z-index: 10;
    transition: transform 0.3s;
  }
  .msginput.active i.icon-xiala1 {
    transform: translateY(-50%) rotate(180deg);
  }
  .msginput.active input {
    border: 1px solid #55a8fd;
  }
  .msginput .selectlist {
    position: absolute;
    top: 32px;
    width: 100%;
    border: 1px solid #bfcbd9;
    z-index: 20;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    transition: width .2s 0s, height .2s .2s;
    max-height: 156px;
    overflow-y: auto;
  }
  .msginput .selectlist p {
    height: 30px;
    line-height: 30px;
    padding-left: 6px;
    cursor: pointer;
    overflow: hidden;
  }
  .msginput .selectlist p:hover {
    background-color: #e4e8f1;
  }
</style>
