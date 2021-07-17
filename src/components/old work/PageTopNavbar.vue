<template>
  <transition name="menu-fade">
    <div v-if="!$route.name.includes('home')" class="page-top-navbar">
      <div class="navbar">
        <div v-for="route in $router.options.routes"
             :key="route.path" @click="$router.push(route.path)"
             class="nav-link"
             :class="onRoute(route.name) && activeClass">
          {{ route.name.toUpperCase() }}
          <div class="nav-icon"
               :class="[{'not-loaded' : notLoaded}, onRoute(route.name) && 'active-icon']">
            <svg viewBox="0 0 100 100">
              <polygon class="nav-icon-poly" points="50,10 90,50 50,90 10,50"></polygon>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PageTopNavbar',
  computed: {
    currentRoute () {
      return this.$route.name
    }
  },
  mounted () {
    setTimeout(() => this.notLoaded = false, 500)
  },
  watch: {
    $route (to, from) {
      if (from.name === 'home') {
        this.notLoaded = true
        setTimeout(() => this.notLoaded = false, 500)
      }
    }
  },
  data () {
    return {
      activeClass: 'active-link',
      notLoaded: true
    }
  },
  methods: {
    onRoute (routeCheck) {
      return this.$route.name.includes(routeCheck)
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../themes/variables.styl";

.not-loaded:not(.active-icon) {
  visibility hidden !important;
}

.page-top-navbar {
  position fixed;
  top 0;
  width 100%;
  color lightHighlightColour;
  z-index 1000;
}

.navbar {
  width 100%;
  display grid;
  justify-items center;
  grid-template-columns repeat(5, 1fr);
  margin-top 1%;
}

.nav-link {
  position relative;
  font-size 1.5rem;
  cursor pointer;
  letter-spacing 5px;
}

.active-link {
  position relative;
  transition all 0.3s;
}

.nav-link:hover {
  @extend .active-link;
}

.active-link > .nav-icon, .nav-link:hover > .nav-icon {
  opacity 1;
  animation icon-pop-in 0.3s;
}

.nav-icon {
  position absolute;
  display flex;
  opacity 0;
  justify-content center;
  bottom -1.1rem;
  width 100%;
  height 0.6rem;
  pointer-events none;
  animation icon-pop-out 0.5s;
}

.nav-icon > svg {
  height 100%;
}

.nav-icon > svg > polygon {
  fill lightHighlightColour;
  stroke lightHighlightColour;
  stroke-width 10px;
  stroke-linejoin round;
}

@keyframes icon-pop-in {
  from {
    transform translateY(-1rem) rotate(0deg) scale(0.1);
  }

  60% {
    transform rotate(90deg) scale(1.5);
  }

  to {
    transform rotate(90deg) scale(1);
  }
}

@keyframes icon-pop-out {
  0% {
    opacity 1;
  }
  from {
    transform scale(1);
  }
  to {
    transform rotate(180deg) scale(0.1);
  }
}

.menu-fade-enter-active {
  animation: menu-fade-in 0.5s;
}

.menu-fade-leave-active {
  animation: menu-fade-out 0.5s;
}

@keyframes menu-fade-in {
  from {
    opacity 0;
    transform translateY(-2rem);
  }
  to {
    opacity 1;
  }
}

@keyframes menu-fade-out {
  from {
    opacity 1;
  }
  to {
    opacity 0;
    transform translateY(-2rem);
  }
}

</style>
