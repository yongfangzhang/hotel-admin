import request from '@/utils/request';

const BASE_URL = '/pub';

export function getProvinceList() {
  return request({
    url: `${BASE_URL}/province/list`,
    method: 'get'
  });
}

export function getCityList(provinceCode) {
  return request({
    url: `${BASE_URL}/city/list`,
    method: 'get',
    params: {
      provinceCode
    }
  });
}

export function getAreaList(cityCode) {
  return request({
    url: `${BASE_URL}/area/list`,
    method: 'get',
    params: {
      cityCode
    }
  });
}

export function getAreaInfo(areaCode) {
  return request({
    url: `${BASE_URL}/area/${areaCode}`,
    method: 'get'
  });
}
