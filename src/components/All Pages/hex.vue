<template>
    <svg :x="hexXOffset" :y="hexYOffset"
         :width="internalSize[0]" :height="internalSize[1]"
         :viewBox="internalViewbox">
      <polygon class="hex-cell" fill="#ffffff" stroke="#000000" stroke-width="0.5" :points="points" />
    </svg>
</template>

<script>
export default {
  name: "hex",
  props: {
    hexId: String,
    hexXOffset: Number,
    hexYOffset: Number,
    baseHexPoints: Array,
    internalSize: Array
  },
  computed: {
    translateVector() {
      return "translate(" + this.hexXOffset + " " + this.hexYOffset + ")"
    },
    translatedPoints() {
      let coordsString = "";

      for(const coord in this.baseHexPoints) {
        coordsString += (this.baseHexPoints[coord][0] + this.hexXOffset) + "," +
            (this.baseHexPoints[coord][1] + this.hexYOffset) + " ";
      }
      return coordsString;
    },
    points() {
      let coordsString = "";

      for(const coord in this.baseHexPoints) {
        coordsString += this.baseHexPoints[coord][0] + "," +
            this.baseHexPoints[coord][1]+ " ";
      }
      return coordsString;
    },
    internalViewbox() {
      return "0 0 " + this.internalSize[0] + " " + this.internalSize[1];
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

.hex-cell:hover {
  fill black;
  transition all 0.5s;
  transform scale(1.2);
  transform-origin 50% 50%;
}

svg:hover{

}

</style>