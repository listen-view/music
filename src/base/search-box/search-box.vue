<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
export default {
  props: {
    value:{
      type:String
    }
  },
  data() {
    return {
      query: '',
      placeholder:'搜索歌曲、歌手'
    }
  },
  watch: {
    query() {
      let timer
      clearTimeout (timer)
      timer=setTimeout(()=>{
        this.$emit('query',this.query)
      },200)
    },
    value() {
      if(this.value!== '' ){
        this.query=this.value
      }
    }
  },
  methods: {
    clear() {
      this.query=''
    }
  }
}

</script>
<style scoped lang='stylus'>
@import "~@/common/stylus/variable"
.search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    font-size: 24px
    color: $color-text-l
  .box
    flex: 1
    margin: 0 5px
    outline: none
    line-height: 18px
    background: $color-highlight-background
    color: $color-text-l
    font-size: $font-size-medium
    &::placeholder
      color: $color-text-l
  .icon-dismiss
    font-size: 16px
    color: $color-background
</style>