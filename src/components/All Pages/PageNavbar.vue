<template>
  <div class="navbar">
    <div class="menu-wrapper">
      <blob-panel-button @panelClicked="menuOpenClick" @clickedOutside="outsideClickIncrement"
                         v-on="!isNavigationOpen ? {outsideClick: outsideClickIncrement} : null"
                         :is-panel-active="isNavigationOpen"
                         :morphing-icon-data="menuIcon"
                         :position="'top left'"
                         :blob-fill="buttonFill"
                         :style="{pointerEvents : isNavigationOpen ? 'none' : 'all'}"
                         :text-colour="textColour"
                         :icon-hover-transition="'scale(1.1)'"
                         :icon-active-hover-transition="'scale(1.1)'"
                         :icon-active-transition="''"
                         :expand-size="0.8"
                         class="menu-open" :name="'open'"></blob-panel-button>
      <blob-button @buttonClicked="navClick" v-for="(button, name) in navButtons"
                   @clickedOutside="outsideClickIncrement"
                   :check-outside-click="true"
                   :name="name"
                   :key="name"
                   :style="getNavButtonStyle(button)"
                   :content-style="{color: textColour, transform: 'rotate(' + -button.rotation + 'deg)'}"
                   :font-size="0.8"
                   :blob-style-user="{fill: buttonFill}"
                   :nav-text="button.text"
                   class="nav-button"
                   :class="{'active-nav' : isOnRoute(name)}">
        <router-link :to="button.link" style="opacity: 0;"></router-link>
        <icon :name="button.icon" class="button-icon"></icon>
        <transition name="spin">
          <div v-show="isOnRoute(name) && navOpenFinished" class="active-select"></div>
        </transition>
      </blob-button>
      <div class="expand-blob"></div>
    </div>
  </div>
</template>

<script>

import BlobButton from '@/components/old work/BlobButton'
import Icon from 'vue-md-icons/src/components/Icon'
import 'vue-md-icons/src/icons/home'
import 'vue-md-icons/src/icons/menu'
import 'vue-md-icons/src/icons/work'
import 'vue-md-icons/src/icons/person'
import 'vue-md-icons/src/icons/call'
import 'vue-md-icons/src/icons/clear'
import IconPathData from '@/AnimatedIcon/IconPathData'
import BlobPanelButton from '@/components/old work/BlobPanelButton'

export default {
  name: 'PageNavbar',
  components: {
    BlobPanelButton,
    BlobButton,
    Icon
  },
  data () {
    return {
      navOpenFinished: false,
      transitionFill: '',
      isMounted: false,
      outsideClickCount: 0,
      checkingClicks: false,
      menuIcon: IconPathData.menuToClose
    }
  },
  props: {
    buttonFill: { default: 'red', type: String },
    backgroundColour: { default: 'white', type: String },
    textColour: { default: 'white', type: String },
    buttonYOffset: { default: 0, type: Number },
    buttonXOffset: { default: 0, type: Number },
    navIconPos: { default () { return [13, 13] }, type: Array },
    expandDelay: { default: 0, type: Number },
    isNavigationOpen: { default: false, type: Boolean }
  },
  computed: {
    navButtons () {
      const translateMag = 90
      const pathNames = []
      const paths = []
      this.$router.options.routes.forEach(route => {
        pathNames.push(route.name)
        paths.push(route.path)
      })

      return {
        [pathNames[0]]: { text: 'home', link: paths[0], icon: 'home', rotation: 0, magnitude: translateMag, transitionTime: [0, 0.06] },
        [pathNames[1]]: { text: 'work', link: paths[1], icon: 'work', rotation: 0, magnitude: translateMag + 80, transitionTime: [0.05, 0.04] },
        [pathNames[2]]: { text: 'bio', link: paths[2], icon: 'person', rotation: 0, magnitude: translateMag + 160, transitionTime: [0.1, 0.02] },
        [pathNames[3]]: { text: 'contact', link: paths[3], icon: 'call', rotation: 0, magnitude: translateMag + 240, transitionTime: [0.15, 0] }
      }
    }
  },
  methods: {
    getNavButtonStyle (currentButton) {
      return {
        transform: `rotate(${currentButton.rotation}deg)
              translate(${this.isNavigationOpen ? currentButton.magnitude + this.buttonXOffset : 0}%, ${this.buttonYOffset}%)
              scale(${this.isNavigationOpen ? 1 : 0.8})`,
        transitionDelay: `${(this.isNavigationOpen
                  ? currentButton.transitionTime[0] : currentButton.transitionTime[1]) + (this.expandDelay / 1000)}s`
      }
    },
    menuOpenClick () {
      this.$emit('menuClicked', this.isNavigationOpen)
    },
    navClick (name) {
      this.$router.push(this.navButtons[name].link)
    },
    isOnRoute (routeCheck) {
      return this.$route.name.includes(routeCheck)
    },
    outsideClickIncrement (event) {
      if (!this.checkingClicks) {
        this.checkingClicks = true
        setTimeout(() => { this.checkingClicks = false; this.outsideClickCount = 0 }, 50)
      }

      this.outsideClickCount += 1
      if (this.outsideClickCount >= Object.keys(this.navButtons).length + 1) {
        this.$emit('clickedOutside', event)
        this.checkingClicks = false
        this.outsideClickCount = 0
      }
    }
  },
  mounted () {
    this.isMounted = true
  },
  watch: {
    isNavigationOpen (from) {
      setTimeout(() => { this.navOpenFinished = from }, 300)
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../themes/variables.styl"

.navbar {
  position relative;
  display: flex;
  justify-content center;
  color miscTextColour;
}

.menu-wrapper, .expand-wrapper {
  position absolute;
  left 50%;
  transform translateX(-50%);
  width 100%;
  height 100%;
}

.menu-wrapper {
  z-index 100;
  filter url("#connectElements");
}

.expand-blob {
  position absolute;
  width 200vmax;
  height 200vmax;
  top 50%;
  left 50%;
  opacity 0;
  animation-fill-mode forwards;
}

.expand-enter-active {
  opacity 1;
  animation expand 1.5s ease-out 0s;
}

.blob-wrapper {
  position absolute;
  width 80%;
  height 80%;
}

.active-nav {
  pointer-events none;
  z-index -10;
}

.active-select {
  width 100%;
  height 100%;
  background-color white;
  position absolute;
  transform translateY(-30%) rotate(135deg) scale(0.15);
}

.button-icon {
  position relative;
  width 100%;
  height 100%;
  z-index 1;
}

.menu-open {
  transition all 0.3s;
  transform scale(1);
  z-index 101;
}

.menu-open, .nav-button {
  position absolute;
  top 0;
  height 100%;
  width 100%;
}

.nav-button {
  width 75%;
  height 75%;
  transition all 0.3s;
}

.spin-enter-active {
  animation icon-pop-in 0.3s;
}

.spin-leave-active {
  animation icon-pop-out 0.5s;
}

@keyframes icon-pop-in {
  from {
    transform translateY(-30%) rotate(-45deg) scale(0.001);
  }

  60% {
    transform translateY(-30%) rotate(0deg) scale(0.2);
  }

  to {
    transform translateY(-30%) rotate(45deg) scale(0.15);
  }
}

@keyframes icon-pop-out {
  from {
    transform translateY(-30%) rotate(45deg) scale(0.15);
    opacity 1;
  }
  to {
    opacity 0;
    transform translateY(-30%) rotate(180deg) scale(0.001);
  }
}

@keyframes expand {
  from {
    transform translate(-50%, -50%) scale(0.0001) rotate(0);
  }
  to {
    transform translate(-50%, -50%) scale(1) rotate(90deg);
  }
}

@keyframes fade {
  from {
    opacity 1;
  }
  to {
    opacity 0;
  }
}
</style>
