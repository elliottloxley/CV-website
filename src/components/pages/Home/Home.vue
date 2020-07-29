<template>
  <div class="home">
    <avatar-banner/>
    <page-banner title="Elliott Chisholm-Loxley" subtitle="my cv" description="description"/>
  </div>
</template>

<script>
import PageBanner from "@/components/pages/Home/HomeBanner";
import AvatarBanner from "@/components/pages/Home/HomeAvatar";

export default {
  name: "Home",
  components: {
    'page-banner': PageBanner,
    'avatar-banner': AvatarBanner
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

</style>