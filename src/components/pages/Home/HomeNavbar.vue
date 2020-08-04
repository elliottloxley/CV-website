<template>
  <div v-if="show" class="home-navbar">
    <div></div>
    <home-navbar-item ref="menu0"
                      nav-link="Websites" nav-icon-url="icon.svg"
                      nav-text="Web design" nav-popup="Visit my websites"/>
    <home-navbar-item ref="menu1"
                      nav-link="About" nav-icon-url="icon.svg" nav-text="About"
                      nav-popup="Read my bio"/>
    <home-navbar-item ref="menu2"
                      nav-link="Software" nav-icon-url="icon.svg" nav-text="Software"
                      nav-popup="See my Programs"/>
    <home-navbar-item ref="menu3"
                      nav-link="Contact" nav-icon-url="icon.svg" nav-text="Contact"
                      nav-popup="Get in touch"/>
    <div></div>
  </div>
</template>

<script>
import HomeNavbarItem from "@/components/pages/Home/HomeNavbarItem";

export default {
  name: "HomeNavbar",
  components: {
    'home-navbar-item': HomeNavbarItem
  },
  data() {
    return {
      enterDelayPattern: [50, 250, 100, 350],
      leaveDelayPattern: [350, 150, 250, 50],
      show: true
    }
  },
  methods: {
    menuEnter() {
      for (const i in this.enterDelayPattern) {
        setTimeout(() => {this.$refs["menu" + i].appear()}, this.enterDelayPattern[i])
        this.show = true;
      }
    },
    menuLeave() {
      for (const i in this.enterDelayPattern) {
        setTimeout(() => {this.$refs["menu" + i].hide()}, this.leaveDelayPattern[i])
        setTimeout(() => {this.show = false;}, 1000);
      }
    }
  },
  watch: {
    $route(to, from) {
      if(to.name === "home") {
        setTimeout(() => {
          this.menuEnter()
        }, 500);
      }
      else if(from.name === "home") {
        this.menuLeave();
      }
    }
  },
  mounted() {
    if(this.$route.name === "home") {
      setTimeout(() => {
        this.menuEnter()
      }, 500);
    }
    else {
      this.menuLeave();
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../../themes/variables.styl"

.home-navbar {
  position absolute;
  width 100%;
  bottom 0;
  display grid;
  grid-gap 5px;
  grid-template-columns 1.6fr 1fr 1fr 1fr 1fr 1.6fr;
}

</style>