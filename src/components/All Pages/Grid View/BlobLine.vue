<template>
  <div class="blob">
    <svg :viewBox="'0 0 ' + viewX + ' ' + viewY">
      <path :id="generatedId" fill="#ffffff" stroke-width="0.5" stroke="#000000" d="">
        <animate ref="toAnimation" id="movingTo" :href="'#' + generatedId" attributeName="d" attributeType="XML"
                 :from="currentPathSVG" :to="pathToMoveToSVG" :dur="loopDuration + 's'"
                 fill="freeze"></animate>
      </path>
    </svg>
  </div>
</template>

<script>

import uniqueIdMixin from "@/mixins/uniqueId";

export default {
  name: "BlobLine",
  mixins: [
    uniqueIdMixin
  ],
  props: {
    vertexFactor: {default:0.1, type:Number},
    aspectRatio: {default() {return [1, 1]}, type:Array},
    loopDuration: {default: 2, type: Number},
    curveMagnitudeY: {default: -0.5, type:Number},
    curveOffsetY: {default:0.25, type:Number},
    controlOffset1: {default:0, type:Number},
    controlOffset2: {default:0, type:Number},
  },
  data() {
    return {
      curveStrengthFactor: 4.5,
      pathToMoveToArray: [],
      currentPathSVG: "",
      pathToMoveToSVG: "",
      startPathSVG: "",
      viewSize: 1000
    }
  },
  computed: {
    generatedId() {
      return "blobLine" + this.getUniqueId();
    },
    calculatedHeight() {
      return this.viewY * (1 - this.curveOffsetY);
    },
    curve() {
      let controlYFactor = 0.5 * this.curveMagnitudeY;
      let controlXFactor = 0.25;
      return {startPoint:{x : 0, y : this.calculatedHeight},
              endPoint:{x : this.viewX,y : this.calculatedHeight},
              control1:{x : this.viewX * (controlXFactor + this.controlOffset1),y : this.calculatedHeight * (1 + controlYFactor)},
              control2:{x : this.viewX * ((1-controlXFactor) + this.controlOffset2),y : this.calculatedHeight * (1 + controlYFactor)}};
    },
    viewX() {
      return this.viewSize * this.aspectRatio[0];
    },
    viewY() {
      return this.viewSize * this.aspectRatio[1];
    }
  },
  methods: {
    getBezierFactors(bezierLocation) {
      let bezFactor0 = Math.pow((1 - bezierLocation), 3);
      let bezFactor1 = 3 * bezierLocation * Math.pow((1 - bezierLocation), 2);
      let bezFactor2 = 3 * (Math.pow(bezierLocation, 2)) * (1 - bezierLocation);
      let bezFactor3 = Math.pow(bezierLocation, 3);

      return [bezFactor0, bezFactor1, bezFactor2, bezFactor3];
    },
    generateCoords() {
      let pathArray = [];

      //algorithm for generating points along a bezier
      for (let loc = this.vertexFactor; loc < 1-this.vertexFactor; loc += this.vertexFactor) {

        let bezFactors = this.getBezierFactors(loc);

        let x = (bezFactors[0] * this.curve.startPoint.x) +
                (bezFactors[1] * this.curve.control1.x) +
                (bezFactors[2] * this.curve.control2.x) +
                (bezFactors[3] * this.curve.endPoint.x)
        let y = (bezFactors[0] * this.curve.startPoint.y) +
                (bezFactors[1] * this.curve.control1.y) +
                (bezFactors[2] * this.curve.control2.y) +
                (bezFactors[3] * this.curve.endPoint.y)

        y += this.getRandomModifier();

        pathArray.push({x,y});
      }

      return pathArray;
    },
    getRandomModifier() {
      let num = Math.floor(Math.random() * (this.viewY / 20)) + 1;
      num *= Math.floor(Math.random()*2) === 1 ? 1 : -1;
      return num
    },
    generateSvgPath(coordArray) {
      let d = `M${this.curve.endPoint.x},${this.curve.endPoint.y} v-${this.calculatedHeight} h-${this.viewX} v${this.calculatedHeight} `;
      coordArray.forEach((coord, index, array) => {
        let p = [];
        if (index === 0) {
          p.push({x : this.curve.startPoint.x, y : this.curve.startPoint.y});
          p.push(array[index]);
          p.push(array[index+1]);
          p.push(array[index+2]);
        } else if (index === array.length - 2) {
          p.push(array[index-1]);
          p.push(array[index]);
          p.push(array[index+1]);
          p.push({x : this.curve.endPoint.x, y : this.curve.endPoint.y});
        } else if (index === array.length - 1) {
          p.push(array[index-1]);
          p.push(array[index]);
          p.push({x : this.curve.endPoint.x, y : this.curve.endPoint.y});
          p.push({x : this.curve.endPoint.x, y : this.curve.endPoint.y});
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
    generateSVG() {
      this.startPathSVG = this.generateSvgPath(this.generateCoords());
      this.currentPathSVG = this.startPathSVG;
      this.pathToMoveToSVG = this.generateSvgPath(this.generateCoords());
    }
  },
  mounted() {
    this.generateSVG();
    this.$refs.toAnimation.addEventListener('endEvent', () => {
      this.currentPathSVG = this.pathToMoveToSVG;
      this.startPathSVG = this.pathToMoveToSVG;
      this.pathToMoveToSVG = this.generateSvgPath(this.generateCoords());
      this.$refs.toAnimation.beginElement();
    })
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

.blob {
  width 30vw;
  height 30vw;
}

</style>