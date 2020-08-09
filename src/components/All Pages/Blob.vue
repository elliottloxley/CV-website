<template>
  <div class="blob">
    <svg :viewBox="'0 0 ' + viewSize + ' ' + viewSize">
      <path :id="generatedId" fill="#ffffff" stroke-width="0" stroke="#000000" d="">
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
name: "Blob",
  mixins: [
    uniqueIdMixin
  ],
  props: {
    aspectRatio: {default() {return [0.5, 0.5]}, type:Array},
    centerRatio: {default() {return [0.5, 0.5]}, type:Array},
    loopDuration: {default: 2, type: Number}
  },
  data() {
    return {
      vertexFactor: 0.35,
      curveStrengthFactor: 4.5,
      pathToMoveToArray: [],
      currentPathSVG: "",
      pathToMoveToSVG: "",
      startPathSVG: "",
      viewSize: 1000,
      xRadius: (this.viewSize / 2) * this.aspectRatio[0],
      yRadius: (this.viewSize / 2) * this.aspectRatio[1],
      centerX: this.viewSize * this.centerRatio[0],
      centerY: this.viewSize * this.centerRatio[1]
    }
  },
  computed: {
    generatedId() {
      return "blob" + this.getUniqueId();
    }
  },
  methods: {
    generateCoords() {
      let pathArray = [];
      let joinOffset = 1; //to hide sharp join on edge of shape
      //moves round circular path, placing points at vertexFactor deg interval
      for (let i = joinOffset; i < 2*Math.PI + joinOffset; i += this.vertexFactor) {
        let x = ((this.xRadius + this.getRandomRadiusModifier(this.xRadius)) * Math.cos(i) + this.centerX);
        let y = ((this.yRadius + this.getRandomRadiusModifier(this.yRadius)) * Math.sin(i) + this.centerY);
        pathArray.push({x,y});
        if (i+this.vertexFactor >= 2*Math.PI + joinOffset) {
          pathArray.push(pathArray[0])
        }
      }
      return pathArray;
    },
    getRandomRadiusModifier(radius) {
      let num = Math.floor(Math.random() * (radius / 10)) + 1; //TODO change the *13 to proportion of radius
      num *= Math.floor(Math.random()*2) === 1 ? 1 : -1;
      return num
    },
    generateSvgPath(coordArray) {
      let d = "";
      coordArray.forEach((coord, index, array) => {
        let p = [];
        if (index === 0) {
          d += `M${coord.x},${coord.y} `;
          p.push(array[array.length - 3]);
          p.push(array[index]);
          p.push(array[index+1]);
          p.push(array[index+2]);
        } else if (index === array.length - 2) {
          p.push(array[index-1]);
          p.push(array[index]);
          p.push(array[index+1]);
          p.push(array[0]);
        } else if (index === array.length - 1) {
          return
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
    },
    updateShapeValues() {
      this.xRadius = (this.viewSize / 2) * this.aspectRatio[0]
      this.yRadius = (this.viewSize / 2) * this.aspectRatio[1]
      this.centerX = this.viewSize * this.centerRatio[0]
      this.centerY = this.viewSize * this.centerRatio[1]
    }
  },
  mounted() {
    this.updateShapeValues();
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