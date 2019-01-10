import Vue from 'vue'
import App from './App.vue'
import Vuex from './myVuex/index'


let store = new Vuex.Store({
  state: {
    count: 0
  }
}, Vue);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')



Vue.config.productionTip = false;
