import { createBaseStore } from '@/store/base-store';
import { ACCOUNT_TYPE } from '@/utils/constant';
import { deepClone, objectMerge } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,
    account: null,
    type: null,
    typeName: null,
    state: null,
    stateName: null,
    device: null,
    lastLoginAt: null,
    user: {
      mobile: null,
      name: null,
      gender: null,
      genderName: null
    },
    tenant: {},
    accountRoles: [],
    roles: [],
    routes: [],
    remark: [],
    remarkContent: null
  };
  return objectMerge(target, model);
};

export default createBaseStore(
  {
    state: {
      defaultInfo: {
        password: ''
      }
    }
  },
  {
    orderParams: {
      desc: 'uuid'
    },
    contextPath: '/account',
    createModel,
    cutBeforeUpdate(model) {
      const d = deepClone(model);
      if (d.account && typeof d.account === 'object') {
        d.account.type = ACCOUNT_TYPE;
      }
      d.type = ACCOUNT_TYPE;
      d.remark = null;
      return d;
    }
  }
);
