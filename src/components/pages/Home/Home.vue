<template>
  <div class="home">
    <div ref="lineBackground" class="line-background">
      <line-path class="home-line home-main-line"
                 @reachednode="hitNode"
                 :path-coords="[[0,20],[40,20],[40,50],[60,50],[60,60],[60,100]]"
                 :line-width="3"
                 :animate-time="2.5"
                 :animate-delay="0.8"
                 :line-colour="'rgba(255,255,255,1)'"
                 :parent-dimensions="[lineParentDimensions[0], lineParentDimensions[1]]"
                 :line-join="'round'"
                 :show-nodes="true"
                 :excluded-nodes="[5]"
                 :node-fill-colour="'black'"
                 :node-stroke-width="10"
                 :feather-node-radius="2.5"
                 :nodes-to-feather="[0,1,2,3,4]"
                 :node-size="['25px', '25px']"
      ></line-path>
      <line-path class="home-line home-work-line-offscreen-preview"
                 :path-coords="[[100,40], [75,40], [75,60], [68,60]]"
                 :line-width="1"
                 :line-percent="workOffscreenPreviewPercent"
                 :animate-time="0.7"
                 :show-only-end-node="true"
                 :transition-timing-function="'ease-out'"
                 :line-colour="'rgba(255,255,255,0.3)'"
                 :parent-dimensions="[lineParentDimensions[0], lineParentDimensions[1]]"
                 :nodes-to-feather="[3]"
                 :feather-node-radius="12">
      </line-path>
      <line-path class="home-line home-work-line-offscreen"
                 v-if="showWorkLineOffscreen"
                 :path-coords="[[68,60], [75,60], [75,40], [100,40]]"
                 :line-width="3"
                 :animate-time="0.5"
                 :line-colour="'rgba(255,255,255,1)'"
                 :nodes-to-feather="[0]"
                 :feather-node-radius="12"
                 :parent-dimensions="[lineParentDimensions[0], lineParentDimensions[1]]"
                 :show-nodes="true"
                 :node-stroke-width="10"
                 :node-fill-colour="'black'"
                 :node-size="['25px', '25px']"
                 :line-join="'round'"
                 :excluded-nodes="[0]"
      ></line-path>
      <line-path class="home-line home-work-line"
                 v-if="displayWorkLine"
                 @reachednode="workButtonCreated"
                 :path-coords="[[60,60], [68,60]]"
                 :line-width="3"
                 :animate-time="0.5"
                 :animate-delay="0.2"
                 :line-colour="'rgba(255,255,255,1)'"
                 :parent-dimensions="[lineParentDimensions[0], lineParentDimensions[1]]"
                 :line-join="'round'"
                 :show-nodes="true"
                 :excluded-nodes="[0]"
                 :node-advance-appear="{1 : 0.1}"
                 :node-fill-colour="'black'"
                 :node-stroke-width="13"
                 :nodes-to-feather="[1]"
                 :feather-node-radius="4"
                 :feather-node-scale="workLineFeatherScale"
                 :node-size="['30px', '30px']">
        <template v-slot:[buttonsOnPath[0]]="">
          <line-button style="color: white;font-size: 24px; width: min-content;"
                       @mouseenter.native="workOffscreenPreviewPercent = 1;"
                       @mouseleave.native="workOffscreenPreviewPercent = 0;"
                       @click.native="workOffscreenPreviewPercent = 0;showWorkLineOffscreen = true; showButtonLineConnector = true"
                       :show-left-line="true"
                       :show-right-line="showButtonLineConnector"
                       :enable-enter-animation="true"
                       :content="'WORK'"></line-button>
        </template>
      </line-path>
    </div>
    <div class="content-foreground">
      <div class="name-container">
        <svg viewBox="0 0 100 20">
          <text class="title-first" x="0" y="7" fill="white" font-size="8">ECL</text>
          <text class="title-first" x="0" y="18.7" fill="white" font-size="8">WEB</text>
          <rect data-v-8a9df0b8 x="18" y="9" width="65.5" height="2" fill="black"></rect>
          <text class="title-second" x="20" y="15.9" fill="white" font-size="17">DESIGN</text>
          <path d="M21,1 h-3 v18 h3 M80.5,1 h3 v18 h-3" stroke-linecap="square" stroke="white" stroke-width="0.7"></path>
          <!--test lines -->
          <path v-if="false" d="M12,10 v-3 6 M0,10 h100" stroke="red" stroke-width="0.5"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>

import 'vue-md-icons/src/icons/home'
import 'vue-md-icons/src/icons/menu'
import 'vue-md-icons/src/icons/work'
import 'vue-md-icons/src/icons/person'
import 'vue-md-icons/src/icons/call'
import 'vue-md-icons/src/icons/clear'
import LinePath from "@/components/All Pages/LinePath";
import LineButton from "@/components/All Pages/LineButton";


export default {
  name: "Home",
  components: {
    LineButton,
    LinePath,
  },
  data() {
    return {
      particles: {},
      lineParentDimensions: [],
      displayLine: false,
      mousePosition: [],
      displayWorkLine: false,
      showWorkLineOffscreen: false,
      workOffscreenPreviewPercent: 0,
      showButtonLineConnector: false,
      workLineFeatherScale: 0.3,
      workLineFadeSize: 0,
      buttonsOnPath: ['nodeSlot1', 'nodeSlot3']
    }
  },
  computed: {
  },
  methods: {
    deleteParticle(id) {
      this.$delete(this.particles, id);
    },
    hitNode(index) {
      if(index === 4) {
        this.displayWorkLine = true;
      }
    },
    workButtonCreated() {
      setTimeout(() => {this.workLineFeatherScale = 3}, 400);
    }
/*    mouseMove(event) {
      //this.mousePosition = [event.clientX, event.clientY];

      let width = this.$refs.lineBackground.clientWidth;
      let height = this.$refs.lineBackground.clientHeight;

      let xPercent = (event.clientX / width) - 0.5;
      let yPercent = (event.clientY / height) - 0.5;

      this.cloudPerspective = `${50 + (xPercent * 5)}% ${50 + (yPercent * 5)}%`
    }*/
  },
  mounted() {
    this.$set(this.particles, 1, 0);
    this.lineParentDimensions = [this.$refs.lineBackground.clientWidth, this.$refs.lineBackground.clientHeight];
    this.displayLine = true;
  }
}
</script>

<style lang="scss" scoped>

@import "src/themes/sassAnimations.scss";

.home {
  background-color: black;
}

.line-background {
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.content-foreground {
  width: 100vw;
  height: 100vh;
  color: white;
}

.name-container {
  position: absolute;
  top: 20.3%;
  left: 2%;
  width: 25%;
  font-family: "IBM Plex Mono";
  transform: translateY(-50%);
}

.title-first {
  font-weight: 400;
}

.title-second {
  font-weight: 200;
}

.home-line {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.home-main-line, .home-work-line {

}

</style>