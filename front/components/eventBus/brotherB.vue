<template>
  <div>
    <div class="dad">
      <div class="son">我是B：{{count}}</div>
      <div>{{asyncDoubleCount}}</div>
    </div>
  </div>
</template>

<script>
import eventBus from "./eventBus";

export default {
  data() {
    return {
      count: 0
    };
  },
  watch: {
    count: function(newCount, oldCount) {
      if (newCount > 4) {
        setTimeout(() => {
          console.log(oldCount);
        }, 1000);
      }
    }
  },
  computed: {
    asyncDoubleCount() {
      // setTimeout(() => {
      return this.count * 2;
      // }, 1000);
    }
  },
  beforeCreate() {
    setTimeout(() => {
      console.log("beforecreate");
    }, 1000);
  },
  created() {
    setTimeout(() => {
      console.log("created");
    }, 1000);
  },
  beforeMount() {
    setTimeout(() => {
      console.log("beforemount");
    }, 1000);
  },
  mounted() {
    eventBus.$on("addCount", param => {
      this.count = this.count + param;
    });
    setTimeout(() => {
      console.log("mounted");
    }, 1000);
  },
  beforeUpdate() {
    setTimeout(() => {
      console.log("beforeupdate");
    }, 1000);
  },
  updated() {
    setTimeout(() => {
      console.log("updated");
    }, 1000);
  },
  boforeDestroy() {
    setTimeout(() => {
      console.log("boforedestroy");
    }, 1000);
  },
  destroyed() {
    setTimeout(() => {
      console.log("destroyed");
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>
.dad {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px blueviolet double;
  .son {
    width: 50px;
    height: 50px;
    border: 1px royalblue dashed;
  }
}
</style>