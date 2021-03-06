import request from '@/utils/request';

const BASE_URL = '/pub/dict';

export const fetchDictTree = () => {
  return request({
    url: `${BASE_URL}/tree`,
    method: 'get'
  });
};

export const deleteDict = uuid => {
  return request({
    url: `${BASE_URL}/${uuid}`,
    method: 'delete'
  });
};
