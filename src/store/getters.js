const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.accountInfo.token,
  name: (state) => state.user.accountInfo.user.name,
  account: (state) => state.user.accountInfo.account,
  routes: (state) => state.permission.routes,
  enums: (state) => state.enums.enum
};
export default getters;
