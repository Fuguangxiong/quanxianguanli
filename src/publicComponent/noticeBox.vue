<template>
  <div id="notice-box">
    <div class="notice-box">
    </div>
    <div class="notice-box-area">
      <div class="notice-box-area-top">
        <span v-show="type===1 && !title">重置提示</span>
        <span v-show="type===2 && !title">删除提示</span>
        <span v-show="type===3 && !title">退出提示</span>
        <span v-show="type===4 && !title">移除提示</span>
        <span v-show="type===5 && !title">导出提示</span>
        <span v-show="title">{{title}}</span>
        <span @click="closeBox">×</span>
      </div>
      <div class="notice-box-area-center">
        <div class="notice-box-area-center-img">
          <div v-show="type===1"></div>
          <div v-show="type===2"></div>
          <div v-show="type===3"></div>
          <div v-show="type===4"></div>
          <div v-show="type===5"></div>
        </div>
        <div class="notice-box-area-center-msg">{{content}}</div>
      </div>
      <div class="notice-box-area-bottom">
        <div @click="confirm">确认</div>
        <div @click="closeBox">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'noticeBox',
    props: {
      type: Number,
      content: String,
      title: String
    },
    data () {
      return {}
    },
    created () {
    },
    components: {},
    methods: {
      closeBox () {
        this.$emit('closeBox', '点击叉叉或取消')
      },
      confirm () {
        this.$emit('confirm', '点击确认')
      }
    }
  }
</script>
<style scoped>
@keyframes vicp {
  0% {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
.notice-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.65);
}
.notice-box-area {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 440px;
  height: 258px;
  background-color: #fff;
  z-index: 1000;
  opacity: 1;
  border-radius: 5px;
  -webkit-animation: vicp .12s ease-in;
  animation: vicp .12s ease-in;
}
.notice-box-area-top {
  height: 42px;
  background-color: #3d82ea;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.notice-box-area-top span {
  padding: 10px 0 0 8px;
  color: #fff;
  font-size: 14px;
  float: left;
  font-weight: 600;
}
.notice-box-area-top span:last-child {
  padding: 0 0 0 0;
  width: 27px;
  height: 100%;
  float: right;
  font-family: SimSun;
  font-size: 23px;
  color: #fff;
  cursor: pointer;
  padding-top: 5px;
  vertical-align: middle;
  font-weight: 600;
}
.notice-box-area-center {
  height: 175px;
  overflow: hidden;
}
.notice-box-area-center-img div {
  width: 96px;
  height: 76px;
  margin: 27px 0 0 167px;
}

.notice-box-area-center-msg {
  height: 36px;
  text-align: center;
  line-height: 36px;
  font-size: 14px;
}
.notice-box-area-bottom {
  height: 41px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.notice-box-area-bottom div:first-child {
  width: 50%;
  height: 41px;
  float: left;
  background-color: #3d82ea;
  border-bottom-left-radius: 5px;
  text-align: center;
  line-height: 41px;
  color: #fff;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  transition: all .3s;
}
.notice-box-area-bottom div:first-child:hover{
  background: #639fea;
}
.notice-box-area-bottom div:last-child {
  width: 50%;
  height: 41px;
  float: right;
  background-color: #e2e2e2;
  border-bottom-right-radius: 5px;
  text-align: center;
  line-height: 41px;
  color: #fff;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  transition: all .3s;
}
.notice-box-area-bottom div:last-child:hover{
  background: #e8e8e8;
}
.notice-box-area-center-img div:nth-child(1){
  background: url("../publicImg/noticeImg-1.png") center center/cover no-repeat ;
}
.notice-box-area-center-img div:nth-child(2){
  background: url("../publicImg/noticeImg-2.png") center center/cover no-repeat ;
}
.notice-box-area-center-img div:nth-child(3){
  background: url("../publicImg/noticeImg-3.png") center center/cover no-repeat ;
}
.notice-box-area-center-img div:nth-child(4){
  background: url("../publicImg/noticeImg-4.png") center center/cover no-repeat ;
}
.notice-box-area-center-img div:nth-child(5){
  background: url("../publicImg/noticeImg-5.png") center center/cover no-repeat ;
}
</style>
