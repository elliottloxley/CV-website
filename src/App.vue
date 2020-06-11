<template>
  <div id="app">
    <avatar-banner></avatar-banner>
    <page-banner title="Elliott Chisholm-Loxley" subtitle="my cv" description="description"/>
    <navbar-expanded></navbar-expanded>
  </div>
</template>

<script>

import PageBanner from "@/components/banner/PageBanner";
import NavbarExpanded from "@/components/navigation/NavbarExpanded";
import AvatarBanner from "@/components/banner/AvatarBanner";

export default {
  name: 'App',
  components: {
    NavbarExpanded,
    PageBanner,
    AvatarBanner
  }
}
</script>

<style lang="stylus" type="text/stylus">
  html, body {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
  }

#app {
  min-height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
}
</style>
