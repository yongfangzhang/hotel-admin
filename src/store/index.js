import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import system from './modules/system/index';
import apartment from './modules/apartment/index';
import order from './modules/order/index';
import room from './modules/room/index';
import product from './modules/product/index';
import statistics from './modules/statistics/index';

Vue.use(Vuex);

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

const store = new Vuex.Store({
  modules: {
    ...modules,
    ...system,
    ...apartment,
    ...order,
    ...room,
    ...product,
    ...statistics
  },
  getters
});

export default store;
