<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div>
                <p ref="lyricLine"
                   class="text"
                ></p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="favoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i class="icon-play-mini icon-pause" :class="playIcon" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlaylist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playlist"></play-list>
    <audio ref="audio" :src="currentSong.url" @ended="end"
           @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
  import scroll from '@/base/scroll/scroll'
  import PlayList from '@/base/play-list/play-list'
  import ProgressBar from '@/base/progress-bar/progress-bar'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {playMode} from '@/common/js/config'
  import {shuffle} from '@/common/js/util'

  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      ...mapActions([
        'saveFavoriteList', 'deleteFavoriteList', 'savePlayHistory'
      ]),
      showPlaylist() {
        this.$refs.playlist.show()
      },//播放列表控制
      back() {
        this.setFullScreen(false)
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
        //获取audio位置
      },
      end() {
        if (this.playlist.length === 1) {
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
        } else {
          this.next()
        }
      },
      format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      //播放时间格式清洗
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      //时间秒数补零
      open() {
        this.setFullScreen(true)
      },
      prev() {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      },
      togglePlaying() {
        this.setPlayingState(!this.playing)
      },
      next() {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      },
      onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlay()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      toggleFavorite(song) {
        if (this.isFavorite(song)) {
          this.deleteFavoriteList(song)
        } else {
          this.saveFavoriteList(song)
        }
      },
      isFavorite(song) {
        const index = this.favoriteList.findIndex((item) => {
          return item.id === song.id
        })
        return index > -1
      },
      favoriteIcon(song) {
        if (this.isFavorite(song)) {
          return 'icon-favorite'
        }
        return 'icon-not-favorite'
      },
      changeMode() {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          // 随机播放
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list) {
        let index = list.findIndex(item => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      }
    },
    computed: {
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      iconMode() {
        return this.mode === playMode.sequence
          ? 'icon-sequence'
          : this.mode === playMode.loop
            ? 'icon-loop'
            : 'icon-random'
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'mode',
        'currentIndex',
        'favoriteList',
        'sequenceList'
      ])
    },
    watch: {
      currentSong() {
        this.$nextTick(() => {
          this.$refs.audio.play(),
            this.savePlayHistory(this.currentSong)
        })
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      scroll,
      ProgressBar,
      PlayList
    }
  }

</script>
<style scoped lang='stylus'>
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        position relative
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
