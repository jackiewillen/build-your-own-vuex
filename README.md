<h2>项目运行方法： 进入到my-own-vuex目录下，运行npm install 再运行npm run serve就可以了</h2>
<h1>用150行代码实现Vuex 80%的功能</h1>

<h3>作者： 殷荣桧@腾讯</h3>

本文[github仓库代码地址](https://github.com/jackiewillen?tab=repositories)，欢迎star，谢谢。

如果你对自己用少量代码实现各个框架感兴趣，那下面这些你都可以一看：

[build-your-own-react](https://github.com/jackiewillen/build-your-own-react)

[build-your-own-flux](https://github.com/jackiewillen/build-your-own-flux)

[build-your-own-redux](https://github.com/jackiewillen/build-your-own-redux)

<h3>目录：</h3>

> 一.完成最简单的通过vuex定义全局变量，在任何一个页面可以通过this.$store.state.count可以直接使用
> 
> 二.vuex中的getter方法的实现
> 
> 三.mutation和commit方法的实现
> 
> 四.actions和dispatch方法的实现
> 
> 五.module方法的实现
> 
> 六.实现：Vue.use(Vuex)

先来看一下用自己实现的的vuex替代真实的vuex的效果，看看能否正常运行，有没有报错：
<center><img src="https://raw.githubusercontent.com/jackiewillen/blog/master/images/vuex1.png" width="450" style="border: 1px solid #000;"></center>

从运行结果来看，运行正常，没有问题。接下来看看一步一步实现的过程:

<h4>一. 完成最简单的通过vuex定义全局变量，在任何一个页面可以通过this.$store.state.count可以直接使用</h4>

main.js代码如下：

	let store = new Vuex.Store({
	  state: {
	    count: 0
	  }
	}, Vue);
	
	new Vue({
	  store,
	  render: h => h(App),
	}).$mount('#app')

store.js的代码如下：

	export class Store {
	    constructor(options = {}, Vue) {
	        this.options = options;
	        Vue.mixin({ beforeCreate: vuexInit });
	    }
	    get state () {
	        return this.options.state;
	    }
	}
	function vuexInit () {
	    const options = this.$options
	    if (options.store) {
	        // 组件内部设定了store,则优先使用组件内部的store
	        this.$store = typeof options.store === 'function'
	        ? options.store()
	        : options.store
	    } else if (options.parent && options.parent.$store) {
	        // 组件内部没有设定store,则从根App.vue下继承$store方法
	        this.$store = options.parent.$store
	    }
	}

界面代码如下：

	<script>
	export default {
	  name: 'app',
	  created() {
	    console.log('打印出this.$store.state.count的结果',this.$store.state.count);
	  },
	}
	</script>
	
运行结果: 成功打印出this.$store.state.count的值为0

<h4>二. vuex中的getter方法的实现</h4>
main.js代码如下：

	let store = new Vuex.Store({
	    state: {
	        count: 0
	    },
	    getters: {
	        getStatePlusOne(state) {
	            return state.count + 1
	        }
	    }
	
	}, Vue);
	
	new Vue({
	    store,
	    render: h => h(App),
	}).$mount('#app')

store.js的代码如下：

	export class Store {
	    constructor(options = {}, Vue) {
	        this.options = options;
	        this.getters = {}
	        Vue.mixin({ beforeCreate: vuexInit });
	        forEachValue(options.getters, (getterFn, getterName) => {
	            registerGetter(this, getterName, getterFn);
	        })
	    }
	    get state() {
	        return this.options.state;
	    }
	}
	
	function registerGetter(store, getterName, getterFn) {
	    Object.defineProperty(store.getters, getterName, {
	        get: () => {
	            return getterFn(store.state)
	        }
	    })
	}
	
	// 将对象中的每一个值放入到传入的函数中作为参数执行
	function forEachValue(obj, fn) {
	    Object.keys(obj).forEach(key => fn(obj[key], key));
	}
	
	function vuexInit() {
	    const options = this.$options
	    if (options.store) {
	        // 组件内部设定了store,则优先使用组件内部的store
	        this.$store = typeof options.store === 'function' ?
	            options.store() :
	            options.store
	    } else if (options.parent && options.parent.$store) {
	        // 组件内部没有设定store,则从根App.vue下继承$store方法
	        this.$store = options.parent.$store
	    }
	}

界面代码如下：

	<script>
	export default {
	  name: 'app',
	  created() {
	    console.log('打印出this.$store.getters.getStatePlusOne的结果',this.$store.getters.getStatePlusOne);
	  },
	}
	</script>

运行结果：
成功打印出this.$store.getters.getStatePlusOne的值为1

<h4>三. mutation和commit方法的实现</h4>
main.js代码如下：

	let store = new Vuex.Store({
	    state: {
	        count: 0
	    },
	    mutations: {
	        incrementFive(state) {
	            // console.log('初始state', JSON.stringify(state));
	            state.count = state.count + 5;
	        }
	    },
	    getters: {
	        getStatePlusOne(state) {
	            return state.count + 1
	        }
	    }
	
	}, Vue);
	
store.js的代码如下：

	export class Store {
	    constructor(options = {}, Vue) {
	        Vue.mixin({ beforeCreate: vuexInit })
	        this.options = options;
	        this.getters = {};
	        this.mutations = {};
	        const { commit } = this;
	        this.commit = (type) => {
	            return commit.call(this, type);
	        }
	        forEachValue(options.getters, (getterFn, getterName) => {
	            registerGetter(this, getterName, getterFn);
	        });
	
	        forEachValue(options.mutations, (mutationFn, mutationName) => {
	            registerMutation(this, mutationName, mutationFn)
	        });
	
	        this._vm = new Vue({
	            data: {
	                state: options.state
	            }
	        });
	    }
	
	    get state() {
	        // return this.options.state; // 无法完成页面中的双向绑定，所以改用this._vm的形式
	        return this._vm._data.state;
	    }
	    commit(type) {
	        this.mutations[type]();
	    }
	}
	
	function registerMutation(store, mutationName, mutationFn) {
	    store.mutations[mutationName] = () => {
	        mutationFn.call(store, store.state);
	    }
	}
	
	
	function registerGetter(store, getterName, getterFn) {
	    Object.defineProperty(store.getters, getterName, {
	        get: () => {
	            return getterFn(store.state)
	        }
	    })
	}
	
	// 将对象中的每一个值放入到传入的函数中作为参数执行
	function forEachValue(obj, fn) {
	    Object.keys(obj).forEach(key => fn(obj[key], key));
	}
	
	function vuexInit() {
	    const options = this.$options
	    if (options.store) {
	        // 组件内部设定了store,则优先使用组件内部的store
	        this.$store = typeof options.store === 'function' ?
	            options.store() :
	            options.store
	    } else if (options.parent && options.parent.$store) {
	        // 组件内部没有设定store,则从根App.vue下继承$store方法
	        this.$store = options.parent.$store
	    }
	}
	
界面代码如下：

	<script>
	export default {
	  name: 'app',
	  created() {
	    console.log('打印出this.$store.getters.getStatePlusOne的结果',this.$store.getters.getStatePlusOne);
	  },
	  mounted() {
	    setTimeout(() => {
	      this.$store.commit('incrementFive');
	      console.log('store state自增5后的结果', this.$store.state.count);
	    }, 2000);
	  },
	  computed: {
	    count() {
	      return this.$store.state.count;
	    }
	  }
	}
	</script>

运行结果：成功在2秒之后输出count自增5后的结果5

<h4>四. actions和dispatch方法的实现</h4>
main.js代码如下：

	let store = new Vuex.Store({
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
	
	}, Vue);
	
store.js的代码如下：

	export class Store {
	    constructor(options = {}, Vue) {
	        Vue.mixin({ beforeCreate: vuexInit })
	        this.options = options;
	        this.getters = {};
	        this.mutations = {};
	        this.actions = {};
	        const { dispatch, commit } = this;
	        this.commit = (type) => {
	            return commit.call(this, type);
	        }
	        this.dispatch = (type) => {
	            return dispatch.call(this, type);
	        }
	        forEachValue(options.actions, (actionFn, actionName) => {
	            registerAction(this, actionName, actionFn);
	        });
	
	        forEachValue(options.getters, (getterFn, getterName) => {
	            registerGetter(this, getterName, getterFn);
	        });
	
	        forEachValue(options.mutations, (mutationFn, mutationName) => {
	            registerMutation(this, mutationName, mutationFn)
	        });
	
	        this._vm = new Vue({
	            data: {
	                state: options.state
	            }
	        });
	    }
	
	    get state() {
	        // return this.options.state; // 无法完成页面中的双向绑定，所以改用this._vm的形式
	        return this._vm._data.state;
	    }
	    commit(type) {
	        this.mutations[type]();
	    }
	    dispatch(type) {
	        return this.actions[type]();
	    }
	}
	
	function registerMutation(store, mutationName, mutationFn) {
	    store.mutations[mutationName] = () => {
	        mutationFn.call(store, store.state);
	    }
	}
	
	function registerAction(store, actionName, actionFn) {
	    store.actions[actionName] = () => {
	        actionFn.call(store, store)
	    }
	}
	
	function registerGetter(store, getterName, getterFn) {
	    Object.defineProperty(store.getters, getterName, {
	        get: () => {
	            return getterFn(store.state)
	        }
	    })
	}
	
	// 将对象中的每一个值放入到传入的函数中作为参数执行
	function forEachValue(obj, fn) {
	    Object.keys(obj).forEach(key => fn(obj[key], key));
	}
	
	function vuexInit() {
	    const options = this.$options
	    if (options.store) {
	        // 组件内部设定了store,则优先使用组件内部的store
	        this.$store = typeof options.store === 'function' ?
	            options.store() :
	            options.store
	    } else if (options.parent && options.parent.$store) {
	        // 组件内部没有设定store,则从根App.vue下继承$store方法
	        this.$store = options.parent.$store
	    }
	}
	
界面代码如下：

	export default {
	  name: 'app',
	  created() {
	    console.log('打印出this.$store.getters.getStatePlusOne的结果',this.$store.getters.getStatePlusOne);
	  },
	  mounted() {
	    setTimeout(() => {
	      this.$store.commit('incrementFive');
	      console.log('store state自增5后的结果', this.$store.state.count);
	    }, 2000);
	    setTimeout(() => {
	      this.$store.dispatch('countPlusSix');
	      console.log('store dispatch自增6后的结果', this.$store.state.count);
	    }, 3000);
	  },
	  computed: {
	    count() {
	      return this.$store.state.count;
	    }
	  }
	}
运行结果： 成功在3秒之后dipatch自增6输出11

<h4>五. module方法的实现</h4>
main.js代码如下：

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
	
	}, Vue);
	
store.js的代码如下：

	let _Vue;
	export class Store {
	    constructor(options = {}, Vue) {
	        _Vue = Vue
	        Vue.mixin({ beforeCreate: vuexInit })
	        this.getters = {};
	        this._mutations = {}; // 在私有属性前加_
	        this._wrappedGetters = {};
	        this._actions = {};
	        this._modules = new ModuleCollection(options)
	        const { dispatch, commit } = this;
	        this.commit = (type) => {
	            return commit.call(this, type);
	        }
	        this.dispatch = (type) => {
	            return dispatch.call(this, type);
	        }
	        const state = options.state;
	        const path = []; // 初始路径给根路径为空
	        installModule(this, state, path, this._modules.root);
	        this._vm = new Vue({
	            data: {
	                state: state
	            }
	        });
	    }
	
	    get state() {
	        // return this.options.state; // 无法完成页面中的双向绑定，所以改用this._vm的形式
	        return this._vm._data.state;
	    }
	    commit(type) {
	        this._mutations[type].forEach(handler => handler());
	    }
	    dispatch(type) {
	        return this._actions[type][0]();
	    }
	}
	
	class ModuleCollection {
	    constructor(rawRootModule) {
	        this.register([], rawRootModule)
	    }
	    register(path, rawModule) {
	        const newModule = {
	            _children: {},
	            _rawModule: rawModule,
	            state: rawModule.state
	        }
	        if (path.length === 0) {
	            this.root = newModule;
	        } else {
	            const parent = path.slice(0, -1).reduce((module, key) => {
	                return module._children(key);
	            }, this.root);
	            parent._children[path[path.length - 1]] = newModule;
	        }
	        if (rawModule.modules) {
	            forEachValue(rawModule.modules, (rawChildModule, key) => {
	                this.register(path.concat(key), rawChildModule);
	            })
	        }
	    }
	}
	
	function installModule(store, rootState, path, module) {
	    if (path.length > 0) {
	        const parentState = rootState;
	        const moduleName = path[path.length - 1];
	        _Vue.set(parentState, moduleName, module.state)
	    }
	    const context = {
	        dispatch: store.dispatch,
	        commit: store.commit,
	    }
	    const local = Object.defineProperties(context, {
	        getters: {
	            get: () => store.getters
	        },
	        state: {
	            get: () => {
	                let state = store.state;
	                return path.length ? path.reduce((state, key) => state[key], state) : state
	            }
	        }
	    })
	    if (module._rawModule.actions) {
	        forEachValue(module._rawModule.actions, (actionFn, actionName) => {
	            registerAction(store, actionName, actionFn, local);
	        });
	    }
	    if (module._rawModule.getters) {
	        forEachValue(module._rawModule.getters, (getterFn, getterName) => {
	            registerGetter(store, getterName, getterFn, local);
	        });
	    }
	    if (module._rawModule.mutations) {
	        forEachValue(module._rawModule.mutations, (mutationFn, mutationName) => {
	            registerMutation(store, mutationName, mutationFn, local)
	        });
	    }
	    forEachValue(module._children, (child, key) => {
	        installModule(store, rootState, path.concat(key), child)
	    })
	
	}
	
	function registerMutation(store, mutationName, mutationFn, local) {
	    const entry = store._mutations[mutationName] || (store._mutations[mutationName] = []);
	    entry.push(() => {
	        mutationFn.call(store, local.state);
	    });
	}
	
	function registerAction(store, actionName, actionFn, local) {
	    const entry = store._actions[actionName] || (store._actions[actionName] = [])
	    entry.push(() => {
	        return actionFn.call(store, {
	            commit: local.commit,
	            state: local.state,
	        })
	    });
	}
	
	function registerGetter(store, getterName, getterFn, local) {
	    Object.defineProperty(store.getters, getterName, {
	        get: () => {
	            return getterFn(
	                local.state,
	                local.getters,
	                store.state
	            )
	        }
	    })
	}
	
	// 将对象中的每一个值放入到传入的函数中作为参数执行
	function forEachValue(obj, fn) {
	    Object.keys(obj).forEach(key => fn(obj[key], key));
	}
	
	function vuexInit() {
	    const options = this.$options
	    if (options.store) {
	        // 组件内部设定了store,则优先使用组件内部的store
	        this.$store = typeof options.store === 'function' ?
	            options.store() :
	            options.store
	    } else if (options.parent && options.parent.$store) {
	        // 组件内部没有设定store,则从根App.vue下继承$store方法
	        this.$store = options.parent.$store
	    }
	}

主界面代码如下：

	<template>
	  <div id="app">
	    ==============主页================<br>
	    主页数量count为: {{count}}<br>
	    pageA数量count为: {{countA}}<br>
	    ==========以下为PageA内容==========<br>
	    <page-a></page-a>
	  </div>
	</template>
	
	<script>
	import pageA from './pageA';
	
	export default {
	  name: 'app',
	  components: {
	    pageA
	  },
	  created() {
	    console.log('打印出this.$store.getters.getStatePlusOne的结果',this.$store.getters.getStatePlusOne);
	  },
	  mounted() {
	    setTimeout(() => {
	      this.$store.commit('incrementFive');
	      console.log('store state自增5后的结果', this.$store.state.count);
	    }, 2000);
	    setTimeout(() => {
	      this.$store.dispatch('countPlusSix');
	      console.log('store dispatch自增6后的结果', this.$store.state.count);
	    }, 3000);
	  },
	  computed: {
	    count() {
	      return this.$store.state.count;
	    },
	    countA() {
	      return this.$store.state.a.count;
	    }
	  }
	}
	</script>

pageA页面如下：

	<template>
	    <div>
	        页面A被加载
	    </div>
	</template>
	
	<script>
	export default {
	  name: 'pageA',
	  mounted() {
	      setTimeout(() => {
	          this.$store.dispatch('incrementAAction');
	      }, 5000)
	  },
	}
	</script>

运行结果： 在5秒后A页面触发incrementAAction，主界面中的countA变化为101，成功

<span style="color: red">自此：基本用了150行左右的代码实现了vuex 80%左右的功能了，其中还有namespace等不能够使用，其他基本都和源代码语法相同，如果你有兴趣仔细再看看，可以移步[github仓库代码](https://github.com/jackiewillen?tab=repositories)，代码是建立在阅读了vuex源代码之后写的，所以看完了本文的代码，再去看vuex的代码，相信你一定会一目了然</span>

<h4>六. 实现：Vue.use(Vuex)</h4>
最后为了和vuex源代码做到最相似，同样使用Vue.use(Vuex),使用如下的代码进行实现：

	export function install(_Vue) {
	    Vue = _Vue;
	    Vue.mixin({
	        beforeCreate: function vuexInit() {
	            const options = this.$options;
	            if (options.store) {
	                this.$store = options.store;
	            } else if (options.parent && options.parent.$store) {
	                this.$store = options.parent.$store;
	            }
	        }
	    })
	}
	
参考资料：
>
>[Build a Vuex Module ](https://serversideup.net/build-vuex-module/)
>
>[How does a minimal Vuex implementation look like?](https://medium.com/@sadickjunior/how-does-a-minimal-vuex-implementation-looks-like-find-out-c2c2e13619cb)
>
>[从0开始写一个自己的Vuex](https://segmentfault.com/a/1190000010888395)
>
>[vuex 源码：如何实现一个简单的 vuex](https://juejin.im/post/5a7a935851882524713dcd05)
>
>[Vue 源码（三） —— Vuex](https://zhuanlan.zhihu.com/p/48516116)
>
>[浅谈Vue.use](https://segmentfault.com/a/1190000012296163)
>
>[Vuex官方文档](https://vuex.vuejs.org/zh/guide/)
>
>[vuex Github仓库](https://github.com/vuejs/vuex)

