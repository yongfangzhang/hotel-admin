import { ACTIONS, MUTATIONS } from '@/store/constant';
import { getLocal, setLocal } from '@/utils/storage';
import { getEnum } from '@/api/pub/enum';

const LOCAL_KEY = {
  ENUM: '_yhkz_enum',
  ENUM_MAP: '_yhkz_enum_map',
  ROOM_STATE_THEME_MAP: '_yhkz_room_state_theme_map'
};

export default {
  namespaced: true,
  state: {
    enum: getLocal(LOCAL_KEY.ENUM),
    enumMap: getLocal(LOCAL_KEY.ENUM_MAP),
    roomStateThemeMap: getLocal(LOCAL_KEY.ROOM_STATE_THEME_MAP) || {}
  },
  getters: {
    ACCOUNT_TYPE(state) {
      return state.enum.AccountType;
    },
    APARTMENT_STATE(state) {
      return state.enum.ApartmentState;
    },
    BASE_ENUM(state) {
      return state.enum.BaseEnum;
    },
    CUSTOMER_CHANNEL(state) {
      return state.enum.CustomerChannel;
    },
    ERROR_CODE(state) {
      return state.enum.ErrorCode;
    },
    FILE_TYPE(state) {
      return state.enum.FileType;
    },
    GENDER(state) {
      return state.enum.Gender;
    },
    OPERATION(state) {
      return state.enum.Operation;
    },
    OPERATION_TARGET(state) {
      return state.enum.OperationTarget;
    },
    ORDER_CHANNEL(state) {
      return state.enum.OrderChannel;
    },
    ORDER_STATE(state) {
      return state.enum.OrderState;
    },
    ORDER_TYPE(state) {
      return state.enum.OrderType;
    },
    ORDER_USER_TYPE(state) {
      return state.enum.OrderUserType;
    },
    RESOURCE_TYPE(state) {
      return state.enum.ResourceType;
    },
    ROLE_TYPE(state) {
      return state.enum.RoleType;
    },
    ROOM_PRICE_TYPE(state) {
      return state.enum.RoomPriceType;
    },
    ROOM_STATE(state) {
      return state.enum.RoomState;
    },
    ROUTE_TYPE(state) {
      return state.enum.RouteType;
    },
    USER_STATE(state) {
      return state.enum.UserState;
    },
    LODGING_TYPE(state) {
      return state.enum.LodgingType;
    },
    DEPOSIT_STATE(state) {
      return state.enum.DepositState;
    },
    ACCOUNT_TYPE_MAP(state) {
      return state.enumMap.AccountType;
    },
    APARTMENT_STATE_MAP(state) {
      return state.enumMap.ApartmentState;
    },
    BASE_ENUM_MAP(state) {
      return state.enumMap.BaseEnum;
    },
    CUSTOMER_CHANNEL_MAP(state) {
      return state.enumMap.CustomerChannel;
    },
    ERROR_CODE_MAP(state) {
      return state.enumMap.ErrorCode;
    },
    FILE_TYPE_MAP(state) {
      return state.enumMap.FileType;
    },
    GENDER_MAP(state) {
      return state.enumMap.Gender;
    },
    OPERATION_MAP(state) {
      return state.enumMap.Operation;
    },
    OPERATION_TARGET_MAP(state) {
      return state.enumMap.OperationTarget;
    },
    ORDER_CHANNEL_MAP(state) {
      return state.enumMap.OrderChannel;
    },
    ORDER_STATE_MAP(state) {
      return state.enumMap.OrderState;
    },
    ORDER_TYPE_MAP(state) {
      return state.enumMap.OrderType;
    },
    ORDER_USER_TYPE_MAP(state) {
      return state.enumMap.OrderUserType;
    },
    RESOURCE_TYPE_MAP(state) {
      return state.enumMap.ResourceType;
    },
    ROLE_TYPE_MAP(state) {
      return state.enumMap.RoleType;
    },
    ROOM_PRICE_TYPE_MAP(state) {
      return state.enumMap.RoomPriceType;
    },
    ROOM_STATE_MAP(state) {
      return state.enumMap.RoomState;
    },
    ROUTE_TYPE_MAP(state) {
      return state.enumMap.RouteType;
    },
    USER_STATE_MAP(state) {
      return state.enumMap.UserState;
    },
    LODGING_TYPE_MAP(state) {
      return state.enumMap.LodgingType;
    },
    DEPOSIT_STATE_MAP(state) {
      return state.enumMap.DepositState;
    },

    // extral
    USER_STATE_THEME_MAP(state, getters) {
      return {
        [getters.USER_STATE.NORMAL]: 'success',
        [getters.USER_STATE.FORBIDDEN]: 'warning',
        [getters.USER_STATE.DELETED]: 'danger'
      };
    },
    GENDER_THEME_MAP(state, getters) {
      return {
        [getters.GENDER.MALE]: 'primary',
        [getters.GENDER.FEMALE]: 'danger'
      };
    },
    BOOLEAN_FLAG() {
      return {
        TRUE: 1,
        FALSE: 0
      };
    },
    BOOLEAN_FLAG_MAP() {
      return {
        1: '???',
        0: '???'
      };
    },
    APARTMENT_STATE_THEME_MAP(state, getters) {
      return {
        [getters.APARTMENT_STATE.NORMAL]: 'primary',
        [getters.APARTMENT_STATE.FORBIDDEN]: 'warning'
        // [getters.APARTMENT_STATE.DELETED]: 'danger'
      };
    },
    OPERATION_THEME_MAP(state, getters) {
      return {
        [getters.OPERATION.CREATE]: 'primary',
        [getters.OPERATION.UPDATE]: 'warning',
        [getters.OPERATION.DELETE]: 'danger',
        [getters.OPERATION.RETRIEVE]: 'info',
        [getters.OPERATION.LOGIN]: 'info',
        [getters.OPERATION.LOGOUT]: 'info'
      };
    },
    ROOM_STATE_THEME_MAP(state, getters) {
      return {
        [getters.ROOM_STATE.EMPTY_CLEAN]: '',
        [getters.ROOM_STATE.EMPTY_DARTY]: '#f39202',
        [getters.ROOM_STATE.STAY_CLEAN]: '#67c23a',
        [getters.ROOM_STATE.STAY_DARTY]: '#409eff',
        [getters.ROOM_STATE.FORBIDDEN]: '#ff4139',
        ...state.roomStateThemeMap
      };
    },
    DEPOSIT_STATE_THEME_MAP(state, getters) {
      return {
        [getters.DEPOSIT_STATE.NONE]: 'info',
        [getters.DEPOSIT_STATE.PAID]: 'primary',
        [getters.DEPOSIT_STATE.UNPAID]: 'danger',
        [getters.DEPOSIT_STATE.REFUNDED]: 'success'
      };
    },
    ORDER_STATE_THEME_MAP(state, getters) {
      return {
        [getters.ORDER_STATE.UNPAID]: 'danger',
        [getters.ORDER_STATE.UNUSED]: 'warning',
        [getters.ORDER_STATE.USED]: 'primary',
        [getters.ORDER_STATE.FINISHED]: 'success',
        [getters.ORDER_STATE.CANCELD]: 'info',
        [getters.ORDER_STATE.ABANDON]: 'info'
      };
    }
  },
  mutations: {
    [MUTATIONS.SET_ENUM](state, val) {
      if (!val) return;
      state.enum = val.enum;
      state.enumMap = val.enumMap;
      setLocal(LOCAL_KEY.ENUM, state.enum);
      setLocal(LOCAL_KEY.ENUM_MAP, state.enumMap);
    },
    [MUTATIONS.UPDATE_ROOM_STATE_THEME_MAP](state, payload) {
      state.roomStateThemeMap = payload || {};
      setLocal(LOCAL_KEY.ROOM_STATE_THEME_MAP, payload);
    }
  },
  actions: {
    [ACTIONS.FETCH_ENUM]({ commit }) {
      return getEnum().then(d => {
        commit(MUTATIONS.SET_ENUM, d);
      });
    }
  }
};
