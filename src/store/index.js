import Vue from 'vue';
import Vuex from 'vuex';
import vuexAlong from 'vuex-along'

Vue.use(Vuex);

const state = {
  navList: []
}

export default new Vuex.Store({
  state,
  plugins: [vuexAlong]
})
