<template>
  <div :class="{'nav-open' : navbarOpen}"
       class="full-side-navbar">
    <blob-line
        @clickedOutside="outsideClickIncrement"
        :enable-detect-click-outside="true"
        :start-point-user="[0.8, 1]"
        :end-point-user="[0.8, 0]"
        :curve-magnitude-normal="0"
        :aspect-ratio="[0.5, 1]"
        :wiggle-magnitude="1"
        :vertex-count="15"
        :path-style="{fill: $root.currentTheme.feature.highlight}"
        class="side-nav-bg"></blob-line>
    <page-navbar class="navbar" @menuClicked="menuClicked"
                 @clickedOutside="outsideClickIncrement"
                 :is-navigation-open="navbarOpen"
                 :button-fill="$root.currentTheme.feature.highlight"
                 :text-colour="$root.currentTheme.text.base"
                 :background-colour="$root.currentTheme.background.base"
                 :expand-delay="150"
                 :button-y-offset="10"
                 :button-x-offset="-20"></page-navbar>
    <collapsible-side-navbar
        :ref="'contentNav'"
        :nav-object="pageContent.nodes"
        :nav-id="pageContent.navID"
        :indent="0"
        :indent-styles="[{fontSize: '2rem', height: '2.2rem', lineHeight: '2rem', color: 'red'}, {fontSize: '1.5rem', lineHeight: '1.5rem', color: 'pink'}]"
        :content="pageContent.content"
        class="content-side-nav"></collapsible-side-navbar>
  </div>
</template>
<script>

import PageNavbar from '@/components/All Pages/PageNavbar'
import 'vue-md-icons/src/icons/settings'
import CollapsibleSideNavbar from '@/components/old work/CollapsibleSideNavbar'
import BlobLine from '@/components/old work/BlobLine'

export default {
  name: 'FullSideNavbar',
  components: {
    BlobLine,
    CollapsibleSideNavbar,
    PageNavbar
  },
  data () {
    return {
      pageNavOpen: false,
      checkingClicks: false,
      outsideClickCount: 0,
      navbarOpen: false
    }
  },
  props: {
    pageContent: { default () { return {} }, type: Object }
  },
  watch: {
    $route (to) {
      this.page = to.name
    }
  },
  methods: {
    menuClicked (val) {
      this.navbarOpen = !val
    },
    outsideClickIncrement (event) {
      if (!this.checkingClicks) {
        this.checkingClicks = true
        setTimeout(() => { this.checkingClicks = false; this.outsideClickCount = 0 }, 50)
      }
      const e = this.$refs.contentNav
      if (!e.$el.contains(event.target)) {
        this.outsideClickCount += 1
      }

      if (this.outsideClickCount >= 2) {
        this.navbarOpen = false
        this.checkingClicks = false
        this.outsideClickCount = 0
      }
    }
  },
  mounted () {
    this.page = this.$route.name
  }
}
</script>

<style lang="stylus" type="text/stylus">

.navbar {
  width 7rem;
  height 7rem;
  transform translate(-50%, -0.5px);
}

.full-side-navbar {
  height 100vh;
  display flex;
  position fixed;
  transform translateX(-8.5rem);
  top 0;
  left 0;
  color white;
  filter drop-shadow( 1px 2px 2px rgba(0, 0, 0, 0.7));
  transition all 0.4s;
}

.nav-open {
  transform translateX(0);
}

.content-side-nav {
  position absolute;
  user-select none;
  margin-left 1.5rem;
  z-index 1;
}

.side-nav-bg {
  position relative;
  width 12rem;
  height 100vh;
  top 0;
  left 0;
  z-index 0;
}
</style>
