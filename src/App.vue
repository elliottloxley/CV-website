<template>
  <div v-if="displayPage" id="app" :class="page" :style="cssVars">
    <SvgFilters></SvgFilters>
    <particle-cloud v-if="true" ref="particleBG" style="position: fixed; width:100vw; height:100vh;"
                    class="particle-cloud"
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
                    :particle-use-fixed-positioning="true"
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
    <transition :name="currentTransition" appear>
      <keep-alive>
        <router-view :key="$route.fullPath" class="page-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>

import IconPathData from "@/AnimatedIcon/IconPathData";
import SvgFilters from "@/components/All Pages/SvgFilters";
import 'vue-md-icons/src/icons/settings'
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
      basePerspective: [50,50],
      currentPerspective: [50,50],
      currentTransition: '',
      perspectiveShiftX: 40,
      perspectiveShiftY: 40,
      displayPage: true,
    }
  },
  watch: {
    $route(to, from) {
      let differenceX = from.meta.pagePosition[0] - to.meta.pagePosition[0];
      let differenceY = from.meta.pagePosition[1] - to.meta.pagePosition[1];

      let shiftX = differenceX * this.perspectiveShiftX;
      let shiftY = differenceY * this.perspectiveShiftY;

      if(differenceX < 0) {
        this.currentTransition = 'slide-left';
      }
      else if(differenceX > 0) {
        this.currentTransition = 'slide-right';
      }

      this.page = to.name;
      this.currentPerspective = [this.currentPerspective[0] + shiftX, this.currentPerspective[1] + shiftY];
    }
  },
  methods: {
    menuClicked(val) {
      this.navbarOpen = !val;
    },
  },
  computed: {
    cloudPerspective() {
      return `${this.currentPerspective[0]}% ${this.currentPerspective[1]}%`
    },
    cssVars() {
      return {
        '--bg-color' : this.$root.currentTheme.background.base,
      }
    }
  },
  mounted() {
    this.page = this.$route.name;
  }
}
</script>

<style lang="scss">

html, body {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: "Open Sans", "sans-serif";
  font-weight: 300;
  overflow-x: hidden;
  background-color: var(--bg-color);
}

#app {
  height: auto;
  transition: background-color 0.8s;
  position: relative;
  z-index: 0;
  display: flex;
}

.particle-cloud {
  transition: perspective-origin 0.8s;
  background-color: var(--bg-color);
}

.page-view {
}

.nav-open {
  transform: translateX(0);
}

.slide-left-enter-active {
  animation: slide-in-left 1s;
}

.slide-left-leave-active {
  animation: slide-out-left 1s;
}

@keyframes slide-in-left {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out-left {
  from {
  }
  to {
    transform: translateX(-100%);
  }
}

.slide-right-enter-active {
  animation: slide-in-right 1s;
}

.slide-right-leave-active {
  animation: slide-out-right 1s;
}

@keyframes slide-in-right {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out-right {
  from {
  }
  to {
    transform: translateX(100%);
  }
}

</style>
