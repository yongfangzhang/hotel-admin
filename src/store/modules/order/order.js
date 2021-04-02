import { createBaseStore } from '@/store/base-store';
import { objectMerge, parseTime } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,

    apartmentUuid: null,
    userUuid: null,
    number: null,
    bizNumber: null,
    channel: 1,
    originalPrice: null,
    paidPrice: null,
    state: 2,
    type: 1,
    userType: 1,
    accountType: 2,
    deposit: null,
    depositState: 1,
    depositDeduction: null,
    depositRefunded: null,
    paidAt: parseTime(new Date()),
    canceledAt: null,
    finishedAt: null,
    commentedAt: null,
    channelName: null,
    stateName: null,
    typeName: null,
    items: [],

    description: null,
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
    contextPath: '/order',
    createModel
  }
);
