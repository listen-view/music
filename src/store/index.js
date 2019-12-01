import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import state from './state'
import mutations from './mutation'
Vue.use(Vuex)
export default new Vuex.Store({
  getters,
  state,
  mutations,
  actions
})
