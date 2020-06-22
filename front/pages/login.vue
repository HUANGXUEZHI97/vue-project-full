<template>
  <div>
    <el-form class="class-form" :rules="rules">
      <el-form-item props="email">
        <span>
          <i class="el-icon-mobile"></i>
        </span>
        <el-input placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item props="passwd">
        <span>
          <i class="el-icon-lock"></i>
        </span>
        <el-input placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item props="captcha">
        <el-input placeholder="验证码"></el-input>
        <img @click="updateCaptcha" :src="captchaUrl" alt="验证码" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  layout: "login",
  data() {
    return {
      rules: {},
      captchaUrl: "/api/captcha?_t=" + new Date().getTime() //验证码地址
    };
  },
  mounted() {},
  methods: {
    updateCaptcha() {
      this.captchaUrl = "/api/captcha?_t=" + new Date().getTime();
    }
  }
};
</script>

<style lang="scss" scoped>
.class-form {
  width: 800px;
  margin: 50px auto;
}
</style>