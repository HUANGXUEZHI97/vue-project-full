<template>
  <div>
    <nuxt></nuxt>
    <!-- <footer>
      底部信息
    </footer>-->
  </div>
</template>

<script>
import '@/styles/index.scss';

export default {
  data() {
    return {
      activeIndex: 1,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss">
.login-container {
  width: 100%;
  min-height: 100%;
  .login-form {
    width: 520px;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .title-container {
    text-align: center;
    margin-bottom: 20px;
    img {
      width: 200px;
    }
  }
  .captcha-container {
    width: 340px;
    position: relative;
    .captcha {
      position: absolute;
      right: -110px;
      .el-button {
        width: 90px;
        padding: 0;
        line-height: 40px;
      }
      img {
        width: 90px;
        height: 50px;
        cursor: pointer;
      }
    }
  }
}
</style>
