<template>
  <div class="panel">
    <blob-line @clickedOutside="outsideClick" @blobMouseEnter="mouseEnter" @blobMouseLeave="mouseLeave" v-on="!isPanelActive ? {blobClicked: clicked} : null"
               :class="{'panel-hover' : isPanelHovered && !isPanelActive}"
               :style="blobPanelStyle"
               :start-point-user="panelStart"
               :end-point-user="panelEnd"
               :curve-magnitude-normal="0.5"
               :edge-offset="0.2"
               :loop-duration="1.5"
               :wiggle-magnitude="1.5"
               :enable-detect-click-outside="true"
               :path-style="{fill: blobFill}"
               class="settings-blob"></blob-line>
    <morphing-icon @click.native="clicked"
                   :style="iconStyle"
                   :from-or-to="!isPanelActive"
                   @mouseenter.native="isIconHovered = true"
                   @mouseleave.native="isIconHovered = false"
                   class="icon"
                   :icon-data="morphingIconData"
                   :from-to-duration="[0.3, 0.3]"></morphing-icon>
    <morphing-icon :from-or-to="!isPanelActive"
                   :style="iconShadowStyle"
                   class="shadow-icon"
                   :icon-data="morphingIconData"
                   :from-to-duration="[0.3, 0.3]"></morphing-icon>
  </div>
</template>

<script>

import BlobLine from "@/components/old work/BlobLine";
import MorphingIcon from "@/components/All Pages/MorphingIcon";

export default {
  name: "BlobPanelButton",
  components: {
    MorphingIcon,
    BlobLine
  },
  data() {
    return {
      isPanelHovered: false,
      isIconHovered: false
    }
  },
  props: {
    expandSize: {default: 3, type:Number},
    morphingIconData: {required: true, type: Object},
    position: {default: 'top right', type:String, validator(value) {
        let splitVal = value.split(" ");

        return splitVal.length === 2 && (
            splitVal.includes('top') && splitVal.includes('right') ||
            splitVal.includes('top') && splitVal.includes('left') ||
            splitVal.includes('bottom') && splitVal.includes('right') ||
            splitVal.includes('bottom') && splitVal.includes('left'))
      }},
    isPanelActive: {default: false, type:Boolean},
    blobFill: {default: '#000', type:String},
    textSize: {default: 2, type:Number},
    textColour: {default: '#fff', type:String},
    iconOffset: {default() {return [13, 13]}, type:Array},
    iconHoverTransition: {default: "rotate(90deg)", type:String},
    iconActiveTransition: {default:"rotate(-180deg)", type:String},
    iconActiveHoverTransition: {default:"scale(1.1) rotate(-180deg)", type:String}
  },
  computed: {
    iconStyle() {
      return {[this.position.split(" ")[0]]: this.iconOffset[0] + '%',
        [this.position.split(" ")[1]]: this.iconOffset[1] + '%',
        width: `${this.textSize}rem`,
        height: `${this.textSize}rem`,
        color: this.textColour,
        cursor: this.isPanelActive ? "pointer" : "none",
        pointerEvents: this.isPanelActive ? "all" : "none",
        transform: this.isIconHovered && this.isPanelActive ? this.iconActiveHoverTransition :
                    this.isPanelHovered && !this.isPanelActive ? this.iconHoverTransition:
                    !this.isPanelHovered && this.isPanelActive ? this.iconActiveTransition: ""}
    },
    iconShadowStyle() {
      return {...this.iconStyle,
        ...{[this.position.split(" ")[0]]: this.iconOffset[0] + 2 + '%',
          [this.position.split(" ")[1]]: this.iconOffset[1] + 2 + '%'},
        ...{opacity: this.isIconHovered ? 0.4 : 0}};
    },
    blobPanelStyle() {
      return {transform: `scale(${this.isPanelActive ? this.expandSize : 1})`,
          transition: 'all 0.3s',
          transformOrigin: this.position}
    },
    panelStart() {
      switch(this.position) {
        case 'top right': {
          return [0.2, 0];
        }
        case 'top left': {
          return [0, 0.8];
        }
        case 'bottom right': {
          return [1, 0.2];
        }
        case 'bottom left': {
          return [0.8, 1];
        }
      }
      return [];
    },
    panelEnd() {
      switch(this.position) {
        case 'top right': {
          return [1, 0.8];
        }
        case 'top left': {
          return [0.8, 0];
        }
        case 'bottom right': {
          return [0.2, 1];
        }
        case 'bottom left': {
          return [0, 0.2];
        }
      }
      return [];
    }
  },
  methods: {
    mouseEnter() {
      if(!this.isPanelActive) {
        this.isPanelHovered = true;
      }
    },
    mouseLeave() {
      this.isPanelHovered = false;
    },
    clicked() {
      this.$emit("panelClicked");
    },
    outsideClick(event) {
      this.$emit("clickedOutside", event);
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

.icon, .shadow-icon {
  position absolute;
  pointer-events none;
  transition all 0.3s;
  z-index 10;
}

.shadow-icon {
  fill black;
  opacity 0;
  z-index 9;
}

.settings-blob {
  transition all 0.2s;
}

.panel-hover {
  transform scale(1.1);
  cursor pointer;
}
</style>