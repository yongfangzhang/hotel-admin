import { updateRoomPrice } from '@/api/room';
import { createBaseStore } from '@/store/base-store';
import { ACTIONS, MUTATIONS } from '@/store/constant';
import { objectMerge } from '@/utils/index';
import { getLocal, setLocal } from '@/utils/storage';

const LOCAL_KEY = {
  ROOM_SETTING: '_yhkz_room_setting'
};
const DEFAULT_SETTING = {
  showFloorNumber: true,
  showUnitNumber: true,
  colSpan: 6,
  rowHeight: 130
};

export const createModel = (model = {}) => {
  const target = {
    uuid: null,

    apartmentUuid: null,
    typeUuid: null,
    floorNumber: null,
    unitNumber: null,
    number: null,
    price: 100,
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
    state: {
      roomSetting: {
        ...DEFAULT_SETTING,
        ...(getLocal(LOCAL_KEY.ROOM_SETTING) || {})
      }
    },
    actions: {
      [ACTIONS.UPDATE_ROOM_PRICE](uuid, model) {
        return updateRoomPrice(uuid, model);
      }
    },
    mutations: {
      [MUTATIONS.UPDATE_ROOM_SETTING](state, payload = {}) {
        state.roomSetting = { ...DEFAULT_SETTING, ...payload };
        setLocal(LOCAL_KEY.ROOM_SETTING, state.roomSetting);
      }
    }
  },
  {
    orderParams: {
      desc: 'uuid'
    },
    contextPath: '/room',
    createModel
  }
);
