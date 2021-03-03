import { createBaseStore } from '@/store/base-store';
import { isNotBlank, objectMerge } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,
    path: null,
    accountType: null,
    type: null,
    typeName: null,
    permission: [],
    caption: null,
    description: null,
    remark: [],
    remarkContent: null
  };
  return objectMerge(target, model);
};

export default createBaseStore(
  {},
  {
    orderParams: {
      asc: 'uuid'
    },
    contextPath: '/route',
    createModel
  }
);
