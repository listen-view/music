<template>
  <transition name="list-fade">
    <div class="playlist"  v-show="showFlag"  @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="removeAll()">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li :key="item.id" class="item" ref="listItem"  @click="selectItem(index)" v-for="(item, index) in sequenceList">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="favoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到列表</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import {mapMutations} from 'vuex'
import {mapActions} from 'vuex'
import Scroll from '@/base/scroll/scroll'
import { playMode } from '@/common/js/config'
export default {
  data() {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'favoriteList'
    ]),
    modeText() {
      return this.mode === playMode.sequence ? '播放顺序' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  components: {
    Scroll
  },
  methods: {
    ...mapActions([
      'deleteSong', 'deleteSongList','saveFavoriteList', 'deleteFavoriteList'
    ]),
    ...mapMutations({
      setCurrentIndex:"SET_CURRENT_INDEX"
    }),
    favoriteIcon(song) {
      if(this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    removeAll() {
      if(window.confirm('您确定全部删除吗')){
        this.deleteSongList()
      }else{
        return
      }
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      } else {
        return ''
      }
    },
    deleteItem(data) {
      this.deleteSong(data)
    },
    selectItem(data) {
      this.setCurrentIndex(data)
    },
    show() {
      this.showFlag = true
      this.$nextTick(() => {
        this.$refs.listContent.refresh()
      })
    },
    hide() {
      this.showFlag = false
    },
    toggleFavorite(song) {
      if(this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else{
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

.playlist 
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0,0,0,.2) ;
  &.list-fade-enter-active, &.list-fade-leave-active 
    transition: opacity 0.3s;
    .list-wrapper 
      transition: all 0.3s;      
  &.list-fade-enter, &.list-fade-leave-to 
    opacity: 0;
    .list-wrapper 
      transform: translate3d(0, 100%, 0);
  &.list-fade-enter, .list-wrapper 
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header 
      position: relative;
      padding: 20px 30px 10px 20px;
      .title 
        display: flex;
        align-items: center;
        .icon 
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;        
        .text 
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;        
        .clear 
          extend-click();
          .icon-clear 
            font-size: $font-size-medium;
            color: $color-text-d;
    .list-content 
      max-height: 240px;
      overflow: hidden;
      .item 
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active, &.list-leave-active 
          transition: all 0.1s;        
        &.list-enter, &.list-leave-to 
          height: 0;        
        .current 
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme;        
        .text 
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;        
        .like 
          extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite 
            color: red;
        .delete 
          extend-click();
          font-size: $font-size-small;
          color: $color-theme;
    .list-operate 
      width: 140px;
      margin: 20px auto 30px auto;
      .add 
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add 
          margin-right: 5px;
          font-size: $font-size-small-s;
        .text 
          font-size: $font-size-small;
    .list-close 
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;    
</style>
