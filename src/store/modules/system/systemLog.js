import { createBaseStore } from '@/store/base-store';
// import { ACTIONS } from '@/store/constant';

export default createBaseStore(
  {
    actions: {}
  },
  {
    orderParams: {
      desc: 'id'
    },
    contextPath: '/system/log'
  }
);
