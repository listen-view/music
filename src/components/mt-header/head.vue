<template>
  <div class="mt-header">
    <div class='icon'></div>
    <div class='text'>Your's Music</div>
    <router-link class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {

}

</script>
<style scoped lang="stylus">
  @import "~@/common/stylus/mixin.styl"
  @import "~@/common/stylus/variable.styl"
  .mt-header
    background #31c27c
    color white
    height 44px
    position relative
    text-align center
    .icon
      background-image url("qq.jpg")
      border-radius 50%
      background-color #31c27c
      background-position -4px
      background-repeat no-repeat
      width 30px
      height 28px
      display inline-block
      background-size 39px 36px
      margin 6px 9px 0 0
    .text
      display inline-block
      font-size 18px
      line-height 44px
      vertical-align top
    .mine
      position absolute
      right 20px
      top 3px
      line-height 40px
      color white
      font-size 18px
</style>
