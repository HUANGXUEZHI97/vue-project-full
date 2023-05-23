<template>
  <div>
    <ProFrame>
      <nuxt />
    </ProFrame>
  </div>
</template>

<script>
import '@/styles/index.scss';
import ProFrame from '@/components/pro-frame/index';
// import "@/styles/form.scss";

export default {
  components: {
    ProFrame,
  },
  data() {
    return {
      activeIndex: 1,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
          console.log(key, keyPath)
    },
  },
};
</script>

<style lang="scss" scoped>
.form-container {
       padding: 20px;
}
</style>
