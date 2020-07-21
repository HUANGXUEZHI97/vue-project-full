<template>
  <el-table :data="data" highlight-current-row border fit stripe style="width:100%">
    <template v-for="colConfig in colConfigs">
      <slot v-if="colConfig.slot" :name="colConfig.slot"></slot>
      <component
        v-else-if="colConfig.component"
        :is="colConfig.component"
        :col-config="colConfig"
        :key="colConfig.porp"
      ></component>
      <el-table-column v-else v-bind="colConfig" :key="colConfig.prop"></el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    colConfigs: {
      type: Array,
      default: []
    }
  }
};
</script>

<style lang="scss" scoped>
</style>