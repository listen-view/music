<template>
  <transition name="slide">
    <div class="user-center" ref="user">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <div class="switch-box">
          <span class="switch" :class="{'active':currentIndex===0}" @click="tab">我喜欢的</span>
          <span class="switch" :class="{'active':currentIndex===1}" @click="tab">最近听的</span>
        </div>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <div v-for="(item,index) in favoriteList" @click="selectItem(item)" class="list-item">
              <p class="title">{{item.name}}</p>
              <p class="name">{{item.album}}</p>
            </div>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <div v-for="(data,index) in playHistory" @click="selectItem(data)" class="list-item">
              <p class="title">{{data.name}}</p>
              <p class="name">{{data.album}}</p>
            </div>          
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import scroll from '@/base/scroll/scroll'
import {mapGetters,mapState,mapActions} from 'vuex'
export default {
  methods: {
    ...mapActions([
      'insertSong','randomPlay'
    ]),
    random(data) {
      if(this.currentIndex===0) {
        this.randomPlay({list:this.favoriteList})
      }else {
        this.randomPlay({list:this.playHistory})
      }
    },
    hasPlayer() {
      if(this.playlist.length>0) {
        this.$refs.user.style.bottom= `60px`
      }else{
        this.$refs.user.style.bottom= 0     
      }
    },
    back() {
      this.$router.back()
    },
    tab() {
      if(this.currentIndex===0){
        this.currentIndex=1
      }else{
        this.currentIndex=0
      }
    },
    selectItem(index) {
      this.insertSong(index)
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'favoriteList','playHistory'
    ]),
    ...mapState([
      'playlist'
    ]),
  },
  mounted() {
    this.hasPlayer()
  },
  watch: {
    playlist() {
      this.hasPlayer()
    }
  },
  components: {
    scroll
  }
}

</script>
<style scoped lang='stylus'>
@import '~@/common/stylus/variable';

.user-center 
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;
  &.slide-enter-active, &.slide-leave-active 
    transition: all 0.3s;
  &.slide-enter, &.slide-leave-to 
    transform: translate3d(100%, 0, 0);
  .back 
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back 
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
  .switches-wrapper 
    margin: 10px 0 30px 0;
    text-align center
    .switch-box
      display flex
      margin 0 auto
      width 240px
      border 1px solid rgba(0,0,0,.3)
      border-radius 8px
      .switch
        padding 6px
        color #777
        flex 1
        &.active
          background-color #333
          color white
          border-radius 8px
  .play-btn 
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;
    .icon-play 
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;   
    .text 
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;      
  .list-wrapper 
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll 
      height: 100%;
      overflow: hidden;
      .list-inner 
        padding: 20px 30px;
        .list-item
          height 50px
          line-height 25px
          font-size 14px
          margin-bottom 10px
          .title
            color #000
          .name 
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
  .no-result-wrapper 
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  

</style>