<template>
  <div id="app">
    <MainPageTitle title="Elliott Chisholm Loxley"/>
  </div>
</template>

<script>
import MainPageTitle from './components/MainPageTitle.vue'

export default {
  name: 'App',
  components: {
    MainPageTitle
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
