import { createBaseStore } from '@/store/base-store';

export default createBaseStore(
  {},
  {
    orderParams: {
      desc: 'uuid'
    },
    contextPath: '/role/route'
  }
);
