<template>
  <div class="tabbar">
    <router-link to='recommend'><span class="tabitem">推荐</span></router-link>
    <router-link to='singer'><span class="tabitem">歌手</span></router-link>
    <router-link to='ranking'><span class="tabitem">排行</span></router-link>
    <router-link to='seacher'><span class="tabitem">搜索</span></router-link>
  </div>
</template>

<script>
export default {

}

</script>
<style scoped lang='stylus'>
@import '~@/common/stylus/variable.styl'
  .tabbar
    display flex
    height 44px
    font-size $font-size-medium
    a
      flex 1
      color $color-text-l
      text-align center
      line-height 44px
      .tabitem
        padding-bottom 5px
      &.active
        .tabitem
          border-bottom 2px solid $color-theme
          color $color-theme
</style>
