<template>
<div class="test-hex-grid">
  <svg :viewBox="canvasDimensions">
    <g>
      <hex hex-id="hex" v-for="coord in hexGridCoords" :key="coord['id']"
           :hex-x-offset="coord['realCoords'][0]" :hex-y-offset="coord['realCoords'][1]"
           :base-hex-points="baseHexPoints"
           :internal-size="[hexSize, hexSize]"></hex>
    </g>
  </svg>
</div>
</template>

<script>

import Hex from "@/components/All Pages/hex";
export default {
  name: "TestHexGrid",
  components: {Hex},
  data() {
    return {
      coordsMultipliers: [[0.5, 0], [0.066987298, 0.25], [0.066987298, 0.75], [0.5, 1], [0.933012702, 0.75], [0.933012702, 0.25]],
      hexGridCoords: [],
      widthMultiplier: 0.8660254,
      largestX:0,
      largestY:0
    }
  },
  props: {
    hexSize: Number,
    hexColumns: Number,
    hexRows: Number,
    hexGap: Number
  },
  computed: {
    hexWidth() {
      return this.hexSize * this.widthMultiplier;
    },
    hexHeightForGrid() {
      return this.hexSize * 0.75 ;
    },
    canvasDimensions() {
      return "0 0 " + this.largestX + " " + this.largestY;
    },
    startXOffset() {
      return -(this.hexSize - this.hexWidth) / 2;
    },
    baseHexPoints() {
      let hexCoords = [];

      for(const index in this.coordsMultipliers) {
        hexCoords.push([(this.coordsMultipliers[index][0] * this.hexSize), (this.coordsMultipliers[index][1] * this.hexSize)]);
      }
      return hexCoords;
    },
    oddXOffset() {
      return this.hexWidth / 2;
    }
  },
  methods: {
    calculateHexCoords() {
      let coords = [];
      let id = 0;
      let largestX = 0;
      let largestY = 0;
      for(let xGridCoord = 0; xGridCoord < this.hexColumns; xGridCoord++) {
        for(let yGridCoord = 0; yGridCoord < this.hexRows; yGridCoord++) {

          let realXCoord = (xGridCoord * this.hexWidth) + this.startXOffset;
          let realYCoord = (yGridCoord * this.hexHeightForGrid);

          if(yGridCoord & 1) { //is odd
            realXCoord += this.oddXOffset;
          }

          if(realXCoord + this.hexSize > largestX) {
            largestX = realXCoord + this.hexSize;
          }

          if(realYCoord + this.hexSize > largestY) {
            largestY = realYCoord + this.hexSize;
          }

          coords.push({"gridCoords" : [xGridCoord, yGridCoord],
            "realCoords" : [realXCoord, realYCoord],
            "id" : id});

          id++;
        }
      }
      this.hexGridCoords = coords;
      this.largestX = largestX + this.startXOffset;
      this.largestY = largestY;
    }
  },
  mounted() {
    this.calculateHexCoords();
  }
}

</script>

<style lang="stylus" type="text/stylus" scoped>

.test-hex-grid {
  margin 1vw;
  width 30vw;
  height 30vw;
}

</style>