<template>
  <div :style="itemMaxSize" class="grid-view-item item-external-modify">
    <div class="grid-content content-external-modify">
      <div class="title-img-wrapper">
        <div class="title highlight-external-modify title-external-modify">
          {{ gridItem["title"]}}
        </div>
          <div :style="imageStyleUrl" class="grid-img">
            <transition name="fade">
              <div v-if="descriptionShown" class="description-text">
                <span>{{gridItem["short_desc"]}}</span>
              </div>
            </transition>
          <div :class="{'description-clicked' : descriptionShown }" class="description-expand highlight-external-modify"></div>
        </div>
      </div>
    </div>
    <div class="menu-wrapper">
      <button :class="{'depressed' : descriptionShown}" @click="descriptionClicked" class="description-icon highlight-external-modify">
      </button>
      <button class="link-icon">

      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GridViewItem',
  props: {
    gridItem: Object,
    descSelectedId: Number,
    maxWidth: String
  },
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    imageStyleUrl () {
      return {
        backgroundImage: 'url(' + require('@/assets/' + this.gridItem.img) + ')'
      }
    },
    descriptionShown () {
      return this.descSelectedId === this.gridItem.id
    },
    itemMaxSize () {
      return { 'max-width': this.maxWidth }
    }
  },
  methods: {
    descriptionClicked () {
      this.$emit('descriptionClicked', this.gridItem.id)
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../themes/variables.styl"

button {
  border none;
  outline none;
}

.grid-view-item {
  position relative;
  display flex;
  box-sizing border-box;
  text-align center;
  color miscTextColour;
  transition all 0.5s;
  animation self-slide-down 0.5s, self-fade-in 0.8s;
}

.grid-view-item:hover {
  transition all 0.3s;
}

.grid-view-item::before {
  content '';
  padding-top: 80%;
  display: block;
}

.title-img-wrapper {
  position relative;
  display flex;
  flex-direction column;
  height 100%;
}

.grid-content {
  position: absolute;
  overflow hidden;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.grid-img {
  position relative;
  width 94%;
  height 100%;
  margin 0 3%;
  overflow hidden;
  transition all 0.5s;
  background-size cover;
  background-position center;
  z-index 1;
  flex 1;
}

.description-text {
  position absolute;
  height 75%;
  width 80%;
  box-sizing content-box;
  padding 20px 10% 0 10%;
  text-align justify;
  overflow-y auto;
  z-index 3;
}

.title {
  position relative;
  font-size 1.5rem;
  color miscTextColour;
  width 100%;
  padding 2% 0;
  border-radius 8px;
  box-shadow 0 6px 4px -4px miscDarkShadow;
  z-index 100;
  flex-basis min-content;
}

.link-icon {
  display flex;
  justify-content center;
  align-items center;
  z-index: 2;
  right 0;
  box-shadow 0 -2px 4px 1px miscDarkShadow;
  cursor: pointer;
  transition all 0.3s;
  animation icon-wobble 0.5s;
  animation-delay 1.3s;
  color miscLinkColour;
}

.description-icon {
  display flex;
  justify-content center;
  align-items center;
  box-shadow 2px -2px 4px -1px miscDarkShadow;
  cursor: pointer;
  transition all 0.3s;
  animation icon-wobble 0.5s;
  animation-delay 1s;
}

.description-icon:hover, .description-icon:focus, .link-icon:hover, .link-icon:focus {
  transition all 0.3s;
  transform scale(1.1);
  filter brightness(130%);
}

.menu-wrapper {
  position absolute;
  display flex;
  flex-direction row;
  bottom -1rem;
  z-index: 2;
  width 100%;
}

.description-expand, .description-icon, .link-icon {
  height 3.8rem;
  width 3.8rem;
  border-radius 100%;
  margin-right 10px;
}

.description-expand {
  position absolute;
  bottom -1rem;
  left -1.1rem;
  z-index 2;
  transition all 0.8s;
}

.description-icon > * {
  color miscTextColour;
}

@keyframes icon-wobble {
  25% {
    transform rotate(15deg);
    filter brightness(130%);
  }
  50% {
    filter brightness(130%);
  }
  75% {
    transform rotate(-15deg);
  }
  100% {
    filter brightness(100%);
  }
}

.description-clicked {
  transform scale(30);
  transition all 0.8s ease-in;
}

.depressed {
  box-shadow none;
  transform scale(1) !important;
  filter brightness(100%) !important;
  transition all 0.5s;
}

.fade-enter-active {
  opacity 0;
  animation self-fade-in 0.5s;
  animation-delay 0.5s;
}

.fade-leave-active {
  animation self-fade-out 0.5s;
}

@keyframes self-slide-down {
  0% {
    transform translateY(-5%) scale(0.95);
  }
  100% {
    transform translateY(0px) scale(1);
  }
}

@keyframes self-fade-in {
  0% {
    opacity 0;
  }
  100% {
    opacity 1;
  }
}

@keyframes self-fade-out {
  0% {
    opacity 1;
  }
  100% {
    opacity 0;
  }
}
</style>
