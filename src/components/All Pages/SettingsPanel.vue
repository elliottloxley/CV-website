<template>
  <div :style="{color: $root.currentTheme.text.base}"
       class="settings-panel">
    <blob-line @clickedOutside="outsideClick" @blobMouseEnter="mouseEnter" @blobMouseLeave="mouseLeave" v-on="!isPanelActive ? {blobClicked: clicked} : null"
               :class="{'panel-active' : isPanelActive, 'panel-hover' : isPanelHovered && !isPanelActive}"
               :path-style="{fill: $root.currentTheme.feature.base}"
               :start-point-user="[0.5,0]"
               :end-point-user="[1,0.5]"
               :curve-magnitude-normal="0.3"
               :edge-offset="0.2"
               :loop-duration="1.5"
               :wiggle-magnitude="1.5"
               :enable-detect-click-outside="true"
               class="settings-blob"></blob-line>
    <morphing-icon @click.native="clicked"
                   :from-or-to="!isPanelActive"
                   :class="{'close-active' : isPanelActive}"
                   class="settings-icon"
                   :icon-data="settingsIconData"
                   :from-to-duration="[0.2, 0.2]"></morphing-icon>
    <morphing-icon :from-or-to="!isPanelActive"
                   :class="{'close-shadow-active' : isPanelActive}"
                   class="shadow-icon"
                   :icon-data="settingsIconData"
                   :from-to-duration="[0.2, 0.2]"></morphing-icon>
  </div>
</template>

<script>

import BlobLine from "@/components/All Pages/BlobLine";
import IconPathData from "@/AnimatedIcon/IconPathData";
import 'vue-md-icons/src/icons/settings'
import MorphingIcon from "@/components/All Pages/MorphingIcon";

export default {
  name: "SettingsPanel",
  components: {
    MorphingIcon,
    BlobLine
  },
  data() {
    return {
      isPanelActive: false,
      isPanelHovered: false,
      settingsIconData: IconPathData.settingsToClose,
    }
  },
  methods: {
    mouseEnter() {
      this.isPanelHovered = true;
    },
    mouseLeave() {
      this.isPanelHovered = false;
    },
    clicked() {
      this.isPanelActive = !this.isPanelActive;
    },
    outsideClick() {
      this.isPanelActive = false;
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>
.settings-panel {
  width 10rem;
  height 10rem;
  position fixed;
  top 0;
  right 0;
  filter drop-shadow( 2px 3px 2px rgba(0, 0, 0, 0.7));
}

.settings-icon, .shadow-icon {
  position absolute;
  top 13%;
  right 13%;
  width 2rem;
  height 2rem;
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
  transform-origin top right;
  transform scale(1);
  transition all 0.2s;
}

.panel-hover {
  transform scale(1.1);
  cursor pointer;
}

.close-active {
  pointer-events all;
  transform rotate(-180deg);
}

.close-shadow-active {
  transform rotate(-180deg);
}

.close-active:hover {
  cursor pointer;
  transform rotate(-180deg);
}

.close-active:hover +.close-shadow-active {
  opacity 0.4;
  transform scale(1.1) translate(8%, 8%) rotate(-180deg);
}

.panel-hover ~.settings-icon {
  transform rotate(-90deg);
}

.panel-hover ~.shadow-icon {
  opacity 0.4;
  transform translate(8%, 8%) rotate(-90deg);
}

.panel-active {
  transform scale(3);
  transition all 0.3s;
}

</style>