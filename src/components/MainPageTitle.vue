<template>
  <div class="title-container">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'MainPageTitle',
  props: {
    title: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title-container {
    font-size: 2rem;
  }
</style>
