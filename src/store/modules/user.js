import {
  getInfo,
  login,
  logout,
  fetchUserXsList
} from '@/api/account/passport';
import { resetRouter } from '@/router';
import { removeToken, setToken } from '@/utils/auth';
import { ACTIONS } from '../constant';

const state = {
  accountInfo: {}
};

const mutations = {
  SET_ACCOUNT_INFO: (state, payload) => {
    state.accountInfo = payload;
  }
};

const actions = {
  // user login
  login({ commit }, form) {
    return new Promise((resolve, reject) => {
      login(form)
        .then(data => {
          commit('SET_ACCOUNT_INFO', data);
          setToken(data.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(data => {
          if (!data) {
            reject('验证失败, 请重新登录.');
          }
          const { routes } = data;

          // routes must be a non-empty array
          if (!routes || routes.length <= 0) {
            reject('请联系管理员分配权限!');
          }
          // commit('SET_NAME', data.user.name);
          commit('SET_ACCOUNT_INFO', data);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          removeToken();
          resetRouter();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken();
      resolve();
    });
  },

  [ACTIONS.FETCH_LIST]() {
    return fetchUserXsList();
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
