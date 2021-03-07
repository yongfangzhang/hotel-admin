import { ACCOUNT_TYPE } from '@/utils/constant';
import request from '@/utils/request';

const BASE_URL = '/account/passport';

export function login(data) {
  return request({
    url: `${BASE_URL}/login`,
    method: 'post',
    data: {
      ...data,
      type: ACCOUNT_TYPE
    }
  });
}

export function getInfo() {
  return request({
    url: `${BASE_URL}/info`
  });
}

export function logout() {
  return request({
    url: `${BASE_URL}/logout`,
    method: 'post'
  });
}

export function fetchUserXsList() {
  return request({
    url: '/user/list/xs'
  });
}
