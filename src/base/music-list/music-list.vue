<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" @click="random" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <scroll :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <div v-for="(item,index) in songs" class="list-item" @click="selectItem(item,index)">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{item.singer}}-{{item.album}}</p>
        </div>
      </div>
      <loading v-show="!songs.length" class="loading-container"></loading>
    </scroll>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import {mapState} from 'vuex'
import loading from "@/base/loading/loading"
import scroll from "@/base/scroll/scroll"
export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
  },
  computed: {
    ...mapState([
      'playlist'
    ]),
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted() {
    this.initHeigth()
    this.hasPlayer()
  },
  watch: {
    playlist() {
      this.hasPlayer()
    }
  },
  methods: {
    ...mapActions([
      'selectPlay','randomPlay'
    ]),
    hasPlayer() {
      if(this.playlist.length>0) {
        this.$refs.list.$el.style.bottom= `60px`
        this.$refs.list.refresh()
      }else{
      this.$refs.list.$el.style.bottom= 0
      this.$refs.list.refresh()
      }
    },
    random() {
      this.randomPlay({list: this.songs})
    },
    back() {
      this.$router.back()
    },
    selectItem(data,index) {
      this.selectPlay({
        list:this.songs,
        index
      })
    },
    initHeigth() {
      let heigth= this.$refs.bgImage.clientHeight;
      this.$refs.list.$el.style.top = heigth+'px'
    }//初始化scroll容器头部位置
  },
  components: {
    scroll,
    loading
  }
}

</script>
<style scoped lang='stylus'>
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-theme
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      z-index 30
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 42%
      bottom: 0
      width: 100%
      z-index 211
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
        background: $color-background
        .list-item
          height 64px
        .name
          color black
          font-size 14px
          margin-bottom 10px
        .desc
          font-size 14px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>