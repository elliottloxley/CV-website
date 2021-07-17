<template>
  <div class="collapsible-side-navbar">
    <a :href="`#${navId}`" :style="linkStyle" v-if="!navObject || navObject.length === 0" class="nav-link">{{content}}</a>
    <div v-else class="nav-collapse-toggle" @click="isExpanded=!isExpanded">
      <icon class="arrow" :class="{'arrow-spin' : !isExpanded}" name="arrow_drop_down"></icon>
      <div class="expand-button" :style="contentStyle">{{content}}</div>
    </div>
    <div :style="{marginLeft: '10px'}" v-show="isExpanded" class="collapse-container">
      <collapsible-side-navbar v-for="(node, index) in navObject"
                               :key="index"
                               :indent="indent+1"
                               :content="node.content"
                               :nav-id="node.navID"
                               :indent-styles="indentStyles"
                               :default-style="defaultStyle"
                               :link-style="linkStyle"
                               :nav-object="node.nodes"></collapsible-side-navbar>
    </div>
  </div>
</template>

<script>

import Icon from 'vue-md-icons/src/components/Icon'
import 'vue-md-icons/src/icons/arrow_drop_down'

export default {
  name: 'collapsible-side-navbar',
  components: {
    Icon
  },
  props: {
    navObject: { required: true },
    content: { type: String, required: true },
    navId: { default: '', type: String },
    isActive: { default: false, type: Boolean },
    linkStyle: { default () { return {} }, type: Object },
    indent: { required: true },
    indentStyles: { default () { return [] }, type: Array },
    defaultStyle: { default () { return {} }, type: Object }
  },
  data () {
    return {
      isExpanded: true
    }
  },
  computed: {
    contentStyle () {
      return this.indentStyles[this.indent] === undefined || this.indentStyles[this.indent] === {}
        ? this.defaultStyle
        : this.indentStyles[this.indent]
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" scoped>

.nav-collapse-toggle {
  cursor pointer;
  display flex;
  align-items center;
  font-size 1.2rem;
}

.arrow {
  width 1.3rem;
  height 1.3rem;
  transition transform 0.3s;
}

.arrow-spin {
  transform rotate(-90deg);
}

div {
  outline-style none;
}
</style>
