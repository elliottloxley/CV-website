<template>
<div class="line-button">
  <div v-if="showLeftLine" class="line-connector left-middle"></div>
  <div v-if="showRightLine" class="line-connector right-middle"></div>
  <div v-if="showBottomLine" class="line-connector bottom-middle"></div>
  <div v-if="showTopLine" class="line-connector top-middle"></div>

  <div class="button-inner">
    <svg :class="cornerAnimationEnded ? 'corner-finished' : ''" class="border-svg svg-corner corner-1" viewBox="0 0 100 100">
      <path d="M50,0 h-50 v50"></path>
    </svg>
    <svg :class="cornerAnimationEnded ? 'corner-finished' : ''" class="border-svg svg-corner corner-2" viewBox="0 0 100 100">
      <path d="M50,0 h50 v50"></path>
    </svg>
    <svg :class="cornerAnimationEnded ? 'corner-finished' : ''" class="border-svg svg-corner corner-3" viewBox="0 0 100 100">
      <path d="M100,50 v50 h-50"></path>
    </svg>
    <svg :class="cornerAnimationEnded ? 'corner-finished' : ''" class="border-svg svg-corner corner-4" viewBox="0 0 100 100">
      <path d="M0,50 v50 h50"></path>
    </svg>
    <transition appear name="button">
      <div class="button-content">{{content}}</div>
    </transition>
  </div>
</div>
</template>

<script>
export default {
name: "LineButton",
  props: {
    content: {default: 'default', type:String},
    enableEnterAnimation: {default: true, type:Boolean},
    showLeftLine: {default: false, type: Boolean}, //
    showRightLine: {default: false, type: Boolean}, //
    showBottomLine: {default: false, type: Boolean}, //
    showTopLine: {default: false, type: Boolean}, //
  },
  data() {
    return {
      cornerAnimationEnded: false
    }
  },
  mounted() {
    setTimeout(() => {this.cornerAnimationEnded = true}, 910);
  }
}
</script>

<style lang="scss" scoped>

//first
$lineAppearDelay: 0s;
$lineAppearTime: 0.3s;
//first
$buttonSpinDelay: 0s;
$buttonSpinTime: 0.3s;

//second
$cornerGrowDelay: 0.4s;
$cornerGrowTime: 0.5s;
//second
$textGrowDelay: 0.4s;
$textGrowTime: 0.5s;

//third
$textAppearDelay: 0.8s;
$textAppearTime: 0.5s;

.line-button {
  position: relative;
}

.button-inner {
  position: relative;
  cursor: pointer;
  min-height: 30px;
  animation: buttonInnerSpin $buttonSpinTime $buttonSpinDelay;
}

.button-inner:hover .corner-1 {
  transform: translate(10%, 10%) !important;
}

.button-inner:hover .corner-2 {
  transform: translate(-10%, 10%) !important;
}

.button-inner:hover .corner-3 {
  transform: translate(-10%, -10%) !important;
}

.button-inner:hover .corner-4 {
  transform: translate(10%, -10%) !important;
}

.button-enter {
  font-size: 0;
}

.disable-animation {
  animation: none !important;
}

.button-inner:hover .border-svg path {
  stroke: rgba(255,255,255,1);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
  color: transparent;
  transition: font-size $textGrowTime $textGrowDelay;
  animation: fontAppear $textAppearTime $textAppearDelay forwards;
}

.border-svg {
  position: absolute;
  height: 50%;
  min-height: 15px;
  pointer-events: none;
  transition: transform 0.4s;
}

.border-svg path {
  stroke-width: 4;
  stroke: white;
  fill: none;
  vector-effect: non-scaling-stroke;
  transition: stroke 0.5s;
}

.corner-1 {
  top: 0;
  left: 0;
  animation: cornerAnimation $cornerGrowTime $cornerGrowDelay forwards;
  transform: translate(50%, 50%);
}

.corner-2 {
  top: 0;
  right: 0;
  animation: cornerAnimation $cornerGrowTime $cornerGrowDelay forwards;
  transform: translate(-50%, 50%);
}

.corner-3 {
  bottom: 0;
  right: 0;
  animation: cornerAnimation $cornerGrowTime $cornerGrowDelay forwards;
  transform: translate(-50%, -50%);
}

.corner-4 {
  bottom: 0;
  left: 0;
  animation: cornerAnimation $cornerGrowTime $cornerGrowDelay forwards;
  transform: translate(50%, -50%);
}

.corner-finished {
  animation: none;
  transform: translate(0,0);
}

$lineConnectorSize: 15px;
$lineConnectorThickness: 2px;

.left-middle {
  position: absolute;
  top: 50%;
  height: $lineConnectorSize;
  width: 30px;
  pointer-events: none;
  border-left: solid white $lineConnectorThickness;
  background-color: black;
  transform: translate(-10px,-50%);
  animation: lineAppearLeft $lineAppearTime $lineAppearDelay forwards;
}

@keyframes lineAppearLeft {
  from {
    transform-origin: 50% 0;
    transform: scaleY(0) translate(-10px,-50%);
  }
  to {
    transform-origin: 50% 0;
    transform: scaleY(1) translate(-10px,-50%);
  }
}

.right-middle {
  position: absolute;
  top: 50%;
  right: 0;
  height: $lineConnectorSize;
  width: 30px;
  pointer-events: none;
  border-right: solid white $lineConnectorThickness;
  background-color: black;
  transform: translate(10px,-50%);
  animation: lineAppearRight $lineAppearTime $lineAppearDelay forwards;
}

@keyframes lineAppearRight {
  from {
    transform-origin: 50% 0;
    transform: scaleY(0) translate(10px,-50%);
  }
  to {
    transform-origin: 50% 0;
    transform: scaleY(1) translate(10px,-50%);
  }
}

.top-middle {
  position: absolute;
  top: 0;
  left: 50%;
  height: 30px;
  width: $lineConnectorSize;
  pointer-events: none;
  border-top: solid white $lineConnectorThickness;
  background-color: black;
  transform: translate(-50%, -10px);
  animation: lineAppearTop $lineAppearTime $lineAppearDelay forwards;
}

@keyframes lineAppearTop {
  from {
    transform-origin: 0 50%;
    transform: scaleX(0) translate(-50%, -10px);
  }
  to {
    transform-origin: 0 50%;
    transform: scaleX(1) translate(-50%, -10px);
  }
}

.bottom-middle {
  position: absolute;
  bottom: 0;
  left: 50%;
  height: 30px;
  width: $lineConnectorSize;
  pointer-events: none;
  border-bottom: solid white $lineConnectorThickness;
  background-color: black;
  transform: translate(-50%, 10px);
  animation: lineAppearBottom $lineAppearTime $lineAppearDelay forwards;
}

@keyframes lineAppearBottom {
  from {
    transform-origin: 0 50%;
    transform: scaleX(0) translate(-50%, 10px);
  }
  to {
    transform-origin: 0 50%;
    transform: scaleX(1) translate(-50%, 10px);
  }
}

@keyframes cornerAnimation {
  to {
    transform: translate(0,0);
  }
}

@keyframes buttonInnerSpin {
  from {
    transform: scale(0.1) rotate(-180deg);
  }
  to {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes fontAppear {
  to {
    color: inherit;
  }
}

</style>