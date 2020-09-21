<template>
  <div class="avatar-banner">
    <div class="avatar-container">
      <img class="avatar-img" :src="require('@/assets/profilepic.jpg')"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "AvatarBanner"
}
</script>

<style lang="stylus" type="text/stylus" scoped>

@import "../../themes/variables.styl"

.avatar-container {
  display flex;
  padding 4% 0 4% 0;
  align-items center;
  justify-content center;
  box-sizing border-box;
  background-clip content-box;
  height 100%;
}

.avatar-img {
  height: 33vmin;
  min-height: 100px;
  max-height: 180px;
  width: auto;
  border-radius: 50%;
  object-fit: cover;
}
</style>