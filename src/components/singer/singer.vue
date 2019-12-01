<template>
  <div class='singer' ref="singer">
    <singerList :data="singers" @selectItem="selectItem"></singerList>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from '@/api/singer'
import {ERR_OK} from '@/api/config'
import {mapState} from 'vuex'
import {mapMutations} from 'vuex'
import Singer from '@/common/js/singer'
import singerList from '@/base/singer-list/singerList'
export default {
  data() {
    return {
      singers: [],
      singerDetail:''
    }
  },
  components: {
    singerList
  },
  created() {
    this._getSingerList()
  },
  methods: {
    ...mapMutations({
      setSinger:'SET_SINGER'
    }),
    _getSingerList() {
      getSingerList().then((res) => {
        if(res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    selectItem(data) {
      this.singerDetail = data
      this.$router.push({
        path:`/singer/${data.id}`
      })
      this.setSinger(data)
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: '热门',
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < 10) {
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      // 为了得到有序列表，我们需要处理 map
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === '热门') {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    hasPlayer() {
      if(this.playlist.length>0) {
        this.$refs.singer.style.bottom= `60px`
      }else{
        this.$refs.singer.style.bottom = 0
      }
    }
  },
  watch: {
    playlist() {
      this.hasPlayer()
    }
  },
  mounted() {
    this.hasPlayer()
  },
  computed: {
    ...mapState([
      'playlist'
    ])
  },
}

</script>
<style scoped lang='stylus'>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
