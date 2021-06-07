<template>
  <div id="app" :class="page" :style="{backgroundColor: $root.currentTheme.background.base}">
    <particle-cloud ref="particleBG" style="position: fixed; width:100vw; height:100vh;"
                    :enable-random-spawning="true"
                    :enable-random-depth="true"
                    :enable-particle-drift-mode="true"
                    :keep-max-particles-exact="true"
                    :time-between-per-spawns="0.1"
                    :max-particles="30"
                    :particle-drift-max-magnitude="50"
                    :particle-drift-interval="1"
                    :particle-drift-timing="1"
                    :particle-height="10"
                    :particle-width="10"
                    :z-axis-max="10"
                    :z-axis-min="-50"
                    :perspective-origin="cloudPerspective"
                    :particle-enter-exit-timing="5"
                    :enable-spawn-in-bounding-box="true"
                    :particle-start-colour="'rgba(255,255,255,0.3)'"
                    :particle-end-colour="'rgba(255,255,255,0.3)'"
                    :enable-fade-out="true"
                    :enable-fade-in="true"
                    :spawn-speed="3"
                    :particle-life-time="10"
                    :lifetime-variance="0.1"></particle-cloud>
    <transition mode="out-in" name="fade" appear>
      <router-view class="page-view"></router-view>
    </transition>
    <SvgFilters></SvgFilters>
  </div>
</template>
<script>

import IconPathData from "@/AnimatedIcon/IconPathData";
import SvgFilters from "@/components/All Pages/SvgFilters";
import 'vue-md-icons/src/icons/settings'
import PageContents from "@/components/pages/PageContents";
import ParticleCloud from "@/components/All Pages/ParticleCloud";

export default {
  name: 'App',
  components: {
    ParticleCloud,
    SvgFilters,
  },
  data () {
    return {
      page: "home",
      settingsIcon: IconPathData.settingsToClose,
      settingsOpen: false,
      cloudPerspective: 'center',
    }
  },
  watch: {
    $route(to) {
      this.page = to.name;
    }
  },
  methods: {
    menuClicked(val) {
      this.navbarOpen = !val;
    },
  },
  computed: {
    pageContent() {
      if(PageContents[this.page]) {
        return PageContents[this.page];
      }
      else {
        return [];
      }
    }
  },
  mounted() {
    this.page = this.$route.name;
  }
}
</script>

<style lang="stylus" type="text/stylus">

@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
@import "themes/variables.styl";

* { -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }

html, body {
  width 100%;
  height 100%;
  margin 0;
  padding 0;
  font-family "Open Sans", "sans-serif";
  overflow-x: hidden;
}

#app {
  height 100%;
  transition background-color 0.8s;
  position relative;
  z-index 0;
}

.settings-panel {
  position fixed;
  width 6rem; 
  height 6rem;
  top 0;
  right 0;
  z-index 3;
}

.page-view {
  z-index 1;
}

.fade-enter-active {
  animation fade-in 0.8s;
}

.fade-leave-active {
  animation fade-out 0.8s;
}

.nav-open {
  transform translateX(0);
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
