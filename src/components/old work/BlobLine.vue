<template>
  <div class="blob">
    <svg class="blob-svg" preserveAspectRatio="none" :style="svgStyle" :viewBox="'0 0 ' + viewX + ' ' + viewY">
      <path ref="linePath" @mouseenter="mouseEnter" @mouseleave="mouseLeave" @click.prevent="clicked" :id="generatedId" :style="pathStyle" d="">
        <animate :ref="animationID" :id="animationID" :href="'#' + generatedId" attributeName="d" attributeType="XML"
                 :from="currentPathSVG" :to="pathToMoveToSVG" :dur="loopDuration + durationRandomised + 's'"
                 fill="freeze"></animate>
      </path>
      <g v-if="testMode" class="test-visuals">
        <rect fill="red" width="10" height="10" v-for="coord in this.coords" :key="'' + coord.x + ''+ coord.y" :x="coord.x - 5" :y="coord.y -5"></rect>
        <rect fill="blue" width="10" height="10" :x="this.curve.control1.x - 5" :y="this.curve.control1.y - 5"></rect>
        <rect fill="blue" width="10" height="10" :x="this.curve.control2.x - 5" :y="this.curve.control2.y - 5"></rect>
        <rect fill="yellow" width="10" height="10" :x="this.curve.startPoint.x - 5" :y="this.curve.startPoint.y - 5"></rect>
        <rect fill="yellow" width="10" height="10" :x="this.curve.endPoint.x - 5" :y="this.curve.endPoint.y - 5"></rect>
      </g>
    </svg>
  </div>
</template>

<script>

import uniqueIdMixin from '@/mixins/uniqueId'

export default {
  name: 'BlobLine',
  mixins: [
    uniqueIdMixin
  ],
  props: {
    startPointUser: { default () { return [0, 0.5] } },
    endPointUser: { default () { return [1, 0.5] } },
    vertexCount: { default: 10, type: Number },
    aspectRatio: { default () { return [1, 1] }, type: Array },
    loopDuration: { default: 2, type: Number },
    curveMagnitudeNormal: { default: -0.25, type: Number },
    curveMagnitudeTangent: { default: 0.25, type: Number },
    edgeOffset: { default: 0, type: Number },
    svgStyle: { default () { return {} }, type: Object },
    pathStyle: { default () { return this.defaultStyle }, type: Object },
    wiggleMagnitude: { default: 1, type: Number },
    testMode: { default: false, type: Boolean },
    name: { default: '', type: String },
    enableDetectClickOutside: { default: false, type: Boolean }
  },
  data () {
    return {
      curveStrengthFactor: 4.5,
      currentPathSVG: '',
      pathToMoveToSVG: '',
      startPathSVG: '',
      viewSize: 1000,
      coords: []
    }
  },
  computed: {
    generatedId () {
      return 'blobLine' + this.getUniqueId()
    },
    animationID () {
      return 'toAnimation' + this.getUniqueId()
    },
    durationRandomised () {
      return (0.05 * (Math.floor(Math.random() * 2) === 1 ? 1 : -1))
    },
    defaultStyle () {
      return { fill: 'hsl(0,0,0)', stroke: 'hsl(0,0,0)', strokeWidth: 0 }
    },
    lineLength () {
      return Math.hypot((this.endPointUser[0] - this.startPointUser[0]) * this.viewX,
        (this.endPointUser[1] - this.startPointUser[1]) * this.viewY)
    },
    vertexFactor () {
      return 1 / this.vertexCount
    },
    lineAngle () {
      return Math.atan2((this.endPointUser[1] - this.startPointUser[1]) * this.viewY,
        (this.endPointUser[0] - this.startPointUser[0]) * this.viewX)
    },
    curve () {
      const startPoint = { x: this.startPointUser[0], y: this.startPointUser[1] }
      const endPoint = { x: this.endPointUser[0], y: this.endPointUser[1] }

      const lineVector = { x: endPoint.x - startPoint.x, y: endPoint.y - startPoint.y }

      const normalPoint1 = { x: startPoint.x + (lineVector.x * this.curveMagnitudeTangent), y: startPoint.y + (lineVector.y * this.curveMagnitudeTangent) }
      const normalPoint2 = { x: endPoint.x - (lineVector.x * this.curveMagnitudeTangent), y: endPoint.y - (lineVector.y * this.curveMagnitudeTangent) }

      const startPointAbsolute = this.movePoint({ x: startPoint.x * this.viewX, y: startPoint.y * this.viewY }, this.lineAngle, this.lineLength * -this.edgeOffset)
      const endPointAbsolute = this.movePoint({ x: endPoint.x * this.viewX, y: endPoint.y * this.viewY }, this.lineAngle, this.lineLength * this.edgeOffset)

      const controls = this.getPointsNormalToLine(normalPoint1, normalPoint2, -this.curveMagnitudeNormal)

      const control1Absolute = { x: controls.point1.x * this.viewX, y: controls.point1.y * this.viewY }
      const control2Absolute = { x: controls.point2.x * this.viewX, y: controls.point2.y * this.viewY }

      return {
        startPoint: startPointAbsolute,
        endPoint: endPointAbsolute,
        control1: control1Absolute,
        control2: control2Absolute
      }
    },
    viewX () {
      return this.viewSize * this.aspectRatio[0]
    },
    viewY () {
      return this.viewSize * this.aspectRatio[1]
    }
  },
  methods: {
    movePoint (point, angle, distance) {
      if (distance !== 0) {
        return { x: point.x + Math.cos(angle) * distance, y: point.y + Math.sin(angle) * distance }
      } else {
        return point
      }
    },
    getPointsNormalToLine (linePoint1, linePoint2, offset) {
      const dx = linePoint1.x - linePoint2.x
      const dy = linePoint1.y - linePoint2.y

      const dist = Math.sqrt(dx * dx + dy * dy)

      const xPerp = offset * (dx / dist)
      const yPerp = offset * (dy / dist)

      return {
        point1: { x: (linePoint1.x - yPerp), y: (linePoint1.y + xPerp) },
        point2: { x: (linePoint2.x - yPerp), y: (linePoint2.y + xPerp) }
      }
    },
    getBezierPointFactors (bezierLocation) {
      const bezFactor0 = Math.pow((1 - bezierLocation), 3)
      const bezFactor1 = 3 * bezierLocation * Math.pow((1 - bezierLocation), 2)
      const bezFactor2 = 3 * (Math.pow(bezierLocation, 2)) * (1 - bezierLocation)
      const bezFactor3 = Math.pow(bezierLocation, 3)

      return [bezFactor0, bezFactor1, bezFactor2, bezFactor3]
    },
    distanceToEdge () {
      const minX = 0
      const minY = 0
      const maxX = this.viewX
      const maxY = this.viewY

      var midX = (minX + maxX) / 2
      var midY = (minY + maxY) / 2

      const centerPoint = { x: midX, y: midY }
      let edgePoint = {}

      const outsidePoint = this.movePoint(centerPoint, this.lineAngle + (Math.PI / 2), (Math.max(maxX, maxY) * 2))
      const x = outsidePoint.x
      const y = outsidePoint.y

      // if (midX - x == 0) -> m == ±Inf -> minYx/maxYx == x (because value / ±Inf = ±0)
      var m = (midY - y) / (midX - x)

      if (x <= midX) { // check "left" side
        var minXy = m * (minX - x) + y
        if (minY <= minXy && minXy <= maxY) { edgePoint = { x: minX, y: minXy } }
      }

      if (x >= midX) { // check "right" side
        var maxXy = m * (maxX - x) + y
        if (minY <= maxXy && maxXy <= maxY) { edgePoint = { x: maxX, y: maxXy } }
      }

      if (y <= midY) { // check "top" side
        var minYx = (minY - y) / m + x
        if (minX <= minYx && minYx <= maxX) { edgePoint = { x: minYx, y: minY } }
      }

      if (y >= midY) { // check "bottom" side
        var maxYx = (maxY - y) / m + x
        if (minX <= maxYx && maxYx <= maxX) { edgePoint = { x: maxYx, y: maxY } }
      }

      // edge case when finding midpoint intersection: m = 0/0 = NaN
      if (x === midX && y === midY) edgePoint = { x: x, y: y }

      return 2 * Math.sqrt(Math.pow((centerPoint.x - edgePoint.x), 2) + Math.pow((centerPoint.y - edgePoint.y), 2))
    },
    generateCoords () {
      const pathArray = []

      // algorithm for generating points along a bezier
      for (let loc = this.vertexFactor; loc < 1 - this.vertexFactor; loc += this.vertexFactor) {
        const bezFactors = this.getBezierPointFactors(loc)

        const x = (bezFactors[0] * this.curve.startPoint.x) +
                (bezFactors[1] * this.curve.control1.x) +
                (bezFactors[2] * this.curve.control2.x) +
                (bezFactors[3] * this.curve.endPoint.x)
        const y = (bezFactors[0] * this.curve.startPoint.y) +
                (bezFactors[1] * this.curve.control1.y) +
                (bezFactors[2] * this.curve.control2.y) +
                (bezFactors[3] * this.curve.endPoint.y)

        const point = this.movePoint({ x, y }, this.lineAngle + (Math.PI / 2), this.getRandomDistance())

        pathArray.push(point)
      }
      return pathArray
    },
    getFillPoints () {
      const extendPoint1 = this.movePoint(this.curve.startPoint, this.lineAngle, -(this.lineLength / 20))
      const extendPoint2 = this.movePoint(this.curve.endPoint, this.lineAngle, this.lineLength / 20)
      const normPoints = this.getPointsNormalToLine(extendPoint1, extendPoint2, this.distanceToEdge())

      return [extendPoint2, normPoints.point2, normPoints.point1, extendPoint1]
    },
    getRandomDistance () {
      let num = Math.floor(Math.random() * (this.lineLength / 50)) + 1
      num *= this.wiggleMagnitude
      num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1
      return num
    },
    generateSvgPath (coordArray) {
      const drawPoints = this.getFillPoints()

      let d = `M${this.curve.endPoint.x},${this.curve.endPoint.y}
       L${drawPoints[0].x},${drawPoints[0].y}
       L${drawPoints[1].x},${drawPoints[1].y}
       L${drawPoints[2].x},${drawPoints[2].y}
       L${drawPoints[3].x},${drawPoints[3].y}
       L${this.curve.startPoint.x},${this.curve.startPoint.y}`
      coordArray.forEach((coord, index, array) => {
        const p = []
        if (index === 0) {
          p.push({ x: this.curve.startPoint.x, y: this.curve.startPoint.y })
          p.push(array[index])
          p.push(array[index + 1])
          p.push(array[index + 2])
        } else if (index === array.length - 2) {
          p.push(array[index - 1])
          p.push(array[index])
          p.push(array[index + 1])
          p.push({ x: this.curve.endPoint.x, y: this.curve.endPoint.y })
        } else if (index === array.length - 1) {
          p.push(array[index - 1])
          p.push(array[index])
          p.push({ x: this.curve.endPoint.x, y: this.curve.endPoint.y })
          p.push({ x: this.curve.endPoint.x, y: this.curve.endPoint.y })
        } else {
          p.push(array[index - 1])
          p.push(array[index])
          p.push(array[index + 1])
          p.push(array[index + 2])
        }
        const bp = []
        bp.push({ x: p[1].x, y: p[1].y })
        bp.push({ x: ((-p[0].x + this.curveStrengthFactor * p[1].x + p[2].x) / this.curveStrengthFactor), y: ((-p[0].y + this.curveStrengthFactor * p[1].y + p[2].y) / this.curveStrengthFactor) })
        bp.push({ x: ((p[1].x + this.curveStrengthFactor * p[2].x - p[3].x) / this.curveStrengthFactor), y: ((p[1].y + this.curveStrengthFactor * p[2].y - p[3].y) / this.curveStrengthFactor) })
        bp.push({ x: p[2].x, y: p[2].y })
        d += 'C' + bp[1].x + ',' + bp[1].y + ' ' + bp[2].x + ',' + bp[2].y + ' ' + bp[3].x + ',' + bp[3].y + ' '
      })

      return d
    },
    generateSVG () {
      this.currentPathSVG = this.generateSvgPath(this.generateCoords())
      this.pathToMoveToSVG = this.generateSvgPath(this.generateCoords())
    },
    mouseEnter () {
      this.$emit('blobMouseEnter', this.name)
    },
    mouseLeave () {
      this.$emit('blobMouseLeave', this.name)
    },
    clicked () {
      this.$emit('blobClicked', this.name)
    },
    clickedOutside (event) {
      if (this.$refs.linePath === event.target) {
        return
      }
      this.$emit('clickedOutside', event)
    }
  },
  mounted () {
    if (this.enableDetectClickOutside) {
      document.addEventListener('click', this.clickedOutside)
    }

    this.generateSVG()
    this.$refs[this.animationID].addEventListener('endEvent', () => {
      this.currentPathSVG = this.pathToMoveToSVG

      const tempCoords = this.generateCoords()
      this.pathToMoveToSVG = this.generateSvgPath(tempCoords)

      if (this.testMode) {
        this.coords = tempCoords
      }

      if (this.$refs[this.animationID]) {
        this.$refs[this.animationID].beginElement()
      }
    })
  },
  watch: {
    loopDuration () {
      this.$refs[this.animationID].endElement()
      this.$refs[this.animationID].beginElement()
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickedOutside)
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

.blob-svg {
  width 100%;
  height 100%;
}

</style>
