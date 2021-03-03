import request from '@/utils/request';
const BASE_URL =
  process.env.VUE_APP_BASE_API + process.env.VUE_APP_CONTEXT_PATH;

export function batchAddRoutes(roleId, routeIds) {
  return request({
    url: `${BASE_URL}/role/route/batch/${roleId}`,
    method: 'post',
    data: routeIds
  });
}

export function batchDeleteRoutes(roleId, routeIds) {
  return request({
    url: `${BASE_URL}/role/route/batch/${roleId}`,
    method: 'delete',
    data: routeIds
  });
}

export function batchAddRoles(uuid, roleIds) {
  return request({
    url: `${BASE_URL}/account/role/batch/${uuid}`,
    method: 'post',
    data: roleIds
  });
}

export function batchDeleteRoles(uuid, roleIds) {
  return request({
    url: `${BASE_URL}/account/role/batch/${uuid}`,
    method: 'delete',
    data: roleIds
  });
}
