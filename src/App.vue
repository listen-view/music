<template>
  <div id="app">
    <mhead></mhead>
    <tabbar></tabbar>
    <button @click="test" class="box">test</button>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import player from '@/components/player/player'
  import mhead from 'components/mt-header/head'
  import tabbar from 'components/tabbar/tabbar'
  import {comm, url_mid} from '@/api/config'

  export default {
    name: 'App',
    components: {
      mhead,
      tabbar,
      player
    },
    methods: {
      test() {
        this.axios.post('api/songurl', {
          comm, url_mid
        }).then((res) => {
          console.log(res.data)
        })
      }
    }
  }
</script>

<style scope>
  .box {
    z-index: 999;
    position: relative;
    top: 20px
  }
</style>
