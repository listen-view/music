<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" :value="hotkeyItem" @query="onQueryChange"></search-box>
    </div>
    <div  class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="hotkey" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="item in hotkey" class="item" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear"  @click="clearSearchHistory">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <div class="search-item" @click="addQuery(content)" v-for="content in searchHistory">
              <p>{{content}}</p>
              <i class="icon-delete" @click.stop="deleteSearchHistory(content)"></i>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest  ref="suggest" :query="query" @select="saveSearch"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box'
import suggest from '@/components/suggest/suggest'
import {getHotKey} from '@/api/search'
import {mapState,mapActions} from 'vuex'
import scroll from '@/base/scroll/scroll'
export default {
  components: {
    SearchBox,
    suggest,
    scroll
  },
  watch: {
    playlist() {
      this.hasPlayer()
    }
  },
  data() {
    return {
      query:'',
      searchList:'',
      hotkey: [],
      hotkeyItem: ''
    }
  },
  created() {
    getHotKey().then((res) => {
      this.hotkey = res.data.hotkey.slice(0, 10)
    })
  },
  mounted() {
    this.hasPlayer()
  },
  methods: {
    ...mapActions([
      'saveSearchHistory','deleteSearchHistory','clearSearchHistory'
    ]),
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    onQueryChange(data) {
      this.query=data
    },
    addQuery(data) {
      this.hotkeyItem=data
    },
    hasPlayer() {
      if(this.playlist.length>0) {
        this.$refs.searchResult.style.bottom= `60px`
      }else{
        this.$refs.searchResult.style.bottom = 0
      }
    },
  },
  computed: {
    ...mapState([
      'playlist',
      'searchHistory'
    ])
  },

}

</script>
<style scoped lang='stylus'>
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
          .search-item
            height 40px
            display flex
            align-content  center
            p
              flex 1
              line-height 40px
            i 
              width 20px
              line-height 40px
              font-size 14px            
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
