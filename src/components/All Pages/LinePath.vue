<template>
  <div v-if="this.parentDimensions[0] && this.parentDimensions[1]" class="line-path">
    <svg class="line-svg" preserveAspectRatio="none"  :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`">
      <defs>
        <radialGradient id="featherGradient">
          <stop offset="40%" stop-color="black" />
          <stop offset="100%" stop-color="white" />
        </radialGradient>
      </defs>
      <mask v-if="nodesToFeather.length > 0" x="0" y="0" maskUnits="userSpaceOnUse" width="100" height="100" :id="maskId">
        <rect :width="viewBoxWidth"
              :height="viewBoxHeight"
              fill="white"
              x="0"
              y="0"></rect>
          <rect class="node-feather"
                v-for="index in nodesToFeather"
                :key="index"
                :style="{transform: `scale(${customFeatherNodeScale[index] ? customFeatherNodeScale[index] : featherNodeScale})`}"
                fill="url(#featherGradient)"
                :x="pathCoords[index][0] - (featherNodeWidthHeight[0] / 2)"
                :y="pathCoords[index][1] - (featherNodeWidthHeight[1] / 2)"
                :width="featherNodeWidthHeight[0]"
                :height="featherNodeWidthHeight[1]"></rect>
      </mask>
      <path ref="linePath"
            :mask="nodesToFeather.length > 0 ? `url(#${maskId})` : ''"
            :d="svgPath"
            vector-effect="non-scaling-stroke"
            :stroke="lineColour"
            :stroke-width="lineWidth + 'px'"
            :stroke-linejoin="lineJoin"
            :style="{strokeDasharray: lineLength, strokeDashoffset: currentOffset,
                      transition: initialised ? `stroke-dashoffset ${animateTime}s ${showNodes ? 'linear' : transitionTimingFunction}` : ''}"></path>
    </svg>
      <div v-for="(node, index) in nodes"
           :key="index"
           class="node-container"
           :style="{left: `${node.coord[0]}%`, top: `${node.coord[1]}%`}">
        <slot :name="`nodeSlot${node.index}`">
            <transition appear name="node-grow">
              <svg :style="{width: nodeSize[0], height: nodeSize[1],
                   animationDelay: nodeAppearDelay}"
                   :viewBox="`${(-nodeStrokeWidth/2) - 1} ${(-nodeStrokeWidth/2) - 1}
                   ${100 + (nodeStrokeWidth) + 2} ${100 + (nodeStrokeWidth) + 2}`"
                   class="node-svg">
                <path
                    :d="nodePath"
                    :fill="nodeFillColour"
                    :stroke-width="nodeStrokeWidth"
                    stroke-linejoin="round"
                    :stroke="nodeStrokeColour"></path>
              </svg>
            </transition>
        </slot>
      </div>
  </div>
</template>

<script>
import pathingHelperFunctions from "@/mixins/pathingHelperFunctions";
import timingHelperFunctions from "@/mixins/timingHelperFunctions";
import uniqueId from "@/mixins/uniqueId";

export default {
  name: "LinePath",
  mixins: [uniqueId, pathingHelperFunctions, timingHelperFunctions],
  data() {
    return {
      transitionString: '',
      viewBoxWidth: 100,
      viewBoxHeight: 100,
      maskId: 'nodeMask' + this.getUniqueId(),
      nodes: [],
      animateStart: false,
      initialised: false
    }
  },
  props: {
    pathCoords: {required: true, type: Array}, //
    animateTime: {default: 1, type: Number}, //
    lineWidth: {default: 10, type:Number}, //
    parentDimensions: {required: true, type: Array}, //
    roundedCorners: {default: false, type:Boolean}, //
    lineColour: {default: 'white', type:String},
    lineJoin: {default: 'round', type:String},
    linePercent: {default: 1, type:Number},
    showNodes: {default: false, type:Boolean},
    excludedNodes: {default() {return []}, type:Array}, //node indexes on path
    nodeShape: {default() {return [[50,0],[100,50],[50,100],[0,50]]}, type: Array}, //
    nodeFillColour: {default: 'white', type: String}, //
    nodeSize: {default() {return ['20px','20px']}, type: Array}, //array of css sizes eg. ['10px','10%']
    nodeStrokeWidth: {default: 0, type: Number}, //
    nodeStrokeColour: {default: 'white', type: String}, //
    animateDelay: {default: 0.1, type: Number}, //
    nodeAppearDelay: {default: 0, type: Number}, //
    nodeAdvanceAppear: {default() {return {}}, type:Object}, //{'0': 0.5} {index : advance} index of node and advance in seconds
    transitionTimingFunction: {default: 'ease-in', type: String}, //set to linear automatically if nodes are shown
    nodesToFeather: {default() {return []}, type: Array}, //line will fade going into and out of nodes
    featherNodeRadius: {default: 3, type: Number}, //
    customFeatherNodeScale: {default() {return {}}, type: Object}, //{'0': 1.5} {index : scale}
    featherNodeScale: {default: 1, type:Number}, //
  },
  methods: {
    initialise() {
      setTimeout(() => {
        this.animateStart = true;
        if(this.showNodes) {
          this.initialiseNodes();
        }
      }, this.animateDelay * 1000);

      setTimeout(() => {this.initialised = true;}, 10);
    },
    getNodeDelayCumulative(nodeIndex) { //returns summed node delays up to index
      let delay = 0;

      for (let i = 1; i <= nodeIndex; i++) {

        let delayAdvance = this.getNodeAdvance(i);
        delay += this.getNodeDelay(i) - delayAdvance;
      }

      return delay;
    },
    getNodeAdvance(index) {
      if(this.nodeAdvanceAppear[index]) {
        return this.nodeAdvanceAppear[index];
      }
      return 0;
    },
    nodeShouldAppear(index) {
      return this.linePercent >= this.nodePercentages[index] && this.showNodes;
    },
    createNode(coord, index, delay) {
      setTimeout(() => {
        this.$emit("reachednode", index);
        this.nodes.push({index: index, coord: coord});
      }, (delay * 1000) );
    },
    initialiseNodes() {

      for (const index in this.nodeCoords) {
        let indexNum = parseInt(index);
        if(this.nodeShouldAppear(index)) {
          let delayAdvance = this.getNodeAdvance(indexNum);
          let delay = this.nodeDelays[indexNum] - delayAdvance;
          this.createNode(this.nodeCoords[index].slice(), indexNum, delay);
        }
      }
    },
    updateNodes() {
      this.nodes.splice(0);

      for (const index in this.nodeCoords) {
        let indexNum = parseInt(index);
        if(this.nodeShouldAppear(indexNum)) {
          this.createNode(this.nodeCoords[index], indexNum, 0);
        }
      }
    }
  },
  computed: {
    svgPath() {
      let path = `M${this.pathCoords[0][0]},${this.pathCoords[0][1]}`;

      for(let i = 1; i < this.pathCoords.length; i++) {
        path += `L${this.pathCoords[i][0]},${this.pathCoords[i][1]}`;
      }

      return path;
    },
    nodePath() {
      let path = `M${this.nodeShape[0][0]},${this.nodeShape[0][1]}`;

      for(let i = 1; i < this.nodeShape.length; i++) {
        path += `L${this.nodeShape[i][0]},${this.nodeShape[i][1]}`;
      }

      path += 'z'

      return path;
    },
    timePerPathSegment() {
      return this.getTimePerPathSegmentScaled(this.absolutePathCoords, this.lineLength, this.animateTime);
    },
    nodeDelays() {
      let total = 0;
      let nodeTimes = [0];

      for(let i = 0; i < this.timePerPathSegment.length; i++) {

        total += this.timePerPathSegment[i];
        nodeTimes.push(total);
      }

      return nodeTimes;
    },
    absolutePathCoords() {
      let coords = [];

      for(let i = 0; i < this.pathCoords.length; i++) {
        coords.push([(this.pathCoords[i][0] / 100) * this.parentDimensions[0],
                      (this.pathCoords[i][1] / 100) * this.parentDimensions[1]])
      }

      return coords;
    },
    lineLengthBeforeScale() {
      return this.pathDistance(this.pathCoords)
    },
    lineLength() {
      return this.lineLengthBeforeScale * this.scaleMultiplier;
    },
    currentOffset() {
      return (this.animateStart ? (this.lineLength * (1-this.linePercent)) : this.lineLength) - 0.01;
    },
    scaleMultiplier() {
      return Math.max(this.parentDimensions[0], this.parentDimensions[1]) / this.viewBoxWidth;
    },
    nodeCoords() {
      let coords = {};

      for (let i = 0; i < this.pathCoords.length; i++) {

        if(!this.excludedNodes.includes(i)) {
          coords[i] =  this.pathCoords[i].slice();
        }
      }

      return coords;
    },
    nodePercentages() {
      return this.getPercentDistanceOfEachNode(this.pathCoords);
    },
    scaledPathCoords() {

      let scaledCoords = [];

      for(let i = 0; i < this.pathCoords.length; i++) {
        scaledCoords.push([(this.pathCoords[i][0] * this.viewBoxWidth) / 100,(this.pathCoords[i][1] * this.viewBoxHeight) / 100]);
      }
      return scaledCoords;
    },
    featherNodeWidthHeight() {
      let radiusPercent = (this.featherNodeRadius / 1000);

      return [radiusPercent * this.parentDimensions[1], radiusPercent * this.parentDimensions[0]];
    }
  },
  mounted() {
    this.initialise();
  },
  watch: {
    linePercent() {
      this.updateNodes();
    },
    showNodes() {
      this.updateNodes();
    }
  }
}
</script>

<style lang="scss" scoped>

.line-svg {
  width: 100%;
  height: 100%;
}

.node-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  z-index: 100;
}

.node-svg {
  display: block;
}

.node-feather {
  transition: transform 0.5s;
  transform-origin: 50% 50%;
  transform-box: fill-box;
}

.node-transition-disable {
  animation: none !important;
}

.line-svg path {
  fill: none;
}

.node-grow-enter-active {
  animation: nodeAppearGrow 0.5s;
}

@keyframes nodeAppearGrow {
  0% {
    transform: rotate(-90deg) scale(0);
  }

  70% {
    transform: rotate(45deg) scale(1.3);
  }

  100% {
    transform: rotate(0deg) scale(1);
  }
}

</style>