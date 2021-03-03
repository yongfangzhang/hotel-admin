import request from '@/utils/request';

const BASE_URL = '/pub';

export function getEnum() {
  return request({
    url: `${BASE_URL}/enum`,
    method: 'get'
  });
}
