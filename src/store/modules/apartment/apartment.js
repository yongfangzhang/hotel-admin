import { createBaseStore } from '@/store/base-store';
import { objectMerge } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,

    name: null,
    shortName: null,
    areaCode: null,
    address: null,
    longitude: null,
    latitude: null,
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
      asc: 'uuid'
    },
    contextPath: '/apartment',
    createModel
  }
);
