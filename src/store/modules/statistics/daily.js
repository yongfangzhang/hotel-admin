import { createBaseStore } from '@/store/base-store';
import { objectMerge } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,

    channel: null,
    channelName: null,
    originalPrice: null,
    paidPrice: null,
    deposit: null,
    depositRefunded: null,
    depositDeduction: null,
    saleTimes: null,
    statisticsDate: null,

    remark: [],
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
    contextPath: '/daily/statistics',
    createModel
  }
);
