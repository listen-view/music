<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import {ERR_OK} from '@/api/config'
import MusicList from "@/base/music-list/music-list"
import {getSongDetail} from '@/api/song'
import {createSong} from '@/common/js/song'

export default {
  computed :{
    title() {
      return this.songDetail.topTitle
    },
    bgImage() {
      return this.songDetail.picUrl
    }
  },
  created() {
    this.getSongDetail()
  },
  methods: {
    getSongDetail() {
      if (!this.songDetail.id) {
        this.$router.push('/ranking')
        return
      }
      getSongDetail(this.songDetail.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }      
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  data() {
    return {
      songs:[]
    }
  },
  props: [
    'songDetail'
  ],
  components: {
    MusicList
  }
}

</script>
<style scoped lang='stylus'>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>