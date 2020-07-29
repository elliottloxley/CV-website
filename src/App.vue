<template>
  <div id="app" :class="page">
    <page-top-navbar></page-top-navbar>
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
    <home-navbar></home-navbar>
  </div>
</template>
<script>

import PageTopNavbar from "@/components/All Pages/PageTopNavbar";
import HomeNavbar from "@/components/pages/Home/HomeNavbar";

export default {
  name: 'App',
  components: {
    HomeNavbar,
    PageTopNavbar
  },
  data () {
    return {
      page: "home"
    }
  },
  watch: {
    $route(to) {
      this.page = to.name;
    }
  },
  mounted() {
    this.page = this.$route.name;
  }
}
</script>

<style lang="stylus" type="text/stylus">

@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap');
@import "themes/variables.styl";

html, body {
  width 100%;
  height 100vh;
  margin 0;
  padding 0;
  font-family "Open Sans";
}

.home {
  background-color homePageBaseColour;
}

.websites {
  background-color websitesPageBaseColour;
  overflow-y scroll;
}

.about {
  background-color aboutPageBaseColour;
}

.software {
  background-color softwarePageBaseColour;
}

.contact {
  background-color contactPageBaseColour;
}

#app {
  height 100%;
  transition background-color 0.8s;
  position relative;
  z-index 1;
}

.fade-enter-active {
  animation fade-in 0.8s;
}

.fade-leave-active {
  animation fade-out 0.3s;
}

@keyframes fade-in {
  from {
    opacity 0;
  }
  to {
    opacity 1;
  }
}

@keyframes fade-out {
  from {

  }
  to {
    opacity 0;

  }
}
</style>
