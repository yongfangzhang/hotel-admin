import { ACTIONS, MUTATIONS } from '@/store/constant';
import { toastSuccess, confirmMessage } from '@/utils/message';
import {
  getModulePage,
  getModuleList,
  getModuleXsList,
  getModuleInfo,
  // getModuleInfoByParams,
  createModule,
  updateModule,
  deleteModule
} from '@/api/base-api';
import { isNotBlank, objectMerge } from '@/utils/index';

export const createBaseStore = (store, options) => {
  // eslint-disable-next-line object-curly-spacing
  const { state = {}, getters = {}, mutations = {}, actions = {} } = store;
  return {
    namespaced: true,
    state: {
      list: [],
      viewInfo: null,
      ...state
    },
    getters: getters,
    mutations: {
      [MUTATIONS.CLEAR_VIEW_PAGE](state) {
        state.viewInfo = null;
        state.list = [];
      },
      [MUTATIONS.SET_VIEW_INFO](state, d) {
        if (!d) state.viewInfo = null;
        else if (d.keys && d.values) {
          // 更新部分键值
          d.keys.forEach((k, idx) => {
            state.viewInfo[k] = d.values[idx];
          });
        } else if (state.defaultInfo) {
          state.viewInfo = deepExtend({}, state.defaultInfo, d);
        } else {
          state.viewInfo = d;
        }
      },
      [MUTATIONS.SET_LIST](state, d) {
        state.list = d;
      },
      ...mutations
    },
    actions: {
      [ACTIONS.FETCH_PAGE_DATA](ctx, params) {
        return getModulePage(
          options.contextPath,
          objectMerge(params, options.orderParams)
        ).then((d) => {
          if (options.formatPageData) {
            d = options.formatPageData(d);
          }
          return Promise.resolve(d);
        });
      },
      [ACTIONS.FETCH_LIST]({ commit, state }, params) {
        if (options.cacheList && state.list && state.list.length > 0) {
          return Promise.resolve(state.list);
        }
        const doCommit = !params || params.commit !== 0;
        return getModuleList(
          options.contextPath,
          objectMerge(params, options.orderParams)
        ).then((d) => {
          if (options.formatList) {
            d = options.formatList(d);
          }
          if (doCommit) {
            commit(MUTATIONS.SET_LIST, d);
          }
          return Promise.resolve(d);
        });
      },
      [ACTIONS.FETCH_XS_LIST](ctx, params) {
        return getModuleXsList(
          options.contextPath,
          objectMerge(params, options.orderParams)
        );
      },
      [ACTIONS.FETCH_VIEW_INFO]({ commit }, id) {
        if (!options.validateId) {
          options.validateId = isNotBlank;
        }
        if (!options.createModel) {
          throw new Error('请实现 createModel 方法');
        }
        if (!options.validateId(id)) {
          const d = options.createModel();
          commit(MUTATIONS.SET_VIEW_INFO, d);
          return Promise.resolve(d);
        }
        return getModuleInfo(options.contextPath, id).then((d) => {
          if (options.cutAfterGet) {
            d = options.cutAfterGet(d);
          }
          commit(MUTATIONS.SET_VIEW_INFO, d);
          return Promise.resolve(d);
        });
      },
      [ACTIONS.CREATE_ITEM]({ commit }, model) {
        if (options.cutBeforeUpdate) {
          model = options.cutBeforeUpdate(model);
        }
        model.remark = null;
        return createModule(options.contextPath, model, options.remainPK).then(
          (d) => {
            if (options.formatUpdateGet && options.cutAfterGet) {
              d = options.cutAfterGet(d);
            }
            commit(MUTATIONS.SET_VIEW_INFO, d);
            toastSuccess();
            return Promise.resolve(d);
          }
        );
      },
      [ACTIONS.UPDATE_ITEM]({ commit }, model) {
        if (options.cutBeforeUpdate) {
          model = options.cutBeforeUpdate(model);
        }
        model.remark = null;
        return updateModule(options.contextPath, model).then((d) => {
          if (options.formatUpdateGet && options.cutAfterGet) {
            d = options.cutAfterGet(d);
          }
          commit(MUTATIONS.SET_VIEW_INFO, d);
          toastSuccess();
          return Promise.resolve(d);
        });
      },
      [ACTIONS.DELETE_ITEM](ctx, id) {
        return confirmMessage('是否确认删除?')
          .then((_) => {
            return deleteModule(options.contextPath, id);
          })
          .then((_) => {
            toastSuccess();
            return Promise.resolve(_);
          });
      },
      ...actions
    }
  };
};
