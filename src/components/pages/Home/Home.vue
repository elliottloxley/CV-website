<template>
  <div class="home">
    <blob-line class="test-blob"></blob-line>
    <blob class="test-blob2"></blob>
  </div>
</template>

<script>

import BlobLine from "@/components/All Pages/Grid View/BlobLine";
import Blob from "@/components/All Pages/Blob";
export default {
  name: "Home",
  components: {
    Blob,
    BlobLine,
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../../themes/variables.styl"

.home {
  height 95vh;
  position absolute;
  bottom 0;
  width 100%;
  -webkit-font-smoothing antialiased;
  -moz-osx-font-smoothing grayscale;
  text-align center;
  color miscTextColour;
  display grid;
  grid-gap 0;
  grid-template-rows 1fr 1fr 0.8fr;
}

.test-blob, .test-blob2 {
  width 50vh;
  height 50vh;
}

.test-blob2 {
}

</style>