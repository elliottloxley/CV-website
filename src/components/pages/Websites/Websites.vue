<template>
  <div class="websites">
    <div class="websites-container">
      <div class="grid-container">
        <grid-view data-url="api/getDummyData1.php"></grid-view>
      </div>
    </div>
  </div>
</template>

<script>
import GridView from "@/components/All Pages/Grid View/GridView";

export default {
  name: "Websites",
  components: {GridView}
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../../themes/variables.styl";

.websites {
  overflow auto;
  padding-bottom 5%;
}

.websites-container {
  margin-top 10vh;
}

.grid-container {
  width 80%;
  padding 20vh 5% 0 10%;
  box-sizing content-box;
}

::v-deep .highlight-external-modify {
  background-color websitesHighlightColour;
}

</style>