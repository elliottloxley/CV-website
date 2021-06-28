<template>
<div ref="particleParent" class="particle-cloud"
     :style="{filter: enableMergeFilter ? 'url(#connectElementsSmall)' : '',
     perspective: `${parentPerspective}px`,
     perspectiveOrigin: perspectiveOrigin}">
  <transition-group
    appear
    :enter-class="appearClass"
    :leave-active-class="leaveActiveClass">
    <particle v-for="particle in particleCoords"
              class="particle"
              :id="particle.id"
              :use-fixed-positioning="particleUseFixedPositioning"
              :key="particle.id"
              :width-height="[particleWidth, particleHeight]"
              :start-point3d="startPoint(particle)"
              :end-point3d="endPoint(particle)"
              :lifetime="particle.lifetime"
              :enable-drift-mode="enableParticleDriftMode"
              :transition-timing-function="transitionTimingFunction"
              :move-time="particleMoveTime"
              :hang-time="particleHangTime"
              :start-colour="particleStartColour"
              :end-colour="particleEndColour"
              :colour-time="particleColourTime"
              :drift-max-magnitude="particleDriftMaxMagnitude"
              :drift-interval="particleDriftInterval"
              :drift-timing="particleDriftTiming"
              :enter-exit-transition-timing="particleEnterExitTiming"
              :parent-dimensions="[toPixelsWidth(100), toPixelsHeight(100), toPixelsDepth(100)]">
    </particle>
  </transition-group>
</div>
</template>

<script>
import uniqueIdMixin from "@/mixins/uniqueId";
import Particle from "@/components/All Pages/Particle";

export default {
name: "ParticleCloud",
  components: {Particle},
  mixins: [
    uniqueIdMixin
  ],
  data() {
    return {
      currentStep: 0,
      particleCoords: [],
      intervalHandle: null,
      minAngle: this.toRadians(this.spawnInRange[0]),
      maxAngle: this.toRadians(this.spawnInRange[1]),
      parentPerspective: 0
    }
  },
  props: {
    enableRandomSteps: {default: false, type:Boolean},
    enableRandomMagnitude: {default: false, type:Boolean},
    enableRandomDepth: {default: false, type:Boolean},
    enableRandomSpawning: {default: false, type:Boolean}, //overrides all spawning to spawn particles randomly in radius
    enableParticleDriftMode: {default: false, type:Boolean}, //overrides normal movement, instead particles drift randomly
    enableFadeOut: {default: false, type: Boolean},
    enableShrinkOut: {default: false, type: Boolean},
    enableFadeIn: {default: false, type: Boolean},
    enableShrinkIn: {default: false, type: Boolean},
    maxParticles: {default: 200, type:Number},
    lifetimeVariance: {default: 0, type: Number}, //
    keepMaxParticlesExact: {default: false, type:Boolean}, //overrides spawning amount rules to keep the exact number of max particles on screen at once
    spawnSpeed: {default: 1, type:Number}, //spawns x per second
    perSpawn: {default: 1, type: Number}, //particles to spawn per cycle
    spawnInRange: {default() {return [0,360];}, type: Array},
    enableSpawnInBoundingBox: {default: false, type: Boolean}, //overrides all spawning mechanics to spawn randomly in parent boundaries
    hangTime: {default: 0, type: Number}, //delay before blob moves as proportion of lifetime
    timeBetweenPerSpawns: {default: 0, type:Number, validator(val) {return val <= 0.5}},
    particleLifeTime: {default: 0.5, type: Number}, //time before particle is removed in seconds
    particleMoveTime: {default: 0.5, type: Number},         //{ ---<>---
    particleHangTime: {default: 0, type: Number},         //{
    particleDriftMaxMagnitude: {default: 0.1, type:Number}, //{ all in percentage of lifetime
    particleDriftInterval: {default: 0.1, type:Number},     //{
    particleDriftTiming: {default: 0.1, type:Number},       //{ ---<>---
    particleEnterExitTiming: {default: 0.5, type: Number}, //timing of enter / exit transitions in seconds
    particleStep: {default: 0.1, type: Number}, //percentage of circle
    particleWidth: {default: 10, type: Number},
    particleHeight: {default: 10, type: Number},
    particleUseFixedPositioning: {default: false, type: Boolean}, //
    enableDirectionReverse: {default: false, type: Boolean},
    endPosition: {default() {return [50, 50, 50]}, type:Array}, //end position of particle in percent
    centerPosition: {default() {return [50,50, 50]}, type: Array},
    zAxisMax: {default:100, type:Number}, //z axis depth as percentage width
    zAxisMin: {default:-100, type:Number}, //z axis depth as percentage width
    perspectiveOrigin: {default: 'center', type:String},
    particleStartColour: {default: "white", type: String},
    particleEndColour: {default:"white", type: String},
    particleColourTime: {default: 0, type:Number}, //in percent of life
    radius: {default: 45, type:Number},
    enabled: {default: true, type:Boolean},
    enableMergeFilter: {default: false, type:Boolean}, //enables svg filter to merge close particles, does not work well on very small or very large particles: (15-40px is good range)
    variantPointDistance: {default:0, type:Number}, //adds random variance to distance between points (max == 2*PI)
    transitionTimingFunction: {default: 'ease-out', type:String},
  },
  computed: {
    angleDifference() {
      return this.maxAngle - this.minAngle;
    },
    stepSize() {
      return this.angleDifference * this.particleStep;
    },
    appearClass() {
      if(this.enableFadeIn) {
        return 'appear-fade-in';
      }

      if(this.enableShrinkIn) {
        return 'appear-grow';
      }

      return '';
    },
    leaveActiveClass() {
        if(this.enableFadeOut) {
          return 'leave-active-fade-out';
        }

        if(this.enableShrinkOut) {
          return 'leave-active-shrink';
        }

        return '';
    }
  },
  methods: {
    endPoint(particle) {
      if(!this.enableParticleDriftMode) {
        return [this.toPixelsWidth(particle.endX), this.toPixelsHeight(particle.endY), this.toPixelsDepth(particle.endZ)];
      }
      else {
        return [0,0,0];
      }
    },
    radiusInPixels() {
      return (this.radius / 100) * this.toPixelsWidth();
    },
    startPoint(particle) {
      return [this.toPixelsWidth(particle.startX), this.toPixelsHeight(particle.startY), this.toPixelsDepth(particle.startZ)];
    },
    randomNegativePositive(val) {
      return val * (Math.floor(Math.random()*2) === 1 ? 1 : -1);
    },
    randomBetweenValues(min, max) {
      return Math.random() * (max - min) + min;
    },
    randomNegativePositiveRange(range) {
      return this.randomNegativePositive(Math.random() * range);
    },
    getRandomRadiusModifier(radius) {
      let num = Math.floor(Math.random() * (radius / 15)) + 1;
      return this.randomNegativePositive(num);
    },
    toRadians(degrees) {
      return (Math.PI / 180) * degrees;
    },
    toDegrees(radians) {
      return (180 / Math.PI) * radians;
    },
    getRadialPoint(radialPosition, magnitude = 1) {

      let alteredRadius = this.radius * magnitude;

      let x = (alteredRadius * Math.cos(radialPosition) + this.centerPosition[0]);
      let y = (alteredRadius * Math.sin(radialPosition) + this.centerPosition[1]);

      return {x:x, y:y};
    },
    startSpawning() {
      if(!this.keepMaxParticlesExact) {
        this.intervalHandle = setInterval(() => {
          this.spawnOnTimer(this.perSpawn, this.timeBetweenPerSpawns);
        }, 1000 / this.spawnSpeed);
      }
      else {
        this.intervalHandle = setInterval(() => {
          if(this.maxParticles > this.particleCoords.length) {
            this.spawnOnTimer(this.maxParticles - this.particleCoords.length, this.timeBetweenPerSpawns);
          }
        }, 200);
      }
    },
    containedInAngleRange(value) {
      return (value >= this.spawnInRange[0] && value <= this.spawnInRange[1]);
    },
    stopSpawning() {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    },
    spawnSingle() {
      if (this.particleCoords.length < this.maxParticles) {
        let coord = this.getNextParticle();
        if (coord) {
          this.particleCoords.unshift(coord); //adds particle to front of array
        }

        setTimeout(() => {
          this.particleCoords.pop();
        }, (coord.lifetime * 1000) - (this.particleEnterExitTiming * 1000)); //deletes particle from array at end of lifetime
      }
    },
    spawn(amount=1) {
      for (let i = 0; i < amount; i++) {
        this.spawnSingle();
      }
    },
    spawnOnTimer(amount, timePer) {
      if(this.timeBetweenPerSpawns !== 0) {
        for (let i = 0; i < amount; i++) {
          setTimeout(() => {
            this.spawnSingle()
          }, timePer * i * 1000)
        }
      }
      else {
        this.spawn(amount);
      }
    },
    getNextParticle() {

      let tempLifetime = this.particleLifeTime + this.randomNegativePositive(this.particleLifeTime * this.randomBetweenValues(0,this.lifetimeVariance));

      if(!this.enableSpawnInBoundingBox) {

        let coord = {}
        let step = 0;
        let magnitude = 1;
        let depth = 0;

        if (!this.enableRandomSpawning) {
          if (this.enableRandomSteps) {
            step = this.randomBetweenValues(this.minAngle, this.maxAngle);
          } else {
            step = this.currentStep;
            this.currentStep += this.stepSize + this.randomNegativePositiveRange(this.variantPointDistance);

            //resets step when it goes past angle range
            if (this.currentStep > this.maxAngle) {
              this.currentStep = this.currentStep - this.maxAngle;
            } else if (this.currentStep < this.minAngle) {
              this.currentStep = this.maxAngle - this.currentStep;
            }
          }

          if (this.enableRandomMagnitude) {
            magnitude = Math.random();
          }

          coord = this.getRadialPoint(step, magnitude);
        } else {
          coord = this.getRandomCoord(this.radius);
        }

        if (this.enableRandomDepth || this.enableRandomSpawning) {
          depth = this.randomBetweenValues(this.zAxisMin, this.zAxisMax);
        }

        if (this.enableDirectionReverse) {
          return {
            startX: this.endPosition[0],
            startY: this.endPosition[1],
            startZ: this.endPosition[2],
            endX: coord.x,
            endY: coord.y,
            endZ: depth,
            lifetime: tempLifetime,
            id: this.getUniqueId()
          };
        } else {
          return {
            endX: this.endPosition[0],
            endY: this.endPosition[1],
            endZ: this.endPosition[2],
            startX: coord.x,
            startY: coord.y,
            startZ: depth,
            lifetime: tempLifetime,
            id: this.getUniqueId()
          };
        }
      } else {
        let depth = 0;

        if (this.enableRandomDepth || this.enableRandomSpawning) {
          depth = this.randomBetweenValues(this.zAxisMin, this.zAxisMax);
        }

        return {
          endX: this.endPosition[0],
          endY: this.endPosition[1],
          endZ: this.endPosition[2],
          startX: Math.random() * 100,
          startY: Math.random() * 100,
          startZ: depth,
          lifetime: tempLifetime,
          id: this.getUniqueId()
        };
      }

    },
    getRandomCoord(radius) {
      let radiusRandom = radius * Math.sqrt(Math.random());
      let theta = this.minAngle + (Math.random() * this.angleDifference);

      return {x : this.centerPosition[0] + radiusRandom * Math.cos(theta),
              y : this.centerPosition[1] + radiusRandom * Math.sin(theta)};
    },
    toPixelsWidth(widthPercentage) {
      return this.$refs.particleParent.clientWidth * (widthPercentage / 100);
    },
    toPixelsHeight(heightPercentage) {
      return this.$refs.particleParent.clientHeight * (heightPercentage / 100);
    },
    toPixelsDepth(depthPercentage) {
      return this.$refs.particleParent.clientWidth * (depthPercentage / 100);
    },
  },
  mounted() {
    if(this.enabled) {
      this.startSpawning();
    }
  },
  updated() {
    this.parentPerspective = this.toPixelsDepth(100);
  },
  watch: {
    enabled(enabled) {
      if(enabled) {
        this.startSpawning();
      }
      else {
        this.stopSpawning();
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.particle-cloud {
  position: relative;
  pointer-events: none;
}

.particle {
  pointer-events: none;
}

.appear-grow {
  width: 0 !important;
  height: 0 !important;
}

.leave-active-shrink {
  width: 0 !important;
  height: 0 !important;
}

.appear-fade-in {
  opacity: 0;
}

.leave-active-fade-out {
  opacity: 0;
}

</style>