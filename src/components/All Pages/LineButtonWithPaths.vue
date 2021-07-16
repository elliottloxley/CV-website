<template>
  <div ref="parent" class="line-button-with-paths">
    <line-path class="line exit-line-preview"
               v-if="shouldDisplay"
               :path-coords="exitPreviewPath"
               :relative-coord="relativeCoord"
               :line-width="1"
               :line-percent="exitLinePreviewPercent"
               :animate-time="exitPathPreviewTime"
               :transition-timing-function="'ease-out'"
               :line-colour="'rgba(255,255,255,0.3)'"
               :nodes-to-feather="previewReverse ? [exitPreviewPath.length - 1] : [0]"
               :custom-feather-node-offset="exitPreviewFeatherOffset"
               :feather-node-scale="displayExitLine ? 0.01 : 1"
               :feather-node-radius="featherStartRadius * 4">
    </line-path>
    <line-path class="line exit-line"
               v-if="displayExitLine && shouldDisplay"
               @reachedlastnode="$emit('reachedend');"
               :path-coords="exitPathComputed"
               :relative-coord="relativeCoord"
               :disable-animation="forceShowExitLine"
               :line-width="1"
               :animate-time="exitPathTime"
               :line-colour="'rgba(255,255,255,1)'"
               :show-nodes="false"
               :line-join="'round'"
               :nodes-to-feather="[0]"
               :feather-node-radius="featherStartRadius"
               :custom-feather-node-offset="exitFeatherOffset"
               :feather-node-scale="buttonExpanded || disableEntryAnimation ? featherEntryEndScale : featherStartScale"
    ></line-path>
    <line-path class="line entry-line"
               v-if="shouldDisplay"
               :start="displayEntryLine"
               @reachedlastnode="showButton"
               :path-coords="entryPath"
               :relative-coord="relativeCoord"
               :line-width="2"
               :animate-time="entryPathTime"
               :animate-delay="0.2"
               :line-colour="'rgba(255,255,255,1)'"
               :line-join="'round'"
               :show-nodes="true"
               :excluded-nodes="[0,1]"
               :node-advance-appear="{1 : 0.1}"
               :node-fill-colour="'black'"
               :node-stroke-width="13"
               :disable-animation="disableEntryAnimation"
               :nodes-to-feather="[entryPath.length - 1]"
               :feather-node-radius="featherStartRadius"
               :custom-feather-node-offset="entryFeatherOffset"
               :feather-node-scale="buttonExpanded || disableEntryAnimation ? featherEntryEndScale : featherStartScale"
               :node-size="['30px', '30px']">
      <template v-slot:[buttonNodeIndex]="">
        <line-button class="button"
                     v-if="shouldDisplay"
                     :style="buttonPositionStyle"
                     @mouseenter.native="exitLinePreviewPercent = forceShowExitLine ? 0 : 1;"
                     @mouseleave.native="exitLinePreviewPercent = 0;"
                     @click.native="exitLinePreviewPercent = 0; showExitConnector(); displayExitLine = true; $emit('clicked')"
                     :show-left-line="showleft"
                     :show-right-line="showright"
                     :show-top-line="showtop"
                     :show-bottom-line="showbottom"
                     :enable-enter-animation="!disableEntryAnimation"
                     :content="content"></line-button>
      </template>
    </line-path>
    <line-button ref="virtualButton" class="virtual-button"
                 :enable-enter-animation="false"
                 :content="content"></line-button>
  </div>
</template>

<script>
import LinePath from "@/components/All Pages/LinePath";
import LineButton from "@/components/All Pages/LineButton";
import {debounce} from "debounce";
export default {
  name: "LineButtonWithPaths",
  components: {LineButton, LinePath},
  data() {
    return {
      buttonNodeIndex: 'nodeSlot' + this.buttonIndex,
      entryLineFeatherScale: 0.3,
      showButtonLineConnector: false,
      exitLinePreviewPercent: 0,
      displayEntryLine: false,
      displayExitLine: false,
      featherStartRadius: 18,
      featherStartScale: 1,
      buttonExpanded: false,
      showleft: false,
      showright: false,
      showtop: false,
      showbottom: false,
      mounted: false,
      parentDimensions: [],
    }
  },
  props: {
    buttonIndex: {default: 0, type: Number}, //
    exitDirection: {default: 'right', type:String, validator(value) {return value.toLowerCase() === 'left'
                                                                         || value.toLowerCase() === "top"
                                                                         || value.toLowerCase() === "bottom"
                                                                         || value.toLowerCase() === "right";}}, //
    entryDirection: {default: 'left', type: String, validator(value) {return value.toLowerCase() === 'left'
                                                                          || value.toLowerCase() === "top"
                                                                          || value.toLowerCase() === "bottom"
                                                                          || value.toLowerCase() === "right";}}, //
    entryPath: {required: true, type: Array}, //array of array coords
    exitPath: {required: true, type: Array}, //array of array coords,
    content: {default: 'Default', type: String}, //
    previewReverse: {default: true, type:Boolean},
    exitPathPreviewTime: {default: 0.5, type:Number},
    exitPathTime: {default: 0.5, type:Number},
    entryPathTime: {default: 0.5, type:Number},
    relativeCoord: {default() {return [0,0]}, type:Array}, //added to path coords before any calculations
    anchorEntryToEdge: {default: true, type:Boolean}, //the line ends at the button edge instead of middle
    forceShowExitLine: {default: false, type: Boolean}, //
    disableEntryAnimation: {default: false, type: Boolean}, //
  },
  methods: {
    showButton() {
      setTimeout(() => {
        this.buttonExpanded = true}, 400);
    },
    showEntryConnector() {
      let index = 'show' + this.entryDirection.toLowerCase();
      this[index] = true;
    },
    showExitConnector() {
      let index = 'show' + this.exitDirection.toLowerCase();
      this[index] = true;
    },
    buttonPercentWidth() {
      return this.$refs.virtualButton.getWidth() / this.parentDimensions[0];
    },
    buttonPercentHeight() {
      return this.$refs.virtualButton.getHeight() / this.parentDimensions[1];
    },
    getFeatherScale(direction, multiplier) {

      if (direction === 'left' || direction === 'right') {
        return this.featherStartScale * multiplier;
      }
      else {

        return this.featherStartScale * (multiplier / 2);
      }
    },
    getShiftedPath(path, x, y) {
      let shiftedPath = [];

      for(let i = 0; i < path.length; i++) {
        shiftedPath.push([path[i][0] + x, path[i][1] + y]);
      }

      return shiftedPath;
    },
    onResize() {
      this.parentWidth = this.$refs.parent.clientWidth;
      this.parentHeight = this.$refs.parent.clientHeight;
    },
  },
  computed: {
    exitPathComputed() {
      if(this.mounted) {
        if (this.anchorEntryToEdge) {
          switch (this.entryDirection) {
            case 'left': {
              return this.getShiftedPath(this.exitPath, (this.buttonPercentWidth() * 100), 0);
            }
            case 'right': {
              return this.getShiftedPath(this.exitPath, -(this.buttonPercentWidth() * 100), 0);
            }
            case 'top': {
              return this.getShiftedPath(this.exitPath, 0, (this.buttonPercentHeight() * 100));
            }
            case 'bottom': {
              return this.getShiftedPath(this.exitPath, 0, -(this.buttonPercentHeight() * 100));
            }
          }
        }
      }

      return this.exitPath;
    },
    entryFeatherOffset() {
      if (this.anchorEntryToEdge) {
        let magnitude = 10;
        switch (this.entryDirection) {
          case 'left': {
            return {[this.entryPath.length - 1]: [magnitude,0]};
          }
          case 'right': {
            return {[this.entryPath.length - 1]: [-magnitude,0]};
          }
          case 'top': {
            return {[this.entryPath.length - 1]: [0,magnitude]};
          }
          case 'bottom': {
            return {[this.entryPath.length - 1]: [0,-magnitude]};
          }
        }
      }

      return {};
    },
    exitFeatherOffset() {
      return {0 : [-this.entryFeatherOffset[this.entryPath.length - 1][0], 0]};
    },
    exitPreviewFeatherOffset() {
      return {[this.exitPathComputed.length -1] : [-this.entryFeatherOffset[this.entryPath.length - 1][0], 0]};
    },
    exitPreviewPath() {
      if(this.previewReverse) {
        return this.exitPathComputed.slice().reverse();
      }

      return this.exitPathComputed.slice();
    },
    buttonPositionStyle() {
      if(this.anchorEntryToEdge) {
        switch(this.entryDirection) {
          case 'left': {
            return {transform: `translateX(50%)`}
          }
          case 'right': {
            return {transform: `translateX(-50%)`}
          }
          case 'top': {
            return {transform: `translateY(50%)`}
          }
          case 'bottom': {
            return {transform: `translateY(-50%)`}
          }
        }
      }

      return '';
    },
    featherEntryEndScale() {
      if(this.mounted) {
        return this.getFeatherScale(this.entryDirection, 2);
      }

      return 1;
    },
    featherExitEndScale() {
      if(this.mounted) {
        return this.getFeatherScale(this.exitDirection, 3);
      }

      return 1;
    },
    shouldDisplay() {
      return this.parentDimensions.length > 0;
    }
  },
  created() {
    this.resizeListener = window.addEventListener('resize', debounce(() => {this.onResize()}, 200));
  },
  destroyed() {
    this.resizeListener.removeEventListener();
  },
  mounted() {
      this.$nextTick(() => {
        this.parentDimensions = [this.$refs.parent.clientWidth, this.$refs.parent.clientHeight];
        this.showEntryConnector();
        this.displayEntryLine = true;
        this.mounted = true;
      })
  },
  beforeMount() {
    if(this.forceShowExitLine) {
      this.showExitConnector();
    }
  }
}
</script>

<style lang="scss" scoped>

.button, .virtual-button {
  color: white;
  font-size: 1.4rem;
  width: min-content;
  pointer-events: all;
}

.virtual-button {
  position: absolute;
  left: -1000px;
  top: -1000px;
  visibility: hidden;
}

.line-button-with-paths {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.line {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

</style>