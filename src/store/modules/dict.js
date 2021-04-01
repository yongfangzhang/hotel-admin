import { fetchDictTree } from '@/api/pub/dict';
import { createBaseStore } from '@/store/base-store';
import { ACTIONS, MUTATIONS } from '@/store/constant';
import {
  deepClone,
  list2GroupMap,
  list2Map,
  obj2Str,
  str2Obj,
  tree2List
} from '@/utils/index';
import { getLocal, setLocal } from '@/utils/storage';

const LOCAL_KEY = {
  DICT: '_yhkz_dict'
};

export const DICT_TYPE = {
  ROOM_TYPE: 1,
  SHIFT_TYPE: 2
};

function sortDictTree(array) {
  array = array.sort((a, b) => a.sequence - b.sequence);
  array.forEach(a => {
    a.extendField = str2Obj(a.extendField);
  });
  array.forEach(a => {
    if (a.children) {
      a.children = sortDictTree(a.children);
    }
  });
  return array;
}

export default createBaseStore(
  {
    state: {
      dictTree: getLocal(LOCAL_KEY.DICT)
    },
    getters: {
      dictList(state) {
        if (!state.dictTree) return [];
        return tree2List(state.dictTree);
      },
      dictGroupMap(state, getters) {
        return list2GroupMap(getters.dictList, 'type');
      },
      ROOM_TYPE_MAP(state, getters) {
        const list = getters.dictGroupMap[DICT_TYPE.ROOM_TYPE] || [];
        return list2Map(list, 'uuid', 'name');
      },
      SHIFT_TYPE_MAP(state, getters) {
        const list = getters.dictGroupMap[DICT_TYPE.SHIFT_TYPE] || [];
        const reg = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
        const map = {};
        list.forEach(item => {
          if (!reg.test(item.value)) return;
          map[item.value] = `${item.name}(${item.value})`;
        });
        return map;
      }
    },
    mutations: {
      [MUTATIONS.SET_DICT](state, payload) {
        state.dictTree = payload;
      }
    },
    actions: {
      [ACTIONS.FETCH_DICT]({ commit }) {
        return fetchDictTree().then(r => {
          if (!r) return;
          const sorted = sortDictTree(r);
          setLocal(LOCAL_KEY.DICT, sorted);
          commit(MUTATIONS.SET_DICT, sorted);
          return Promise.resolve(sorted);
        });
      }
    }
  },
  {
    orderParams: {
      desc: 'uuid'
    },
    contextPath: '/pub/dict',
    cutBeforeUpdate(model) {
      const d = deepClone(model);
      d.extendField = obj2Str(d.extendField) || '{}';
      d.description = d.description || '';
      d.parentUuid = null;
      d.code = null;
      // d.value = null;
      // d.type = null;
      d.children = null;
      d.createdAt = null;
      return d;
    }
  }
);
