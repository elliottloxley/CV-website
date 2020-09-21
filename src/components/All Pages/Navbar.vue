<template>
  <div class="navbar">
    <div class="menu-wrapper">
      <blob-button @buttonClicked="menuOpenClick" :class="{'menu-close' : isNavigationOpen}"
                   :blob-style-user="{fill: buttonFill}"
                   :content-style="{color: textColour}"
                   :font-size="0.9"
                   class="menu-open" :name="'open'" :nav-text="isNavigationOpen ? 'close' : 'open'"
                   :disable-hover-grow="isNavigationOpen" :show-text="isNavigationOpen">
        <morphing-icon :from-or-to="!isNavigationOpen" :icon-data="menuIcon" class="button-icon" :from-to-duration="[0.3, 0.3]"></morphing-icon>
      </blob-button>
      <blob-button @buttonClicked="navClick" v-for="(button, name) in navButtons"
                   :name="name" :key="name"
                   :style="getNavButtonStyle(button)"
                   :content-style="{color: textColour, transform: 'rotate(' + -button.rotation + 'deg)'}"
                   :font-size="0.9"
                   :blob-style-user="{fill: buttonFill}"
                   :nav-text="button.text" class="nav-button"
                   :class="{'active-nav' : onRoute(name)}">
        <router-link :to="button.link" style="opacity: 0;"></router-link>
        <icon :name="button.icon" class="button-icon"></icon>
        <transition name="spin">
          <div v-show="onRoute(name) && navOpenFinished" class="active-select"></div>
        </transition>
      </blob-button>
    </div>
    <div class="expand-wrapper">
      <div v-for="(button, name) in navButtons"
           :key="name" :style="{transform: `rotate(${button.rotation}deg) translate(${button.magnitude}%)`, zIndex: expandZ(name)}"
           class="blob-wrapper">
        <transition @after-enter="expandEnd(name)" name="expand">
          <blob :frozen="true" :path-style-user="{fill: getFillForExpand(name), transition: 'fill 1s linear 0.3s'}"
                :wiggle-magnitude="1.5" :loop-duration="0.5" v-show="isExpanding(name)" class="expand-blob"></blob>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>

import Blob from "@/components/All Pages/Blob";
import BlobButton from "@/components/All Pages/BlobButton";
import Icon from 'vue-md-icons/src/components/Icon'
import 'vue-md-icons/src/icons/home'
import 'vue-md-icons/src/icons/menu'
import 'vue-md-icons/src/icons/work'
import 'vue-md-icons/src/icons/person'
import 'vue-md-icons/src/icons/call'
import 'vue-md-icons/src/icons/clear'
import MorphingIcon from "@/components/All Pages/MorphingIcon";
import IconPathData from '@/AnimatedIcon/IconPathData';

export default {
  name: "Navbar",
  components: {
    MorphingIcon,
    BlobButton,
    Blob,
    Icon
  },
  data() {
    return {
      isNavigationOpen: false,
      navOpenFinished: false,
      expandingNames: {},
      transitionFill: "",
      isMounted: false,
      menuIcon: IconPathData.menuToClose
    }
  },
  props: {
    buttonFill: {default: 'red', type: String},
    backgroundColour: {default: 'white', type: String},
    textColour: {default: 'white', type: String}
  },
  computed: {
    navButtons() {
      let translateMag = 130;
      let pathNames = [];
      let paths = [];
      this.$router.options.routes.forEach(route => {
        pathNames.push(route.name);
        paths.push(route.path);
      });

      return {
        [pathNames[0]]: {text: 'home', link: paths[0], icon: 'home', rotation: 210, magnitude: translateMag, transitionTime : [0,0.06]},
        [pathNames[1]]: {text: 'work', link: paths[1], icon: 'work', rotation: 250, magnitude: translateMag-5, transitionTime : [0.05,0.04]},
        [pathNames[2]]: {text: 'bio', link: paths[2], icon: 'person', rotation: 290, magnitude: translateMag-5, transitionTime : [0.1,0.02]},
        [pathNames[3]]: {text: 'contact', link: paths[3], icon: 'call', rotation: 330, magnitude: translateMag, transitionTime : [0.15,0]}
      }
    }
  },
  methods: {
    getNavButtonStyle(currentButton) {
      return {transform: `rotate(${currentButton.rotation}deg)
              translate(${this.isNavigationOpen ? currentButton.magnitude : 0}%)
              scale(${this.isNavigationOpen ? 1 : 0.8})`,
              transitionDelay: `${this.isNavigationOpen ? currentButton.transitionTime[0] : currentButton.transitionTime[1]}s`,}
    },
    menuOpenClick() {
      this.isNavigationOpen = !this.isNavigationOpen;
      setTimeout(() => {this.navOpenFinished = !this.navOpenFinished;}, 300);
    },
    navClick(name) {
      this.expand(name);
      this.$router.push(this.navButtons[name].link);
      setTimeout(() => {this.expandingNames[name].fill = this.backgroundColour;}, 50);
    },
    onRoute(routeCheck) {
      return this.$route.name.includes(routeCheck);
    },
    expandNamesDefault() {
      let names = {};
      Object.keys(this.navButtons).forEach(key => {
        names[key] = {expanding: false, fill: this.buttonFill, z: 100};
      });
      return names;
    },
    expandCount() {
      let count = 0;
      Object.keys(this.expandingNames).forEach(key => {
        if(this.expandingNames[key].expanding) {
          count += 1;
        }
      })
      return count;
    },
    expand(name) {
      this.expandingNames[name].expanding = true;
      //makes sure newest clicked is always on top
      this.expandingNames[name].z += this.expandCount();
    },
    isExpanding(name) {
      if(this.expandingNames[name]) {
        return this.expandingNames[name].expanding;
      }
      else {
        return false;
      }
    },
    expandZ(name) {
      return this.isMounted ? this.expandingNames[name].z : 100;
    },
    expandEnd(name) {
      this.expandingNames[name].expanding = false;
      this.expandingNames[name].fill = this.buttonFill;
      this.expandingNames[name].z = 100;
    },
    getFillForExpand(name) {
      return this.isMounted ? this.expandingNames[name].fill : "";
    },
  },
  mounted() {
    this.expandingNames = this.expandNamesDefault();
    this.isMounted = true;
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../themes/variables.styl"

.navbar {
  position fixed;
  display: flex;
  justify-content center;
  bottom 0;
  width 100%;
  color miscTextColour;
  height 8rem;
}

.menu-wrapper, .expand-wrapper {
  position absolute;
  left 50%;
  transform translateX(-50%);
  width 6.5rem;
  height 6.5rem;
}

.menu-wrapper {
  z-index 100;
  filter url("#connectElements") drop-shadow( 3px 3px 2px rgba(0, 0, 0, 0.7));
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
  width 100%;
  height 100%;
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
  z-index 100;
}

.menu-close {
  transform scale(0.8);
  transition all 0.3s;
}

.menu-open, .nav-button {
  position absolute;
  top 0;
  height 100%;
  width 100%;
}

.nav-button {
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