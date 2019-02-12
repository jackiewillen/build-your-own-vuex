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
