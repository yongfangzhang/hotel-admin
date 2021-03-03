import request from '@/utils/request';

const BASE_URL = '/pub';

export function getCaptcha() {
  return request({
    url: `${BASE_URL}/captcha`,
    method: 'get'
  });
}
