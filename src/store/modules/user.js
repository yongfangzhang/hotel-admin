import { getInfo, login, logout } from '@/api/account/passport';
import { resetRouter } from '@/router';
import { removeToken, setToken } from '@/utils/auth';
import { list2Map } from '@/utils/index';

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
        .then((data) => {
          commit('SET_ACCOUNT_INFO', data);
          setToken(data.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((data) => {
          if (!data) {
            reject('验证失败，请重新登录.');
          }
          const { routes } = data;

          // routes must be a non-empty array
          if (!routes || routes.length <= 0) {
            reject('请联系管理员分配权限!');
          }
          // commit('SET_NAME', data.info.name);
          commit('SET_ACCOUNT_INFO', data);
          resolve(data);
        })
        .catch((error) => {
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
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken();
      resolve();
    });
  }
};

const getters = {
  userMap(state) {
    return list2Map(state.userList, 'uuid', 'name');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
