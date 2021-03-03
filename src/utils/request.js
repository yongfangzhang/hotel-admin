import axios from 'axios';
import { Message } from 'element-ui';
import {
  TokenKey,
  getToken,
  removeToken,
  TenantKey,
  getTenant,
  DeviceKey,
  getUserDevice,
  UserAgentKey
} from './auth';
import { ERROR_CODE } from './constant';
import logger from './logger';
import { startProgress, stopProgress } from './progress';

const redirectLogin = () => {
  removeToken();
  if (location.href.indexOf('/login') < 0) {
    location.href = '/login';
  }
};

// create an axios instance
const service = axios.create({
  // url = base url + request url
  baseURL: process.env.VUE_APP_BASE_API + process.env.VUE_APP_CONTEXT_PATH,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    if (!config.disableLoading) startProgress();
    // do something before request is sent
    config.headers[TenantKey] = getTenant();
    config.headers[DeviceKey] = getUserDevice();
    config.headers[UserAgentKey] = navigator.userAgent;

    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers[TokenKey] = getToken();
    }
    return config;
  },
  error => {
    stopProgress();
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (!response.config.disableLoading) stopProgress();
    const res = response.data;
    if (typeof res !== 'object' || typeof res.code === 'undefined') {
      return Promise.resolve(res);
    }
    if (response.config.handleCode) {
      if (res.code === ERROR_CODE.ACCESS_DENIED) {
        return redirectLogin();
      }
      return Promise.resolve(res);
    } else {
      if (res.code !== ERROR_CODE.SUCCESS) {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        });
        if (res.code === ERROR_CODE.ACCESS_DENIED) {
          return redirectLogin();
        }
        return Promise.reject(res);
      }
      return Promise.resolve(res.data);
    }
  },
  error => {
    stopProgress();
    if (error.response.status === ERROR_CODE.ACCESS_DENIED) {
      return redirectLogin();
    }
    logger.debug('err: ' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
