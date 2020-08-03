<template>
  <div>
    <el-menu
      :default-Active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#fff"
    >
      <el-menu-item index="1">
        <nuxt-link to="/">
          <svg-icon icon-class="home" />首页
        </nuxt-link>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <svg-icon icon-class="workspace" />我的工作台
        </template>
        <el-menu-item index="2-1">
          <nuxt-link class="nuxt-link" to="/login">登录</nuxt-link>
        </el-menu-item>
        <el-menu-item index="2-2">
          <nuxt-link class="nuxt-link" to="/register">注册</nuxt-link>
        </el-menu-item>
        <el-menu-item index="2-3">
          <nuxt-link class="nuxt-link" to="/uc">文件上传</nuxt-link>
        </el-menu-item>
        <el-menu-item index="2-4">
          <nuxt-link class="nuxt-link" to="/transmit">传值</nuxt-link>
        </el-menu-item>
        <el-menu-item index="2-5">
          <nuxt-link class="nuxt-link" to="/style">样式</nuxt-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <svg-icon icon-class="report" />我的报表
        </template>
        <el-menu-item index="3-1">
          <nuxt-link class="nuxt-link" to="/form/userInfo">用户信息</nuxt-link>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="4" disabled>新功能待开放</el-menu-item>
      <el-menu-item index="5">
        <a href="https://github.com/HUANGXUEZHI97/vue-project-full" target="_blank">
          <svg-icon icon-class="github" />Github地址
        </a>
      </el-menu-item>
    </el-menu>
    <nuxt></nuxt>
    <!-- <footer>
      底部信息
    </footer>-->
  </div>
</template>

<script>
import "@/styles/index.scss";

export default {
  data() {
    return {
      activeIndex: 1
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
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