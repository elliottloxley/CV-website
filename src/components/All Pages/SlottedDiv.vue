<template>
<div class="slotted-div">
  <div class="background-container"
  :style="{pointerEvents: disablePointerBackground ? 'none' : ''}">
    <slot name="background-content">
    </slot>
  </div>
  <div class="foreground-container"
       :style="{pointerEvents: disablePointerForeground ? 'none' : ''}">
    <slot name="foreground-content">
    </slot>
  </div>
</div>
</template>

<script>
export default {
name: "SlottedDiv",
  props: {
    disablePointerForeground: {default: false, type:Boolean},
    disablePointerBackground: {default: false, type:Boolean}
  }
}
</script>

<style lang="scss" scoped>

.slotted-div {
  position: relative;
  z-index: 0;
}

.background-container, .foreground-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.background-container {
  z-index: -1;
}

.foreground-container {
  z-index: 1;
}

</style>