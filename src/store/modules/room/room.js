import { createBaseStore } from '@/store/base-store';
import { objectMerge } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,

    description: null,
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
    contextPath: '/room',
    createModel
  }
);
