import Vue from 'vue';
import axios from 'axios';
import { MessageBox } from 'element-ui';

const service = axios.create({
  // timeout:5,
  baseURL: 'api',
});

export default ({ store, redirect }) => {
  //请求拦截：
  // TODO: 主要做token的处理
  service.interceptors.request.use(async config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.common.Authorization = 'Bearer ' + token;
    }
    return config;
  });

  //响应拦截：
  service.interceptors.response.use(async response => {
    let { data } = response;

    if (data.code === -666) {
      MessageBox.confirm('登录已过期', '登录', {
        confirmButtonText: '登录',
        showCancelButton: false,
        type: 'warning',
        callback: action => {
          localStorage.removeItem('token');
          redirect({ path: 'login' });
        },
      });
    }
    return data;
  });
};

Vue.prototype.$http = service;

export const http = service;
