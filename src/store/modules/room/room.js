import { updateRoomPrice } from '@/api/room';
import { createBaseStore } from '@/store/base-store';
import { ACTIONS } from '@/store/constant';
import { objectMerge } from '@/utils/index';

export const createModel = (model = {}) => {
  const target = {
    uuid: null,

    apartmentUuid: null,
    typeUuid: null,
    floorNumber: null,
    unitNumber: null,
    number: null,
    price: null,
    state: null,
    saleTimes: null,
    income: null,
    prices: [],
    stateName: null,

    description: null,
    remarkContent: null
  };
  return objectMerge(target, model);
};

export default createBaseStore(
  {
    actions: {
      [ACTIONS.UPDATE_ROOM_PRICE](uuid, model) {
        return updateRoomPrice(uuid, model);
      }
    }
  },
  {
    orderParams: {
      asc: 'uuid'
    },
    contextPath: '/room',
    createModel
  }
);
