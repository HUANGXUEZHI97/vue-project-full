<template>
  <div>
    <h2>我是EventBus</h2>
    <el-button class="success" @click="displayB">display B</el-button>
    <BrotherA />
    <BrotherB :style="{ display: display ? 'none' : 'block' }" />
  </div>
</template>

<script>
import BrotherA from '@/components/eventBus/brotherA';
import BrotherB from '@/components/eventBus/brotherB';

export default {
  data() {
    return {
      display: false,
    };
  },
  methods: {
    displayB() {
      this.display = true;
    },
  },
  components: {
    BrotherA,
    BrotherB,
  },
};
</script>

<style lang="scss" scoped></style>
