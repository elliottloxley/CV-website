<template>
  <div class="home">
    <blob-line :path-style="{fill: $root.currentTheme.background.highlight}"
               :start-point-user="[0,0.8]"
               :end-point-user="[0.8,0]"
               :curve-magnitude-normal="0.5"
               :edge-offset="0.2"
               :loop-duration="1.5"
               :wiggle-magnitude="1.5"
               class="highlight-blob"></blob-line>
    <div class="title">
      <blob :path-style-user="{fill: $root.currentTheme.feature.base}" :vertex-count="20" :aspect-ratio="[1, 0.5]"></blob>
    </div>
  </div>
</template>

<script>

import BlobLine from "@/components/All Pages/BlobLine";
import 'vue-md-icons/src/icons/home'
import 'vue-md-icons/src/icons/menu'
import 'vue-md-icons/src/icons/work'
import 'vue-md-icons/src/icons/person'
import 'vue-md-icons/src/icons/call'
import 'vue-md-icons/src/icons/clear'
import Blob from "@/components/All Pages/Blob";


export default {
  name: "Home",
  components: {
    Blob,
    BlobLine
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../../themes/variables.styl"

.highlight-blob {
  position absolute;
  top 0;
  left 0;
  width 30vmax;
  height 30vmax
}

</style>