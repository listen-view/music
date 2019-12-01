<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="true"
          @scrolltoEnd="searchmore"
  >
    <ul class="suggest-list">
      <li  class="suggest-item" v-for="(item,index) in result" @click="selectItem(index)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-if='hasMore'></loading>
    </ul>
  </scroll>
</template>

<script>
import scroll from '@/base/scroll/scroll'
import loading from '@/base/loading/loading'
import {search} from '@/api/search'
import {mapMutations} from 'vuex'
import {createSong} from '@/common/js/song'
import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'
export default {
  props: {
    query:{
      type: String,
      default: ''
    }
  },
  watch: {
    query() {
      this.search()
    }
  },
  data() {
    return {
      page: 1,
      NUM: 20,
      showSinger: true,
      result: '',
      hasMore:false
    }
  },
  methods: {
    ...mapMutations({
      setSinger:'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ]),
    selectItem(data) {
      if(this.result[data].singername) {
        this.$router.push({
          path:`seacher/${this.result[data].singerid}`
        })
        const singer={
          id:this.result[data].singermid,
          name:this.result[data].singername,
          avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.result[data].singermid}.jpg?max_age=2592000`
        }
        this.setSinger(singer)
      }else {
        this.insertSong(this.result[data])
      }
      this.$emit('select')
    },
    search() {
      this.showSinger=true
      this.axios.get('/api/getSearch',
      {
        params:{
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'h5',
          needNewCode: 1,
          w: this.query,
          zhidaqu: 1,
          catZhida: 1,
          t: 0,
          flag: 1,
          ie: 'utf-8',
          sem: 1,
          aggr: 0,
          perpage: this.NUM,
          n: 20,
          p: 1,
          remoteplace: 'txt.mqq.all',
          _: 1547910140475
        }
      }).then((res)=>{
        this.result=this._genResult(res.data.data);
        this.page++
      })
    },
    searchmore() {
      this.hasMore = true
      this.showSinger=false
      this.page++
      this.axios.get('/api/getSearch',
      {
        params:{
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'h5',
          needNewCode: 1,
          w: this.query,
          zhidaqu: 1,
          catZhida: 1,
          t: 0,
          flag: 1,
          ie: 'utf-8',
          sem: 1,
          aggr: 0,
          perpage: this.NUM,
          n: 20,
          p: this.page,
          remoteplace: 'txt.mqq.all',
          _: 1547910140475
        }
      }).then((res)=>{
        this.result=this.result.concat(this._genResult(res.data.data));
        this._checkMore(res.data.data)
      })
    },
    _checkMore(data) {
      const song = data.song
      if(!song.list.length || (song.curnum + song.curpage * 20) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = []
    if (this.showSinger&&data.zhida.type!==0) {
        ret.push({...data.zhida, ...{type: 'singer'}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    getIconCls(item) {
      if (item.type === 'singer') {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    //搜索结果图标排列
    getDisplayName(item) {
      if (item.type === "singer") {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    //搜索结果详情排序
  },
  computed: {
    ...mapGetters(["playlist"])
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

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>