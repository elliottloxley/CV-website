<template>
  <div id="app">
    <MainPageTitle title="Elliott Chisholm Loxley"/>
    <MainPageSubtitle subtitle="my cv"/>
    <CVBriefDescription description="a short description"/>
  </div>
</template>

<script>
import MainPageTitle from './components/MainPageTitle.vue'
import CVBriefDescription from "@/components/CVBriefDescription";
import MainPageSubtitle from "@/components/MainPageSubtitle";

export default {
  name: 'App',
  components: {
    MainPageTitle,
    CVBriefDescription,
    MainPageSubtitle
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
