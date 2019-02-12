import Vue from 'vue'
import App from './App.vue'
// import Vuex from './myVuex/index'
import Vuex from 'vuex'

Vue.use(Vuex);

const pageA = {
    state: {
        count: 100
    },
    mutations: {
        incrementA(state) {
            state.count++;
        }
    },
    actions: {
        incrementAAction(context) {
            context.commit('incrementA');
        }
    }
}

let store = new Vuex.Store({
    modules: {
        a: pageA
    },
    state: {
        count: 0
    },
    actions: {
        countPlusSix(context) {
            context.commit('plusSix');
        }
    },
    mutations: {
        incrementFive(state) {
            // console.log('初始state', JSON.stringify(state));
            state.count = state.count + 5;
        },
        plusSix(state) {
            state.count = state.count + 6;
        }
    },
    getters: {
        getStatePlusOne(state) {
            return state.count + 1
        }
    }

});

new Vue({
    store,
    render: h => h(App),
}).$mount('#app')



Vue.config.productionTip = false;