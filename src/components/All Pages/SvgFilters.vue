<template>
  <svg style="display:none">
    <defs>
      <filter id="connectElements">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
      </filter>
    </defs>
  </svg>
</template>

<script>
export default {
name: "SvgFilters"
}
</script>

<style lang="stylus" type="text/stylus" scoped>

</style>