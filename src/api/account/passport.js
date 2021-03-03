import request from '@/utils/request';

const BASE_URL = '/account/passport';

export function login(data) {
  return request({
    url: `${BASE_URL}/login`,
    method: 'post',
    data
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
