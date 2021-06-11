import { createBaseStore } from '@/store/base-store';

export const createModel = (model = {}) => model;

export default createBaseStore(
  {},
  {
    orderParams: {
      desc: 'uuid'
    },
    contextPath: '/order/product',
    createModel
  }
);
