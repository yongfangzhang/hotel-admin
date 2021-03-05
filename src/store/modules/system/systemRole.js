import { createBaseStore } from '@/store/base-store';
import { ACCOUNT_TYPE } from '@/utils/constant';
import { deepClone, objectMerge } from '@/utils/index';

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
    createModel,
    cutBeforeUpdate(model) {
      const d = deepClone(model);
      d.accountType = ACCOUNT_TYPE;
      d.remark = null;
      return d;
    }
  }
);
