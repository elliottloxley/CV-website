<template>
  <div class="grid-view">
    <transition-group name="item-fade" class="grid-container" tag="div">
      <grid-view-item v-for="item in gridItems" v-bind:key="item.id"
                      :desc-selected-id="descriptionShownId" :gridItem="item"
                      @descriptionClicked="handleDescriptionSelected($event)"></grid-view-item>
    </transition-group>
  </div>
</template>

<script>
import GridViewItem from "@/components/All Pages/Grid View/GridViewItem";

export default {
  name: "GridView",
  props: {
    dataUrl: {
      type: String,
      required: true
    }
  },
  components: {GridViewItem},
  data: function () {
    return {
      gridItems: [],
      animationDelay: 0,
      animationDelayIncrement: 300,
      descriptionShownId: null
    };
  },
  methods: {
    populate() {
      //TODO replace with real code when deploy, this is for testing
      // this.axios.post(this.dataUrl, "").then((response) => {
      //   const dataCpy = response.data;
      //   let delayCpy = this.animationDelay;
      //   const delayIncCpy = this.animationDelayIncrement;
      //   for(const item in dataCpy) {
      //     setTimeout(()=> {this.gridItems.push(dataCpy[item])}, delayCpy);
      //     delayCpy += delayIncCpy;
      //   }
      // }).catch(function (error) {
      //   console.log(error);
      // });


      const dataCpy = this.dummyData();
        let delayCpy = this.animationDelay;
        const delayIncCpy = this.animationDelayIncrement;
        let inc = 1;
        for(const item in dataCpy) {
          dataCpy[item]["id"] = inc;
          setTimeout(()=> {this.gridItems.push(dataCpy[item])}, delayCpy);
          delayCpy += delayIncCpy;
          inc+=1;
       }
    },
    dummyData() {
      //TODO delete when deployed, replace with real data
      return Array.from({ length: 5 }, () => ({"id" : 1,
          "name" : "alexsite",
          "title" : "Alexander music site",
          "short_desc" : "site for my brother alexander",
          "long_desc" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec hendrerit diam, ut finibus enim. Mauris vitae arcu eget eros dictum faucibus vel nec velit. Vestibulum placerat justo ultricies risus dictum, eget ultrices odio lobortis. Aliquam velit lorem, tempus vitae condimentum vel, ornare ac sapien. Nullam mollis dignissim velit sit amet vehicula. Curabitur non magna consectetur, faucibus quam quis, vestibulum mi. Sed a fermentum sem, non gravida lacus. Praesent iaculis lobortis magna a ultrices. Etiam sed sagittis ligula. Nullam placerat dapibus consequat. Nam non blandit neque. Proin mi nibh, rhoncus nec gravida sit amet, rhoncus at tellus.",
          "img" : "temp.jpg",
          "link" : "sites/alexsite"}))
    },
    handleDescriptionSelected(id) {
      if(this.descriptionShownId !== id) {
        this.descriptionShownId = id;
      }
      else {
        this.descriptionShownId = null;
      }
    }
  },
  mounted() {
      this.populate();
  },
  watch: {
    $route(){
      this.gridItems = {};
    }
  }
}

</script>

<style lang="stylus" type="text/stylus" scoped>

.grid-view {
}

.grid-container {
  display grid;
  grid-template-columns repeat(auto-fill, minmax(25rem, 1fr));
  column-gap 60px;
  row-gap 60px;
}

.item-fade-enter-active {
  animation item-pop-in 0.3s, item-fade-in 0.3s;
}

@keyframes item-pop-in {
  from {
    transform translateY(-5%);
  }
  to {
    transform translateY(0px);
  }
}

@keyframes item-fade-in {
  from {
    opacity 0;
  }
  to {
    opacity 1;
  }
}
</style>