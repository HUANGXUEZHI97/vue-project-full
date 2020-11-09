<template>
  <div class="login-container">
    <el-form class="login-form" label-width="100px" :model="form" :rules="rules" ref="loginForm">
      <div class="title-container">
        <img src="@/static/logo.svg" alt="logo" />
      </div>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" label="验证码" class="captcha-container">
        <div class="captcha">
          <img :src="code.captcha" @click="resetCaptcha" />
        </div>
        <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="emailcode" label="邮箱验证码" class="captcha-container">
        <div class="captcha">
          <el-button @click="sendEmailCode" :disabled="send.timer > 0" type="primary">{{ sendText }}</el-button>
        </div>
        <el-input v-model="form.emailcode" placeholder="请输入邮箱验证码"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.passwd" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="register">
        <div class="operate-btn">
          <el-button type="primary" @click.native.prevent="handleLogin">登录</el-button>
          <a class="redirect-to" @click.prevent="redirectRegister">没有账号？去注册</a>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'md5';
import { type } from 'os';

export default {
  layout: 'login',
  data() {
    return {
      send: {
        timer: 0,
      },
      form: {
        email: '804212715@qq.com',
        captcha: '',
        emailcode: '',
        passwd: 'a123456',
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: ' 请输入正确的邮箱格式' },
        ],
        captcha: [{ required: true, message: '请输入验证码' }],
        emailcode: [{ required: true, message: '请输入邮箱验证码' }],
        passwd: [
          {
            required: true,
            pattern: /^[\w_-]{6,12}$/g,
            message: '请输入6~12位密码',
          },
        ],
      },
      code: {
        captcha: '/api/captcha',
      },
    };
  },
  computed: {
    sendText() {
      if (this.send.timer <= 0) {
        return '发送';
      }
      return `${this.send.timer}秒后发送`;
    },
  },
  methods: {
    //发送邮箱验证码
    async sendEmailCode() {
      // TODO:发送接口
      await this.$http.get('/sendcode?email=' + this.form.email);

      this.send.timer = 10;
      this.timer = setInterval(() => {
        this.send.timer -= 1;
        if (this.send.timer === 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    //登录
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // TODO:发送请求
          let obj = {
            email: this.form.email,
            nickname: this.form.nickname,
            passwd: md5(this.form.passwd),
            captcha: this.form.captcha,
            emailcode: this.form.emailcode,
          };

          let ret = await this.$http.post('/user/login', obj);
          // code = 0 注册成功
          console.log(ret.code);
          if (ret.code === 0) {
            // TODO:登录成功，返回token，前端存储（用户名，过期时间，jwt加密）
            this.$message.success('登录成功');
            localStorage.setItem('token', ret.data.token);
            setTimeout(() => {
              this.$router.push('/');
            }, 500);
          } else {
            this.$message.error(ret.message);
          }
        } else {
          console.log('验证失败！');
        }
      });
    },
    //重定向到注册
    redirectRegister() {
      this.$router.push({ path: '/register' });
    },
    //重置图形验证码
    resetCaptcha() {
      this.code.captcha = '/api/captcha?_t=' + new Date().getTime();
    },
  },
};
</script>

<style lang="scss" scoped>
.operate-btn {
  display: flex;
  justify-content: space-between;
  .redirect-to {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
