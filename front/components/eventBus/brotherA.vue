<template>
  <div>
    <h3></h3>
    <el-button class="primary" @click="ClickCount">我是A，ClickCount</el-button>
  </div>
</template>

<script>
import eventBus from './eventBus';

export default {
  methods: {
    ClickCount() {
      eventBus.$emit('addCount', 1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
