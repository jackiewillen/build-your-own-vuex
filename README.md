TODO

1.使用vue脚手架创建一个简单的vue项目 done
2.完成最简单的通过vuex定义全局变量，在任何一个页面可以通过this.$store引用，如下所示：
const store = new Vuex.Store({
  state: {
    count: 0
  },
});
通过this.$store.state.count可以直接使用
3.多个state需要获取时的mapState辅助函数的编写
4.vuex中的getter方法的实现
5.getter方法的mapGetters的函数的实现
6.mutation和commit方法的实现
7.actions和dispatch方法的实现
8.mapActions方法的实现
9.module方法的实现
10.完成install，可以通过Vue.use(Vuex)来使用自己实现的vuex，从而完成高仿真模拟