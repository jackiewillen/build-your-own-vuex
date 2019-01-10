<template>
  <div id="app">
    干净项目
  </div>
</template>

<script>

export default {
  name: 'app',
  created() {
    console.log('打印出this.$store.state.count的结果',this.$store.state.count);
  },
}
</script>
