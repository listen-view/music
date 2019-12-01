<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@/base/music-list/music-list'
  import {mapState} from 'vuex'
  import {getRecomList} from '@/api/recommend'
  import {createSong} from '@/common/js/song'
  import {ERR_OK} from '@/api/config'

  export default {
    components: {
      MusicList
    },
    computed: {
      ...mapState([
        'disc'
      ]),
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      }
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getRecomList(this.disc.dissid).then((res) => {
          this.songs = this.Jscall(res)
        })
      },
      normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      Jscall(res) {
        // const Data = eval("("+res.slice(13,-1)+")")
        const Data = JSON.parse(res.slice(13, -1))
        return this.normalizeSongs(Data.cdlist[0].songlist)
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
