import request from '@/utils/request';

const BASE_URL = '/pub';

export const fetchDictTree = () => {
  return request({
    url: `${BASE_URL}/dict/tree`,
    method: 'get'
  });
};

export const deleteDict = uuid => {
  return request({
    url: `${BASE_URL}/dict/${uuid}`,
    method: 'delete'
  });
};
