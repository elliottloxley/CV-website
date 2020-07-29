<template>
  <div class="home-banner">
    <div class="text-container">
      <div class="title">
        {{ title }}
      </div>
      <div class="subtitle">
        {{ subtitle }}
      </div>
      <div class="description">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "PageBanner",
  props: {
    title: String,
    subtitle: String,
    description: String
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../../themes/variables.styl";

.text-container {
  gradientCenter(homePageBaseColour, homePageBannerColour, 0%);
  padding 1% 0;
}

.title {
  font-size: 2rem;
}

.subtitle {
  font-size: 1.2rem;
}

.description {
  font-size: 1rem;
}
</style>