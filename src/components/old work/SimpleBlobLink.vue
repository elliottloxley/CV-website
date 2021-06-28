<template>
<slotted-div :disable-pointer-foreground="true">
  <template v-slot:background-content>
    <blob class="button-blob"
    :vertex-count="3"
    :frozen="true"
    :path-style-user="{fill: blobColour, cursor: 'pointer'}"
    :wiggle-magnitude="3"
    :randomise-start-point="true"
    :start-point-randomise-percentage="0.3"
    @blobClicked="onClick"></blob>
  </template>
  <template v-slot:foreground-content>
    <div class="button-content"
    :style="{color: textColour}">
      {{content}}
    </div>
  </template>
</slotted-div>
</template>

<script>
import SlottedDiv from "@/components/old work/SlottedDiv";
import Blob from "@/components/old work/Blob";
export default {
  name: "SimpleBlobLink",
  components: {Blob, SlottedDiv},
  props: {
    navLink: {required: true, type:String},
    content: {default: "default", type:String},
    blobColour: {default: "white", type:String},
    textColour: {default: "black", type:String}
  },
  methods: {
    onClick() {
      this.$router.push(this.navLink);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>