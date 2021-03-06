import Vue from 'vue';

let incId = 0;

export const MODULE = {
  APP: 'app',
  USER: 'user',
  ENUMS: 'enums',
  DICT: 'dict',

  APARTMENT: 'apartment',
  ROOM: 'room',
  ROOM_PRICE: 'roomPrice',
  ORDER: 'order',
  ORDER_ITEM: 'orderItem',
  ORDER_PRODUCT: 'orderProduct',
  PRODUCT: 'product',
  DAILY_STATISTICS: 'dailyStatistics',

  SYSTEM_LOG: 'systemLog',
  SYSTEM_ACCOUNT: 'systemAccount',
  SYSTEM_ACCOUNT_ROLE: 'systemAccountRole',
  SYSTEM_ROLE: 'systemRole',
  SYSTEM_ROLE_ROUTE: 'systemRoleRoute',
  SYSTEM_PERMISSION: 'systemPermission'
};

const createMutations = () => {
  return 'Mutations' + incId++;
};

const createActions = () => {
  return 'Actions' + incId++;
};

const createEvents = () => {
  return 'Events' + incId++;
};

export const MUTATIONS = {
  // 通用
  CLEAR_VIEW_PAGE: createMutations(),
  SET_VIEW_INFO: createMutations(),
  SET_LIST: createMutations(),
  UPDATE_ITEM: createMutations(),
  SET_ROUTE_TITLE: createMutations(),
  // 枚举
  SET_ENUM: createMutations(),
  SET_ACCOUNT_INFO: createMutations(),
  // 字典
  SET_DICT: createMutations(),
  // 房间
  UPDATE_ROOM_STATE_THEME_MAP: createMutations(),
  UPDATE_ROOM_SETTING: createMutations()
};

export const ACTIONS = {
  // 通用
  FETCH_PAGE_DATA: createActions(),
  FETCH_LIST: createActions(),
  FETCH_MAP: createActions(),
  FETCH_XS_LIST: createActions(),
  FETCH_VIEW_INFO: createActions(),
  DELETE_ITEM: createActions(),
  CREATE_ITEM: createActions(),
  BATCH_CREATE_ITEM: createActions(),
  UPDATE_ITEM: createActions(),
  // 枚举
  FETCH_ENUM: createActions(),
  // 房间价格
  UPDATE_ROOM_PRICE: createActions(),
  // 字典
  FETCH_DICT: createActions()
};

export const EVENT = {
  CLOSE_SELECTED_TAG: createEvents(),
  PAGE_TITLE: createEvents()
};

export const eventBiz = new Vue({});
