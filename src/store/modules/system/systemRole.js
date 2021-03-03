import { createBaseStore } from '@/store/base-store';
import { objectMerge } from '@/utils/index';
import { ACTIONS } from '@/store/constant';
import { batchAddRoutes, batchDeleteRoutes } from '@/api/system/role-route';

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
  {
    actions: {
      [ACTIONS.BATCH_ADD_ROUTES](ctx, { roleId, routeIds }) {
        return batchAddRoutes(roleId, routeIds);
      },
      [ACTIONS.BATCH_DELETE_ROUTES](ctx, { roleId, routeIds }) {
        return batchDeleteRoutes(roleId, routeIds);
      }
    }
  },
  {
    orderParams: {
      asc: 'uuid'
    },
    contextPath: '/role',
    createModel
  }
);
