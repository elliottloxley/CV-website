<template>
<div class="blob-button">
  <blob ref="buttonBlob" :wiggle-magnitude="1" :loop-duration="1.5" :path-style-user="blobStyle"
        :vertex-count="blobVertices"
        :frozen="blobStatic"
        :wiggleMagnitude="blobMagnitude"
        :enable-detect-click-outside="checkOutsideClick"
        @blobClicked="$emit('buttonClicked', name)" @clickedOutside="clickedOutside" @blobMouseLeave="onBlobMouseLeave" @blobMouseEnter="onBlobMouseEnter"
        :class="{'blob-hover-blob' : isBlobHover && !disableHoverGrow}" class="blob"></blob>
  <div :style="contentStyle" class="content-container">
    <div class="icon-container">
      <div :class="{'blob-hover-icon' : isBlobHover || showText}" class="icon-wrapper">
        <img v-if="useCustomIcon" :src="require('@/assets/buttonicons/' + navIconUrl + '')" alt="icon"/>
        <slot v-else></slot>
      </div>
    </div>
    <div :style="{fontSize: fontSize + 'rem'}" class="text-container">
      <transition name="text">
        <span :key="navText" :class="{'blob-hover-text' : isBlobHover || showText}" class="text">{{navText | capitilise}}</span>
      </transition>
    </div>
  </div>
</div>
</template>

<script>
import Blob from '@/components/old work/Blob'
export default {
  name: 'BlobButton',
  components: { Blob },
  props: {
    useCustomIcon: { default: false, type: Boolean },
    navIconUrl: { default: 'icon.svg', type: String },
    navText: { default: 'Default', type: String },
    name: { default: 'default', type: String },
    fontSize: { default: 1, type: Number },
    contentStyle: { default () { return {} }, type: Object },
    blobStyleUser: { default () { return {} }, type: Object },
    disableHoverGrow: { default: false, type: Boolean },
    showText: { default: false, type: Boolean },
    checkOutsideClick: { default: false, type: Boolean },
    blobStatic: { default: false, type: Boolean },
    blobVertices: { default: 8, type: Number },
    blobMagnitude: { default: 1, type: Number }
  },
  computed: {
    blobStyle () {
      const style = {}
      return Object.assign(style, { cursor: 'pointer' }, this.blobStyleUser)
    }
  },
  data () {
    return {
      isBlobHover: false
    }
  },
  methods: {
    onBlobMouseEnter () {
      this.$emit('buttonMouseEnter', name)
      this.isBlobHover = true
    },
    onBlobMouseLeave () {
      this.$emit('buttonMouseLeave', name)
      this.isBlobHover = false
    },
    clickedOutside (event) {
      this.$emit('clickedOutside', event)
    }
  },
  filters: {
    capitilise (val) {
      if (!val) return ''
      val = val.toString()
      return val.toUpperCase()
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

.blob-button {
  position: relative;
  display flex;
  justify-content center;
  align-items center;
}

.content-container {
  width 100%;
  height 100%;
  position relative;
  z-index 1;
  grid-gap 20px;
  pointer-events none;
}

.icon-container {
  position absolute;
  display flex;
  justify-content center;
  align-items center;
  top 0;
  left 0;
  width 100%;
  height 100%;
}

.icon-wrapper {
  position relative;
  width 35%;
  height 35%;
  transition 0.3s all;
}

.text-container {
  width 100%;
  height 100%;
  position absolute;
  align-self start;
  display flex;
  justify-content center;
  align-items center;
}

.text {
  opacity 0;
  position absolute;
  transition opacity 0.2s ease-out, transform 0.3s ease-in
}

.blob {
  top 0;
  position absolute;
  width 100%;
  height 100%;
  z-index 0;
  transform scale(1);
  transition all 0.3s;
}

.blob-hover-blob {
  animation blob-hover-animation 0.4s;
  transform scale(1.1);
  transition all 0.4s;
}

.blob-hover-text {
  opacity 1;
  transition all 0.3s;
  transform translateY(100%);
}

.blob-hover-icon {
  transform translateY(-40%) scale(0.75);
  transition all 0.3s;
}

.text-enter-active {
  animation blob-text-enter 0.3s
}

.text-leave-active {
  animation blob-text-leave 0.3s;
}

@keyframes blob-hover-animation {
  from {
    transform scale(1);
  }
  30% {
    transform scale(1.15);
  }
  to {
    transform scale(1.1);
  }
}

@keyframes blob-text-leave {
  from {
    opacity 1;
    transform translateY(100%);
  }
  80% {
    opacity 0;
  }
  to {
    opacity 0;
    transform translateY(0%);
  }
}

@keyframes blob-text-enter {
  from {
    transform translateY(150%);
    opacity 0;
  }
  to {
    transform translateY(100%);
    opacity 1;
  }
}

</style>
