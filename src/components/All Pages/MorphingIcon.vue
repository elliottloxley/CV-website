<template>
  <svg ref="parentSVG" fill="currentColor" :viewBox="`0 0 ${viewSize[0]}, ${viewSize[1]}`">
    <path :id="IconId" d="">
      <animate v-if="fromOrTo"
               ref="fromAnimation"
               :href="`#${IconId}`"
               attributeName="d"
               attributeType="XML"
               fill="freeze"
               :dur="durationFrom + 's'"
               :values="fromPathsString"></animate>
      <animate v-if="!fromOrTo"
               ref="toAnimation"
               :href="`#${IconId}`"
               attributeName="d"
               attributeType="XML"
               fill="freeze"
               :dur="durationTo + 's'"
               :values="toPathsString"></animate>
    </path>
  </svg>
</template>

<script>

import uniqueIdMixin from '@/mixins/uniqueId'

export default {
  name: 'MorphingIcon',
  mixins: [
    uniqueIdMixin
  ],
  props: {
    iconData: { required: true, type: Object },
    fromOrTo: { default: true, type: Boolean },
    fromToDuration: { default () { return [0.3, 0.3] }, type: Array }
  },
  data () {
    return {
      fromPaths: this.iconData.from,
      toPaths: this.iconData.to,
      viewSize: this.iconData.viewSize,
      durationFrom: this.fromToDuration[0],
      durationTo: this.fromToDuration[1],
      isStopped: true
    }
  },
  computed: {
    IconId () {
      return 'animatedIcon' + this.getUniqueId()
    },
    fromEndFrame () {
      return this.fromPaths[this.fromPaths.length - 1]
    },
    toEndFrame () {
      return this.toPaths[this.toPaths.length - 1]
    },
    fromPathsString () {
      return this.toEndFrame + ';' + this.fromPaths.join(';')
    },
    toPathsString () {
      return this.fromEndFrame + ';' + this.toPaths.join(';')
    }
  },
  watch: {
    fromOrTo () {
      this.$refs.parentSVG.setCurrentTime(0)
    }
  }
}

</script>

<style lang="stylus" type="text/stylus" scoped>

</style>
