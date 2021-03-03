import { createBaseStore } from '@/store/base-store';
import { objectMerge, deepClone, isNotBlank } from '@/utils/index';
import { ACTIONS } from '@/store/constant';
import { batchAddRoles, batchDeleteRoles } from '@/api/system/role-route';

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
    user: {},
    tenant: {},
    roles: [],
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
    },
    actions: {
      [ACTIONS.BATCH_ADD_ROLES](ctx, { uuid, roleIds }) {
        return batchAddRoles(uuid, roleIds);
      },
      [ACTIONS.BATCH_DELETE_ROLES](ctx, { uuid, roleIds }) {
        return batchDeleteRoles(uuid, roleIds);
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
      d.remark = null;
      return d;
    }
  }
);
