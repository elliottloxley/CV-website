<template>
  <div class="root">
    <div v-for="(val) in testArr"
         :key="val">
      <slot :name="`slot${val}`">
        <div>default content {{val}}</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
name: "test",
  data() {
    return {
      testArr: []
    }
  },
  mounted() {
  let delay = 0;
  let inc = 0;
  for(let i=0;i<7;i++) {
    let inctemp = inc;
    setTimeout(() => {
      this.testArr.push(inctemp);
    }, delay);
    delay += 500;
    inc++;
  }
  }
}
</script>

<style lang="scss" scoped>
div {
  font-size: 20px;
  color: white;
}
</style>