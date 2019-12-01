// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueLazyLoad from 'vue-lazyload'
import './common/stylus/index.styl'
Vue.prototype.axios = axios
Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  loading: 'static/qq.jpg',
  attempt: 1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: c => c(App)
})
