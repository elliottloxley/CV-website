<template>
  <div id="app" :class="page" :style="{backgroundColor: $root.currentTheme.background.base}">
    <settings-panel class="setting-panel"></settings-panel>
    <transition mode="out-in" name="fade" appear>
      <router-view class="page-view"></router-view>
    </transition>
    <navbar class="navbar" :button-fill="$root.currentTheme.feature.highlight"
            :text-colour="$root.currentTheme.text.base"
            :background-colour="$root.currentTheme.background.base"></navbar>
    <SvgFilters></SvgFilters>
  </div>
</template>
<script>

import Navbar from "@/components/All Pages/Navbar";
import SvgFilters from "@/components/All Pages/SvgFilters";
import 'vue-md-icons/src/icons/settings'
import SettingsPanel from "@/components/All Pages/SettingsPanel";

export default {
  name: 'App',
  components: {
    SettingsPanel,
    SvgFilters,
    Navbar,
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

* { -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }

html, body {
  width 100%;
  height 100vh;
  margin 0;
  padding 0;
  font-family "Open Sans";
}

#app {
  height 100%;
  transition background-color 0.8s;
  position relative;
  z-index 0;
}

.settings-panel {
  z-index 3;
}

.page-view {
  z-index 1;
}

.navbar {
  z-index 2
}

.fade-enter-active {
  animation fade-in 0.8s;
}

.fade-leave-active {
  animation fade-out 0.8s;
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
