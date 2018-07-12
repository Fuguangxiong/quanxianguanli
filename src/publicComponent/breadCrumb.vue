<template>
  <div class="BreadCrumb">
    <span v-for="(item, index) in data" :key="index" @click="go(item.link)" :class="{'isclick':item.link!==''}">{{item.name}}</span>
  </div>
</template>
<script>
  export default {
    name: 'breadCrumb',
    props: ['data'],
    data () {
      return {
      }
    },
    methods: {
      go (link) {
        if (!link) {
          return
        }
        this.$router.push(link)
      }
    }
  }
</script>
<style scoped>
  .BreadCrumb {
    height: 31px;
    line-height: 31px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 12px;
  }
  .BreadCrumb .isclick{
    cursor: pointer;
  }
  .BreadCrumb .isclick:hover{
    color: #55a8fd;
  }
  .BreadCrumb::before {
    content: '';
    height: 12px;
    width: 3px;
    position: relative;
    border-radius: 2px;
    display: inline-block;
    top: 1px;
    margin-right: 6px;
    background-color: #3E81EA;
  }
  .BreadCrumb span {
    position: relative;
    padding-right: 6px;
  }
  .BreadCrumb span::after {
    content: '';
    height: 0px;
    width: 0px;
    position: relative;
    top: -3px;
    left: 3px;
    border: 1px solid #333;
    border-radius: 2px;
    display: inline-block;
    background-color: #333;
  }
  .BreadCrumb span:last-of-type::after {
    content: '';
    border: none;
  }
</style>
