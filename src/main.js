import Vue from 'vue';

import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Element from 'element-ui';
import './styles/element-variables.scss';

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store/index';
import router from './router/index';

import '@/assets/icons/index'; // icon
import './permission'; // permission control
import './components';
import * as filters from '@/filters'; // global filters
import { baseMixin } from '@/utils/mixins';
import '@/components/index';
import '@/plugins/index';

Vue.use(Element, {
  size: 'mini' // set element-ui default size
});

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

Vue.mixin(baseMixin);

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
});
