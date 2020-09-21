<template>
  <svg ref="parentSVG" :style="svgStyle" :viewBox="svgSize">
    <path @mouseleave="mouseLeave" @mouseenter="mouseEnter" @click="clicked" class="blob-path" :style="pathStyle" :id="generatedId" :d="staticPath">
      <animate v-if="!frozen" ref="toAnimation" :id="animationID" :href="'#' + generatedId" attributeName="d" attributeType="XML"
               :from="currentPathSVG" :to="pathToMoveToSVG" :dur="loopDuration + durationRandomised + 's'"
               fill="freeze"></animate>
    </path>
    <g v-if="testMode" class="test-visuals">
      <rect fill="red" width="10" height="10" v-for="coord in this.coords" :key="'' + coord.x + ''+ coord.y" :x="coord.x - 5" :y="coord.y -5"></rect>
    </g>
  </svg>
</template>

<script>

import uniqueIdMixin from "@/mixins/uniqueId";

export default {
name: "Blob",
  mixins: [
    uniqueIdMixin
  ],
  props: {
    aspectRatio: {default() {return [0.9, 0.9]}, type:Array,
      validator(value) {return !(value[0] > 1 || value[0] < 0 || value[1] > 1 || value[1] < 0); }},
    centerRatio: {default() {return [0.5, 0.5]}, type:Array},
    loopDuration: {default: 2, type: Number},
    vertexCount: {default: 10, type:Number, validator(value) { return value > 2 }},
    svgStyleUser: {default() {return {}}, type:Object},
    pathStyleUser: {default() {return {}}, type:Object},
    wiggleMagnitude: {default: 1, type:Number},
    propertyUpdateTime: {default: 0.3, type:Number},
    spinRate: {default: 0.15, type:Number},
    frozen: {default: false, type:Boolean},
    testMode: {default: false, type:Boolean},
    name: {default: "", type:String},
    shortText: {default: '', type:String}
  },
  data() {
    return {
      curveStrengthFactor: 4.5,
      currentPathSVG: "",
      pathToMoveToSVG: "",
      startPathSVG: "",
      viewSize: 1000,
      xRadius: (this.viewSize / 2) * this.aspectRatio[0],
      yRadius: (this.viewSize / 2) * this.aspectRatio[1],
      centerX: this.viewSize * this.centerRatio[0],
      centerY: this.viewSize * this.centerRatio[1],
      coords: [],
      durationChange: {changed:false, to: 0, from: 0},
      propertyChanged: true,
      joinOffset: 1,
      staticPath: ""
    }
  },
  computed: {
    generatedId() {
      return "blob" + this.getUniqueId();
    },
    animationID() {
      return "toAnimation" + this.getUniqueId();
    },
    defaultStyle() {
      return {fill: "hsl(0,0,0)", stroke: "hsl(0,0,0)", strokeWidth: 0};
    },
    svgSize() {
      let defaultSize = 1000;
      return `${((1 - this.aspectRatio[0] - 0.1) / 2) * defaultSize} ` +
              `${((1 - this.aspectRatio[1] - 0.1) / 2) * defaultSize} ` +
              `${(this.aspectRatio[0] + 0.1) * defaultSize} ` +
              `${(this.aspectRatio[1] + 0.1) * defaultSize}`;
    },
    pathStyle() {
      let style = {};
      return Object.assign(style, this.defaultStyle, this.pathStyleUser);
    },
    svgStyle() {
      let style = {};
      return Object.assign(style, this.defaultStyle, this.svgStyleUser);
    },
    vertexFactor() {
      return (2*Math.PI) / this.vertexCount;
    },
    durationRandomised() {
      let multiplier = 1;
      if(this.loopDuration < 0.2) {
        multiplier = 0;
      }
      return multiplier * (0.1 * (Math.floor(Math.random()*2) === 1 ? 1 : -1));
    }
  },
  methods: {
    clicked() {
      this.$emit("blobClicked", this.name)
    },
    mouseEnter() {
      this.$emit("blobMouseEnter", this.name)
    },
    mouseLeave() {
      this.$emit("blobMouseLeave", this.name)
    },
    generateCoords() {
      let pathArray = [];
      let count = 0;
      let averageRadius = (this.xRadius + this.yRadius) / 2;
      //moves round circular path, placing points at vertexFactor deg interval
      for (let i = this.joinOffset; i < 2*Math.PI + this.joinOffset; i += this.vertexFactor) {

        let x = ((this.xRadius + this.getRandomRadiusModifier(averageRadius)) * Math.cos(i) + this.centerX);
        let y = ((this.yRadius + this.getRandomRadiusModifier(averageRadius)) * Math.sin(i) + this.centerY);
        pathArray.push({x,y});
        if(count === this.vertexCount-1) {
          break;
        }
        count++;
      }
      return pathArray;
    },
    randomNegativePositive(val) {
      return val * (Math.floor(Math.random()*2) === 1 ? 1 : -1);
    },
    getRandomRadiusModifier(radius) {
      let num = Math.floor(Math.random() * (radius / 15)) + 1;
      num *= this.wiggleMagnitude;
      return this.randomNegativePositive(num);
    },
    generateSvgPath(coordArray) {
      let d = "";
      coordArray.forEach((coord, index, array) => {
        let p = [];
        if (index === 0) {
          d += `M${coord.x},${coord.y} `;
          p.push(array[array.length - 1]);
          p.push(array[index]);
          p.push(array[index+1]);
          p.push(array[index+2]);
        } else if (index === array.length - 2) {
          p.push(array[index-1]);
          p.push(array[index]);
          p.push(array[index+1]);
          p.push(array[0]);
        } else if (index === array.length - 1) {
          p.push(array[index-1]);
          p.push(array[index]);
          p.push(array[0]);
          p.push(array[1]);
        } else {
          p.push(array[index-1]);
          p.push(array[index]);
          p.push(array[index+1]);
          p.push(array[index+2]);
        }
        let bp = [];
        bp.push( { x: p[1].x,  y: p[1].y } );
        bp.push( { x: ((-p[0].x + this.curveStrengthFactor*p[1].x + p[2].x) / this.curveStrengthFactor), y: ((-p[0].y + this.curveStrengthFactor*p[1].y + p[2].y) / this.curveStrengthFactor)} );
        bp.push( { x: ((p[1].x + this.curveStrengthFactor*p[2].x - p[3].x) / this.curveStrengthFactor),  y: ((p[1].y + this.curveStrengthFactor*p[2].y - p[3].y) / this.curveStrengthFactor) } );
        bp.push( { x: p[2].x,  y: p[2].y } );
        d += "C" + bp[1].x + "," + bp[1].y + " " + bp[2].x + "," + bp[2].y + " " + bp[3].x + "," + bp[3].y + " ";

      })

      return d;
    },
    updateShapeValues() {
      this.xRadius = (this.viewSize / 2) * this.aspectRatio[0]
      this.yRadius = (this.viewSize / 2) * this.aspectRatio[1]
      this.centerX = this.viewSize * this.centerRatio[0]
      this.centerY = this.viewSize * this.centerRatio[1]
    },
    initialise() {
      this.updateShapeValues();

      this.currentPathSVG = this.generateSvgPath(this.generateCoords());
      this.joinOffset += this.randomNegativePositive(this.spinRate);
      this.pathToMoveToSVG = this.generateSvgPath(this.generateCoords());

      this.$refs.parentSVG.setCurrentTime(0);

      if(!this.frozen) {
        this.startAnimate();
      }
    },
    blobAnimate() {
      this.currentPathSVG = this.pathToMoveToSVG;
      this.$refs.parentSVG.setCurrentTime(0);
      this.joinOffset += this.randomNegativePositive(this.spinRate);
      let coords = this.generateCoords();
      this.pathToMoveToSVG = this.generateSvgPath(coords);

      if(this.testMode) {
        this.coords = coords;
      }

      this.$refs.toAnimation.beginElement();
    },
    startAnimate() {
      this.$refs.toAnimation.addEventListener('endEvent', this.blobAnimate);
    },
    endAnimate() {
      this.$refs.toAnimation.removeEventListener('endEvent', this.blobAnimate);
    }
  },
  updated() {
    if(this.durationChange.changed) {
      this.$refs.parentSVG.setCurrentTime(this.$refs.parentSVG.getCurrentTime() * this.durationChange.to / this.durationChange.from);
      this.durationChange.changed= false;
    }
  },
  mounted() {
    this.initialise();

    if(this.frozen) {
      this.staticPath = this.generateSvgPath(this.generateCoords());
    }
  },
  watch: {
    loopDuration(from, to) {
      this.durationChange.changed = true;
      this.durationChange.from = from + this.durationRandomised;
      this.durationChange.to = to + this.durationRandomised;
    },
    aspectRatio() {
      this.updateShapeValues();
      this.propertyChanged = true;

    },
    centerRatio() {
      this.updateShapeValues();
      this.propertyChanged = true;
    },
    frozen(from, to) {
      if(to) {
        this.staticPath = this.generateSvgPath(this.generateCoords());
        this.endAnimate();
      }
      else {
        this.staticPath = "";
        this.initialise()
      }
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

</style>