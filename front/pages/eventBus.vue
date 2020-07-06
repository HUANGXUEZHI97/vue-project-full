<template>
  <div>
    <h2>我是EventBus</h2>
    <BrotherA/>
    <BrotherB/>
  </div>
</template>

<script>
import BrotherA from '@/components/eventBus/brotherA';
import BrotherB from '@/components/eventBus/brotherB';

  export default {
    components: {
      BrotherA,
      BrotherB
    },
  }
</script>

<style lang="scss" scoped>

</style>