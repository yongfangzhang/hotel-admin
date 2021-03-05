import request from '@/utils/request';

const BASE_URL = '/room';

export const updateRoomPrice = (uuid, data) => {
  return request({
    url: `${BASE_URL}/${uuid}/price`,
    data,
    method: 'PUT'
  });
};
