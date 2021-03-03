import request from '@/utils/request';
import { deepClone } from '@/utils/index';

export const getModulePage = (contextPath, params) => {
  return request({
    url: `${contextPath}/page`,
    params
  });
};

export const getModuleList = (contextPath, params) => {
  return request({
    url: `${contextPath}/list`,
    params
  });
};

export const getModuleXsList = (contextPath, params) => {
  return request({
    url: `${contextPath}/list/xs`,
    params
  });
};

export const getModuleInfo = (contextPath, uuid) => {
  return request({
    url: `${contextPath}/${uuid}`
  });
};

export const getModuleInfoByParams = (contextPath, params) => {
  return request({
    url: contextPath,
    params
  });
};

export const createModule = (contextPath, oriData, remainPK = false) => {
  const data = deepClone(oriData);
  if (!remainPK) {
    data.uuid = null;
  }
  return request({
    url: contextPath,
    data,
    method: 'post'
  });
};

export const updateModule = (contextPath, oriData) => {
  const data = deepClone(oriData);
  return request({
    url: contextPath,
    data: deepClone(data),
    method: 'put'
  });
};

export const deleteModule = (contextPath, uuid) => {
  return request({
    url: `${contextPath}/${uuid}`,
    method: 'delete'
  });
};
