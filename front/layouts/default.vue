<template>
  <div>
    <el-menu
      :default-Active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
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
    <nuxt />
  </div>
</template>

<script>
import "@/styles/index.scss";

export default {
  data() {
    return {
      activeIndex: 1,
      activeIndex2: 2
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
