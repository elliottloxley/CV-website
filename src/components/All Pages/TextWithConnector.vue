<template>
<div :class="{[alignmentClass] : true}" class="text-with-connector">
  <div class="connector-path-container"
       ref="parent"
       :style="gapObject">
    <line-path class="connector"
               @reachedlastnode="displaySlot = true"
               :parent-dimensions="parentDimensions"
               :show-nodes="true"
               :line-colour="connectorStroke"
               :excluded-nodes="[0]"
               :node-size="nodeSize"
               :node-fill-colour="connectorStroke"
               :animate-time="lineAppearTime"
               :animate-delay="lineAppearDelay"
               :transition-timing-function="'ease-in'"
               :line-width="1.5"
               :path-coords="connectorPath">
    </line-path>
  </div>
  <transition appear name="connector-node">
    <svg class="connector-node" viewBox="0 0 100 100" >
      <circle r="45" cx="50" cy="50" :stroke="connectorStroke" :stroke-width="connectorStrokeWidth" :fill="connectorFill"></circle>
    </svg>
  </transition>
  <div class="spacer"></div>
  <transition appear :name="textEnterClass">
    <div v-if="displaySlot" class="connector-text">
      <slot name="content">
        default
      </slot>
    </div>
  </transition>
  <div class="spacer-sm"></div>
  <transition appear name="after-node">
    <svg v-if="displaySlot" class="after-node" viewBox="-1 -1 102 102" :style="{width: nodeSize[0], height: nodeSize[1]}">
      <path d="M50,0L100,50L50,100L0,50z" :fill="connectorStroke" stroke-linejoin="round"></path>
    </svg>
  </transition>
</div>
</template>

<script>
import LinePath from '@/components/All Pages/LinePath'
export default {
  name: 'TextWithConnector',
  components: { LinePath },
  data () {
    return {
      parentDimensions: [],
      nodeSlotNode: 'nodeSlot0',
      nodeSlotText: 'nodeSlot1',
      displaySlot: false,
      nodeSize: ['8px', '8px']
    }
  },
  props: {
    entryDirection: {
      default: 'left',
      type: String,
      validator (value) {
        return value.toLowerCase() === 'left' ||
                                                    value.toLowerCase() === 'top' ||
                                                    value.toLowerCase() === 'bottom' ||
                                                    value.toLowerCase() === 'right'
      }
    }, //
    connectorGap: { default: 20, type: Number }, // gap between connector and text in percent
    enableEnterAnimation: { default: true, type: Boolean }, //
    contentDistance: { default: 15, type: Number }, //
    connectorFill: { default: 'white', type: String }, //
    connectorStroke: { default: 'white', type: String }, //
    connectorStrokeWidth: { default: 10, type: Number }, //
    lineAppearTime: { default: 0.5, type: Number }, //
    lineAppearDelay: { default: 0.1, type: Number } //
  },
  computed: {
    connectorPath () {
      switch (this.formattedDirection) {
        case 'left':
          return [[0, 50], [100, 50]]
        case 'right':
          return [[100, 50], [0, 50]]
        case 'top':
          return [[50, 0], [50, 100]]
        case 'bottom':
          return [[50, 100], [50, 0]]
      }

      return []
    },
    gapObject () {
      const key = this.formattedDirection === 'left' || this.formattedDirection === 'right' ? 'width' : 'height'
      return { [key]: `${this.connectorGap}px` }
    },
    alignmentClass () {
      return 'from-' + this.formattedDirection
    },
    textEnterClass () {
      return `connector-${this.formattedDirection}-text`
    },
    formattedDirection () {
      return this.entryDirection.toLowerCase()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.parentDimensions = [this.$refs.parent.offsetWidth, this.$refs.parent.offsetHeight]
    })
  }
}
</script>

<style lang="scss" scoped>

.text-with-connector {
  display: flex;
}

.from-left {
  align-items: center;
  flex-direction: row;
  transform: translateX(50%);
}

.from-right {
  align-items: center;
  flex-direction: row-reverse;
  transform: translateX(-50%);
}

.from-top {
  justify-content: center;
  flex-direction: column;
  transform: translateY(50%);
}

.from-bottom {
  justify-content: center;
  flex-direction: column-reverse;
  transform: translateY(-50%);
}

.from-left .connector-node {
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%) scale(1);
}

.from-right .connector-node {
  top: 50%;
  right: 0;
  transform: translate(50%, -50%) scale(1);
}

.from-top .connector-node {
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
}

.from-bottom .connector-node {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%) scale(1);
}

.spacer {
  width: 17px;
  height: 10px;
}

.spacer-sm {
  width: 13px;
  height: 8px;
}

.connector-text {
  opacity: 1;
  text-align: center;
  background-color: rgba(0,0,0,0.7);
  transition: transform 1s 0.1s, opacity 0.8s 0.1s;
}

.connector-path-container {
  min-height: 3px;
  min-width: 3px;
}

.connector-node {
  position: absolute;
  width: 12px;
  height: 12px;
  transition: transform 0.5s;
}

.connector {
  display: flex;
  width: 100%;
  height: 100%;
}

.after-node {
  transition: transform 0.5s 0.8s;
}

.after-node-enter {
  transform: rotate(-180deg) scale(0.1);
}

.connector-node-enter {
  transform: translate(-50%,-50%) scale(0.1) !important;
}

$translateMagnitude: 5%;

.connector-left-text-enter {
  opacity: 0;
  transform: translateX(-$translateMagnitude);
}

.connector-top-text-enter {
  opacity: 0;
  transform: translateY(-$translateMagnitude);
}

.connector-right-text-enter {
  opacity: 0;
  transform: translateX($translateMagnitude);
}

.connector-bottom-text-enter {
  opacity: 0;
  transform: translateY($translateMagnitude);
}

</style>
