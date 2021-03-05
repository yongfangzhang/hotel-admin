import { createBaseStore } from '@/store/base-store';
import { objectMerge } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,
    name: null,
    accountType: null,
    editable: true,
    routes: [],
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
    contextPath: '/role',
    createModel
  }
);
