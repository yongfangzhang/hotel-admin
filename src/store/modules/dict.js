import { createBaseStore } from '@/store/base-store';
import { ACTIONS, MUTATIONS } from '@/store/constant';
import {
  deepClone,
  str2Obj,
  obj2Str,
  list2GroupMap,
  tree2List,
  list2Map
} from '@/utils/index';
import { fetchDictTree } from '@/api/pub/dict';
import { setLocal, getLocal } from '@/utils/storage';

const LOCAL_KEY = {
  DICT: '_yhkz_dict'
};

export const DICT_TYPE = {
  INSURANCE_PERIOD: 1,
  PAYMENT_MODE: 2,
  PAYMENT_PERIOD: 3,
  CALC_TYPE: 4,
  SALES_CHANNEL: 5,
  DISEASE_CATEGORY: 6
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
      INSURANCE_PERIOD_MAP(state, getters) {
        const ipl = getters.dictGroupMap[DICT_TYPE.INSURANCE_PERIOD] || [];
        return list2Map(ipl, 'value', 'name');
      },
      PAYMENT_MODE_MAP(state, getters) {
        const pml = getters.dictGroupMap[DICT_TYPE.PAYMENT_MODE] || [];
        return list2Map(pml, 'value', 'name');
      },
      PAYMENT_PERIOD_MAP(state, getters) {
        const ppl = getters.dictGroupMap[DICT_TYPE.PAYMENT_PERIOD] || [];
        return list2Map(ppl, 'value', 'name');
      },
      CUS_INCOME(state) {
        const children = state.dictTree[0].children;
        const arr = children.filter(item => item.code === 'CUS_INCOME');
        const childArr = arr[0].children;
        const obj = {};
        childArr.forEach(item => {
          obj[item.value] = item.name;
        });
        return obj;
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
      desc: 'id'
    },
    contextPath: '/tsystem/dict',
    cutBeforeUpdate(model) {
      const d = deepClone(model);
      d.extendField = obj2Str(d.extendField) || '{}';
      d.description = d.description || '';
      d.parentId = null;
      d.code = null;
      d.value = null;
      d.type = null;
      d.children = null;
      d.createdAt = null;
      return d;
    }
  }
);
