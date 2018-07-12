<template>
  <div class="publicContainer" id="pa">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
      return {

      }
    }
  }
</script>
<style>

/* @import "http://at.alicdn.com/t/font_484230_fm8ezs9pwfgk3xr.css"; */
@import "http://at.alicdn.com/t/font_597653_m8anbpr9rr.css";
@import "./css/btn.css";
#pa .el-checkbox__inner{
  border:1px solid #ddd;
}
#pa .el-checkbox__inner:hover{
  border-color: #409EFF;
}
</style>
