import { createBaseStore } from '@/store/base-store';
import { objectMerge } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,

    name: null,
    shortName: null,
    areaCode: '371302',
    address: null,
    longitude: 1,
    latitude: 1,
    geohash4: null,
    contactor: null,
    contactorMobile: null,
    state: null,
    saleTimes: null,
    income: null,
    stateName: null,

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
    contextPath: '/apartment',
    createModel
  }
);
