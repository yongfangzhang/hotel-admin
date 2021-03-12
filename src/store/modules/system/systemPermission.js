import { createBaseStore } from '@/store/base-store';
import { ACCOUNT_TYPE } from '@/utils/constant';
import { deepClone, objectMerge } from '@/utils/index';

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
      desc: 'uuid'
    },
    contextPath: '/route',
    createModel,
    cutBeforeUpdate(model) {
      const d = deepClone(model);
      d.accountType = ACCOUNT_TYPE;
      d.remark = null;
      return d;
    }
  }
);
