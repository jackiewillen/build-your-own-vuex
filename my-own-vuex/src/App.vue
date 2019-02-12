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
