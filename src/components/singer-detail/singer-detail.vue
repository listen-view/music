<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import {ERR_OK} from '@/api/config'
import MusicList from "@/base/music-list/music-list"
import {getSingerDetail} from '@/api/singer'
import {mapGetters} from 'vuex'
import {createSong} from '@/common/js/song'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs:[]
    }
  },
  computed :{
    ...mapGetters(['singer']),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created() {
    this.getSingerDetail()
  },
  methods: {
    getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}

</script>
<style scoped lang='stylus'>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>