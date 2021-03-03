import { ACTIONS, MUTATIONS } from '@/store/constant';
import { getLocal, setLocal } from '@/utils/storage';
import { getEnum } from '@/api/pub/enum';

const LOCAL_KEY = {
  ENUM: '_yhkz_enum',
  ENUM_MAP: '_yhkz_enum_map'
};

export default {
  namespaced: true,
  state: {
    enum: getLocal(LOCAL_KEY.ENUM),
    enumMap: getLocal(LOCAL_KEY.ENUM_MAP)
  },
  getters: {},
  mutations: {
    [MUTATIONS.SET_ENUM](state, val) {
      if (!val) return;
      state.enum = val.enum;
      state.enumMap = val.enumMap;
      setLocal(LOCAL_KEY.ENUM, state.enum);
      setLocal(LOCAL_KEY.ENUM_MAP, state.enumMap);
    }
  },
  actions: {
    [ACTIONS.FETCH_ENUM]({ commit }) {
      return getEnum().then((d) => {
        commit(MUTATIONS.SET_ENUM, d);
      });
    }
  }
};
