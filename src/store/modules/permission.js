import { asyncRoutes, constantRoutes } from '@/router/index';
import { antPathMatcher } from '@/utils/antPath';
const ignoredPath = ['*', '/404'];
/**
 * @param userRoutes
 * @param route
 */
function hasPermission(userRoutes, route) {
  for (let i = userRoutes.length - 1; i >= 0; i--) {
    const ur = userRoutes[i];

    if (
      route.path === '' ||
      ignoredPath.indexOf(route.path) > -1 ||
      ignoredPath.indexOf(route.redirect) > -1 ||
      antPathMatcher(ur.path, route.path) ||
      antPathMatcher(ur.path, route.redirect)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Filter asynchronous routing tables by recursion
 * @param totalRoutes
 * @param userRoutes
 */
export function filterAsyncRoutes(totalRoutes, userRoutes) {
  const res = [];

  totalRoutes.forEach((route) => {
    const tmp = { ...route };
    if (tmp.children && tmp.children.length) {
      const arr = filterAsyncRoutes(tmp.children, userRoutes);
      if (arr.length) {
        tmp.children = arr;
        res.push(tmp);
      }
    } else if (hasPermission(userRoutes, tmp)) {
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    // state.addRoutes = asyncRoutes;
    // state.routes = constantRoutes.concat(asyncRoutes);
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
  clearRoutes: (state) => {
    state.routes = [];
  }
};

const actions = {
  generateRoutes({ commit }, routes) {
    return new Promise((resolve) => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, routes);
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
