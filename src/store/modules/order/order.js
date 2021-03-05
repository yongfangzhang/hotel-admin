import { createBaseStore } from '@/store/base-store';
import { objectMerge } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,

    apartmentUuid: null,
    userUuid: null,
    number: null,
    channel: null,
    originalPrice: null,
    paidPrice: null,
    state: null,
    type: null,
    userType: null,
    accountType: null,
    paidAt: null,
    canceledAt: null,
    finishedAt: null,
    commentedAt: null,
    channelName: null,
    stateName: null,
    typeName: null,

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
    contextPath: '/order',
    createModel
  }
);
