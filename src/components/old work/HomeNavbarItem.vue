<template>
  <div @click="$router.push(navLink)"
       class="home-navbar-item">
    <div :class="{'show' : showMenu}"
         class="item-container item-container-leave-transition">
      <div class="icon-container">
        <img class="nav-item-icon" :src="require('@/assets/buttonicons/' + navIconUrl + '')" alt="icon"/>
      </div>
      <div><span class="nav-item-text">{{ navText }}</span></div>
      <div><span class="nav-popup-text">{{ navPopup }}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeNavbarItem',
  props: {
    navIconUrl: String,
    navText: String,
    navLink: String,
    navPopup: String
  },
  data () {
    return {
      showMenu: false
    }
  },
  methods: {
    appear () {
      this.showMenu = true
    },
    hide () {
      this.showMenu = false
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import '../../themes/variables.styl'

.home-navbar-item {
  position relative;
  height 28vh;
  background-color rgba(0, 0, 0, 0);
  color miscTextColour;
}

.item-container {
  position relative;
  display grid;
  grid-template-rows 2fr 4fr 4fr;
  justify-content center;
  cursor pointer;
  padding-top 15%;
  box-sizing border-box;
  width 100%;
  height 100%;
  z-index 1000;
  border-radius 8px;

  gradientVert(10%, homePageMenuColour, miscTransparent);
}

.item-container-leave-transition {
  visibility hidden;
  transform translateY(-80px);
  pointer-events none;
  transition all 0.5s;
  opacity 0;
}

.item-container:hover {
  transform translateY(-4rem);
  //transition transform 0.3s;
  box-shadow 0 4px 6px -1px homePageShadowColour;

  gradientVert(22%, homePageMenuHoverColour, miscTransparent);
}

.item-container:hover .nav-popup-text {
  transform translateY(-1rem);
  opacity 1;

  transition opacity 0.3s, transform 0.5s;
}

.icon-container {
  width 100%;
  height 100%;
  text-align center;
}

.nav-item-icon {
  width 2rem;
}

.nav-item-text {
  display block;
  width 100%;
  text-align center;
}

.nav-popup-text {
  opacity 0;
  display block;
  width 100%;
  transition all 0.5s;
}

.show {
  pointer-events all;
  visibility visible;
  transform translateY(0px);
  opacity 1;
  transition all 0.5s;
}

</style>
