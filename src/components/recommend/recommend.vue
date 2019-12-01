<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="recommends.length" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" @click="selectItem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {mapState} from 'vuex'
  import {getRecommend, getDiscList} from '@/api/recommend'
  import {ERR_OK} from '@/api/config'
  import slider from '@/base/slider/slider'
  import loading from '@/base/loading/loading'
  import scroll from '@/base/scroll/scroll'

  export default {
    created () {
      this._getRecommend(),
        this._getDiscList()
    },
    data () {
      return {
        recommends: [],
        discList: [],
        disc: ''
      }
    },
    watch: {
      playlist () {
        this.hasPlayer()
      }
    },
    methods: {
      ...mapMutations({
        setDisc: 'SET_DISC'
      }),
      hasPlayer () {
        if (this.playlist.length > 0) {
          this.$refs.recommend.style.bottom = `60px`
          this.$refs.scroll.refresh()
        } else {
          this.$refs.recommend.style.bottom = 0
          this.$refs.scroll.refresh()
        }
      },
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      selectItem (item) {
        this.setDisc(item)
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
      }
    },
    mounted () {
      this.hasPlayer()
    },
    components: {
      slider,
      scroll,
      loading
    },
    computed: {
      ...mapState([
        'playlist'
      ])
    }
  }

</script>
<style scoped lang='stylus'>
  @import '~@/common/stylus/variable';
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
