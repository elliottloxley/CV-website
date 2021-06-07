<template>
<div ref="particleParent" class="path-preview">
  <particle v-for="particleID in particleList"
            :key="particleID"
            :id="particleID"
            :start-point3d="[particlePath[0][0], particlePath[0][1], 0]"
            :parent-dimensions="parentDimensions()"
            :lifetime="pathTime"
            :width-height="[5,5]"
            :start-colour="'rgba(255,255,255,0.5)'"
            :end-colour="'rgba(255,255,255,0.5)'"
            :enable-path-mode="true"
            :path-coords="particlePath"
            :transition-timing-function="'linear'"
            :enable-path-consistent-speed="true"
            :consistent-speed-path-time="pathTime">
  </particle>
</div>
</template>

<script>
import Particle from "@/components/All Pages/Particle";

export default {
name: "PathPreview",
  components: {Particle},
  data() {
    return {
      particleList: [],
      intervalHandle: null,
      lastID: 0
    }
  },
  props: {
    activated: {default: false, type: Boolean}, //
    path: {required: true, type: Array}, //
    pathTime: {default: 1, type: Number}, //
    perSpawn: {default: 1, type: Number}, //
    timeBetween: {default: 0.1, type: Number}, //time between perSpawn particles, does not effect spawn speed
    spawnSpeed: {default: 1, type: Number}, //
  },
  methods: {
    startSpawning() {
      this.spawn(this.perSpawn);

      this.intervalHandle = setInterval(() => {
        this.spawn(this.perSpawn);
      }, 1000 / this.spawnSpeed);
    },
    stopSpawning() {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    },
    getID() {
      this.lastID++;
      return this.lastID - 1;
    },
    spawn(amount=1) {

      for(let i = 0; i < amount; i++) {

        setTimeout(() => {
          this.particleList.unshift(this.getID()); //adds particle to front of array

          setTimeout(() => {
            this.particleList.pop();
          }, (this.pathTime * 1000)); //deletes particle from array at end of lifetime

        }, this.timeBetween * i * 1000);
      }
    },
    parentDimensions() {
      return [this.$refs.particleParent.clientWidth,
        this.$refs.particleParent.clientHeight, 0];
    },
  },
  computed :{
    particlePath() {
      let tempPath = [];

      for(let i = 0; i < this.path.length; i++) {
        tempPath.push([this.path[i][0], this.path[i][1], 0]);
      }

      return tempPath;
    }
  },
  watch: {
    activated(val) {
      if(val) {
        this.startSpawning();
      } else {
        this.stopSpawning();
      }
    }
  },
  mounted() {
  if(this.activated)
    this.startSpawning();
  }
}
</script>

<style lang="scss" scoped>

</style>