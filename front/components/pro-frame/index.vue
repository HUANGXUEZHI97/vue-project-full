<template>
  <div>
    <PageHeader />
    <div class="sub-nav-main" :style="{ 'min-height': minMainHeight }">
      <slot />
    </div>
    <PageFooter />
  </div>
</template>

<script>
import PageHeader from './page-header/index';
import PageFooter from './page-footer/index';

export default {
  name: 'ProFrame',
  components: {
    PageHeader,
    PageFooter,
  },
  computed: {
    minMainHeight() {
      // const height = screen.availHeight;
      // return height - 61 - 44 - 103 + 'px';
      return '832px';
    },
  },
};
</script>

<style lang="scss" scoped>
.sub-nav-main {
}
</style>
