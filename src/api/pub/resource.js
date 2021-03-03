import request from '@/utils/request';

const BASE_URL = '/pub/resource';

export function getResource(uuid) {
  return request({
    url: `${BASE_URL}/${uuid}`,
    method: 'get'
  });
}

export function uuid2Url(uuid) {
  return `${process.env.VUE_APP_BASE_API}${BASE_URL}/file/${uuid}`;
}

export const files2ElList = (files) => {
  if (!files) return [];
  if (!Array.isArray(files)) files = [files];
  return files
    .filter((file) => !!file && typeof file === 'object')
    .map((file) => {
      return {
        name: file.fileName,
        url: uuid2Url(file.uuid),
        type: file.fileType,
        size: file.fileSize
      };
    });
};
