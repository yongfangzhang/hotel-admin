import { ACTIONS, MUTATIONS } from '@/store/constant';
import { getLocal, setLocal } from '@/utils/storage';
import { getEnum } from '@/api/pub/enum';

const LOCAL_KEY = {
  ENUM: '_yhkz_enum',
  ENUM_MAP: '_yhkz_enum_map'
};

export default {
  namespaced: true,
  state: {
    enum: getLocal(LOCAL_KEY.ENUM),
    enumMap: getLocal(LOCAL_KEY.ENUM_MAP)
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
        1: '是',
        0: '否'
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
        [getters.ROOM_STATE.NORMAL]: 'primary',
        [getters.ROOM_STATE.IN_USE]: 'success',
        [getters.ROOM_STATE.UNCLEAN]: 'warning',
        [getters.ROOM_STATE.FORBIDDEN]: 'info',
        [getters.ROOM_STATE.APARTMENT_FORBIDDEN]: 'danger',
        [getters.ROOM_STATE.APARTMENT_DELETED]: 'danger'
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
