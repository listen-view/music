<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" :src="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view :songDetail="songDetail"></router-view>
  </div>
</template>

<script>
  import {getRankList} from '@/api/rank'
  import {ERR_OK} from '@/api/config'
  import loading from '@/base/loading/loading'
  import scroll from '@/base/scroll/scroll'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        topList: '',
        songDetail: ''
      }
    },
    watch: {
      playlist() {
        this.hasPlayer()
      }
    },
    computed: {
      ...mapState([
        'playlist'
      ])
    },
    components: {
      loading,
      scroll
    },
    methods: {
      _getTopList() {
        getRankList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      selectItem(data) {
        this.songDetail = data
        this.$router.push({
          path: `/ranking/${data.id}`
        })
      },
      hasPlayer() {
        if (this.playlist.length > 0) {
          this.$refs.rank.style.bottom = `60px`
          this.$refs.toplist.refresh()
        } else {
          this.$refs.rank.style.bottom = 0
          this.$refs.toplist.refresh()
        }
      }
    },
    created() {
      this._getTopList()
    },
    mounted() {
      this.hasPlayer()
    }
  }

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
