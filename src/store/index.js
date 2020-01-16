import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentQuery: {
      keyword: '',
      region: [],
      org: ''
    }
  },
  mutations: {
    setQueryModel(state, model) {
      state.currentQuery = model
    }
  },
  getters
})
