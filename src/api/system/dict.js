import request from '@/utils/request';
const BASE_URL =
    process.env.VUE_APP_BASE_API + process.env.VUE_APP_CONTEXT_PATH;

export const fetchDictTree = () => {
  return request({
    url: `${BASE_URL}/tsystem/dict/tree`,
    method: 'get'
  })
}

export const deleteDict = (id) => {
  return request({
    url: `${BASE_URL}/tsystem/dict/${id}`,
    method: 'delete'
  })
}
