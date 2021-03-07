import {
  getAreaInfo,
  getAreaList,
  getCityList,
  getProvinceList
} from '@/api/pub/address';
import { getResource } from '@/api/pub/resource';
import { ACTIONS, EVENT, eventBiz, MODULE, MUTATIONS } from '@/store/constant';
import { getToken, TokenKey } from '@/utils/auth';
import { obj2Str, parseTime, validateId } from '@/utils/index';
import { getLocal, setLocal } from '@/utils/storage';
import { mapGetters, mapMutations } from 'vuex';
import { EMPTY_TEXT, PAGE_SIZE, PARSE_TIME_TYPE } from './constant';
import { getValueByKeys, objectMerge } from './index';
import sync from './sync';

const BASE_API = process.env.VUE_APP_BASE_API;
export const UPLOAD_URL = `${BASE_API}${
  process.env.VUE_APP_CONTEXT_PATH_PUB
}/upload`;

export const RES_PREFIX = `${BASE_API}/files`;

export const baseMixin = {
  data() {
    return {
      rowGutter: 0,
      uploadUrl: UPLOAD_URL,
      requestHeaders: {
        [TokenKey]: getToken()
      },
      dateTimePattern: PARSE_TIME_TYPE.DATETIME
    };
  },
  computed: {
    ...mapGetters(MODULE.ENUMS, [
      'ACCOUNT_TYPE',
      'APARTMENT_STATE',
      'BASE_ENUM',
      'CUSTOMER_CHANNEL',
      'ERROR_CODE',
      'FILE_TYPE',
      'GENDER',
      'OPERATION',
      'OPERATION_TARGET',
      'ORDER_CHANNEL',
      'ORDER_STATE',
      'ORDER_TYPE',
      'ORDER_USER_TYPE',
      'RESOURCE_TYPE',
      'ROLE_TYPE',
      'ROOM_PRICE_TYPE',
      'ROOM_STATE',
      'ROUTE_TYPE',
      'USER_STATE',
      'ACCOUNT_TYPE_MAP',
      'APARTMENT_STATE_MAP',
      'BASE_ENUM_MAP',
      'CUSTOMER_CHANNEL_MAP',
      'ERROR_CODE_MAP',
      'FILE_TYPE_MAP',
      'GENDER_MAP',
      'OPERATION_MAP',
      'OPERATION_TARGET_MAP',
      'ORDER_CHANNEL_MAP',
      'ORDER_STATE_MAP',
      'ORDER_TYPE_MAP',
      'ORDER_USER_TYPE_MAP',
      'RESOURCE_TYPE_MAP',
      'ROLE_TYPE_MAP',
      'ROOM_PRICE_TYPE_MAP',
      'ROOM_STATE_MAP',
      'ROUTE_TYPE_MAP',
      'USER_STATE_MAP',
      // extral
      'USER_STATE_THEME_MAP',
      'GENDER_THEME_MAP',
      'BOOLEAN_FLAG',
      'BOOLEAN_FLAG_MAP',
      'APARTMENT_STATE_THEME_MAP',
      'OPERATION_THEME_MAP'
    ]),
    formWidth() {
      // 基础留白50px, 单个字12px
      return {
        w3: '86px',
        w4: '98px',
        w5: '110px',
        w6: '122px',
        w8: '146px'
      };
    },
    formLabelWidth() {
      return {
        w3: '45px',
        w4: '60px',
        w5: '80px',
        w6: '90px',
        w7: '110px',
        w8: '120px'
      };
    },
    dialogWidth() {
      return {
        xs: '30%',
        sm: '50%',
        sm2: '60%',
        md: '70%',
        lg: '85%'
      };
    },
    colWidth() {
      return {
        xxs: 60,
        xs: 80,
        sm: 100,
        nm: 140,
        md: 170,
        lg: 200,
        op4: 180, // 4个操作按钮
        op3: 140, // 3个操作按钮
        op2: 100, // 2个操作按钮
        op1: 50, // 1个操作按钮
        date: 100, // 日期
        datetime: 140, // 时间
        tm: 140, // 时间
        uuid: 160,
        website: 300,
        longName: 300,
        compname: 250
      };
    }
  },
  methods: {
    doAction(module, action, payload) {
      return this.$store.dispatch(`${module}/${action}`, payload);
    },
    doMutation(module, mutation, payload) {
      return this.$store.commit(`${module}/${mutation}`, payload);
    },
    parseRoutePath(p, prop) {
      return p.replace(/:[a-zA-Z_\-0-9]+/g, prop);
    },
    toShortUuid(uuid) {
      if (!uuid) return EMPTY_TEXT;
      // return (uuid + '').substring(16) || EMPTY_TEXT;
      // 要全量的
      return uuid + '';
    },
    toFullIndex(
      index,
      pageData = {
        currPage: 1,
        pageSize: PAGE_SIZE
      }
    ) {
      return (pageData.currPage - 1) * pageData.pageSize + index + 1;
    },
    cutText(text, count = 30) {
      if (!text) return EMPTY_TEXT;
      if (typeof text === 'object') text = obj2Str(text);
      if (text.length <= count) return text;
      return text.substring(0, count) + '...';
    },
    parseResourceUrl(res) {
      if (!res) return this.fakeImage();
      if (res.url) return res.url;
      if (typeof res === 'string' && res.length === 32) {
        return `${BASE_API}${
          process.env.VUE_APP_CONTEXT_PATH_PUB
        }/resource/res/${res}`;
      }
      return this.fakeImage();
    },
    formatAmount(amount, decimal = 2) {
      amount = +amount;
      if (isNaN(amount)) return EMPTY_TEXT;
      if (amount > 10000) {
        amount = +Math.round(amount / 10000).toFixed(decimal) + '万';
      }
      return '¥' + amount + '元';
    },
    formatMoney(s) {
      if (s == null) return '';
      s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(2) + '';
      const l = s
        .split('.')[0]
        .split('')
        .reverse();
      const r = s.split('.')[1];
      let t = '';
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
      }
      return (
        '￥' +
        t
          .split('')
          .reverse()
          .join('') +
        '.' +
        r
      );
    },
    formatText(text, defaultText) {
      if (this.isEmpty(text)) {
        return defaultText || EMPTY_TEXT;
      }
      return text;
    },
    formatDate(d) {
      return parseTime(d, PARSE_TIME_TYPE.DATE);
    },
    formatDateTime(d) {
      return parseTime(d);
    },
    onImgError(evt) {
      evt.currentTarget.src = this.fakeImage();
      evt.currentTarget.onerror = null;
    },
    getResourceUrl(visitpath) {
      if (!visitpath) return this.fakeImage();
      return `${RES_PREFIX}${visitpath}`;
    },
    fakeImage(opts = {}) {
      const options = objectMerge(
        {
          width: 100,
          height: 100,
          color: 'eee',
          background: 'eee',
          text: ''
        },
        opts
      );
      return `https://fakeimg.pl/${options.width}x${options.height}/${
        options.background
      }/${options.color}?text=${options.text}`;
    },
    invalidId(id) {
      return +id === 0;
    },
    queryRoute(k) {
      return this.$route.query[k];
    },
    isEmpty(v) {
      return typeof v === 'undefined' || v === null || v === '' || v === 'null';
    },
    hasPermission(perm) {
      return this.$store.state.user.routes.indexOf(perm) > -1;
    },
    $$getValue(obj, k, d) {
      // x.y.@0.s
      if (this.isEmpty(obj)) return d;
      return this.formatText(getValueByKeys(obj, k), d);
    }
  }
};

export const baseTableMixin = {
  computed: {
    _mParam() {
      if (this.mParam) {
        return this.mParam;
      }
      return {
        paramMode: this.paramMode,
        module: this.module,
        editPath: this.editPath,
        viewPath: this.viewPath,
        primaryKey: this.primaryKey
      };
    }
  },
  methods: {
    doFilter() {
      this.$refs.table.fetchPageData(null, true);
    },
    refresh() {
      this.$refs.table.refresh();
    },
    // beforeResetFilter() {
    //
    // },
    resetFilter() {
      if (this.beforeResetFilter !== undefined) {
        this.beforeResetFilter();
      }
      this.queries = this.$options.data().queries;
      this.$nextTick(() => this.doFilter());
    },
    routeByRowPath(row, path) {
      if (!path) throw new Error('未定义了跳转路由');
      const v = row ? row[this._mParam.primaryKey] : '';
      if (this._mParam.paramMode) {
        this.$router.push({
          path,
          query: {
            [this._mParam.primaryKey]: v
          }
        });
      } else {
        this.$router.push(`${path}/${v}`);
      }
    },
    editRow(row) {
      this.routeByRowPath(row, this._mParam.editPath);
    },
    viewRow(row) {
      this.routeByRowPath(row, this._mParam.viewPath);
    },
    deleteRow(row) {
      this.doAction(
        this._mParam.module,
        ACTIONS.DELETE_ITEM,
        row[this._mParam.primaryKey]
      ).then(d => {
        this.refresh();
      });
    },
    saveRow(row) {
      if (this.vDisabled) return Promise.resolve();
      return new Promise(resolve => {
        const method = row[this._mParam.primaryKey]
          ? ACTIONS.UPDATE_ITEM
          : ACTIONS.CREATE_ITEM;
        this.doAction(this._mParam.module, method, row).then(d => {
          this.refresh();
          return resolve(d);
        });
      });
    }
  }
};

export const formEditMixin = {
  props: {
    pk: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      currentFullPath: ''
    };
  },
  computed: {
    viewInfo() {
      return this.$store.state[this._mParam.module].viewInfo;
    },
    newAdded() {
      return (
        !this.viewInfo ||
        !validateId(this.viewInfo[this._mParam.primaryKey || 'uuid'])
      );
    },
    _mParam() {
      if (this.mParam) {
        return this.mParam;
      }
      return {
        paramMode: this.paramMode,
        autoClose: this.autoClose,
        autoBack: this.autoBack,
        primaryKey: this.primaryKey,
        module: this.module
      };
    }
  },
  watch: {
    viewInfo() {
      this[MUTATIONS.SET_ROUTE_TITLE](this.getDefaultTitle());
    }
  },
  mounted() {
    this.initViewInfo();
  },
  activated() {
    this.initViewInfo();
  },
  // deactivated() {
  //   this.doMutation(this._mParam.module, MUTATIONS.CLEAR_VIEW_PAGE);
  // },
  destroyed() {
    this.doMutation(this._mParam.module, MUTATIONS.CLEAR_VIEW_PAGE);
  },
  methods: {
    ...mapMutations(MODULE.APP, [MUTATIONS.SET_ROUTE_TITLE]),
    validateForm(formEl) {
      if (this.customerValidateForm) return this.customerValidateForm();
      let form = formEl || this.$refs.form;
      if (Array.isArray(form)) {
        form = form[0];
      }
      if (!form) return Promise.resolve(true);
      return new Promise(resolve => form.validate(resolve));
    },
    getDefaultTitle() {
      let title = null;
      if (typeof this.getTitle === 'function') {
        title = this.getTitle();
      }
      if (title || this.title) return title || this.title;
      if (!this.viewInfo) return '';
      return this.viewInfo[this.titleKey || 'name'];
    },
    getPrimaryValue() {
      if (!this.viewInfo) return '';
      return this.viewInfo[this._mParam.primaryKey || 'uuid'];
    },
    initViewInfo() {
      // bob. 修改后，返回，有缓存问题
      // if (this.$route.fullPath === this.currentFullPath) {
      //   logger.groupInfo("path", this.currentFullPath, "inited");
      //   return;
      // }
      this.currentFullPath = this.$route.fullPath;
      const k = this._mParam.paramMode
        ? this.queryRoute(this._mParam.primaryKey)
        : this.pk;
      this.doAction(this._mParam.module, ACTIONS.FETCH_VIEW_INFO, k).then(d => {
        if (typeof this.afterFetch === 'function') {
          this.afterFetch(d);
        }
      });
    },
    createOrUpdate(cb, ignoreDisabled) {
      if (!ignoreDisabled && this.vDisabled) return;
      this.validateForm().then(v => {
        if (!v) return;
        const method = this.getPrimaryValue()
          ? ACTIONS.UPDATE_ITEM
          : ACTIONS.CREATE_ITEM;
        this.doAction(this._mParam.module, method, this.viewInfo).then(d => {
          if (typeof cb === 'function') return cb(d);
          if (this._mParam.autoClose) {
            eventBiz.$emit(EVENT.CLOSE_SELECTED_TAG);
          } else if (this._mParam.autoBack) {
            this.$router.back();
          } else {
            this.$emit('next');
          }
        });
      });
    }
  }
};

export const resourceMixin = {
  mixins: [sync],
  props: {
    uuids: {
      type: [Array, String],
      default: null
    }
  },
  data() {
    return {
      fileList: [],
      requestHeaders: {
        [TokenKey]: getToken()
      }
    };
  },
  computed: {
    srcList() {
      const arr = this.fileList.map(f => f.url);
      return arr;
    },
    limitOneSrc() {
      if (!this.srcList.length) return 0;
      return this.srcList[0];
    },
    fileNames() {
      return this.fileList.map(f => f.name);
    }
  },
  mounted() {
    this.initResource(this.uuids);
  },
  methods: {
    resourceFiles2ElList(files) {
      if (!files) return [];
      if (!Array.isArray(files)) files = [files];
      return files
        .filter(file => !!file && typeof file === 'object')
        .map(file => {
          return {
            uuid: file.uuid,
            name: file.fileName,
            url: file.url,
            type: file.type,
            fileType: file.fileType
          };
        });
    },
    initResource(uuids) {
      if (!uuids) return;
      getResource(uuids).then(res => {
        this.fileList = this.resourceFiles2ElList(res);
      });
    }
  }
};

const ADDR_LOCAL_KEY = {
  PROVINCE_LIST: 'provinceList',
  PROVINCE_CITY_MAP: 'provinceCityMap',
  CITY_AREA_MAP: 'cityAreaMap',
  AREA_CODE_MAP: 'areaCodeMap'
};

export const addressMixin = {
  mixins: [sync],
  data() {
    return {
      provinceCode: '',
      cityCode: '',
      provinceList: getLocal(ADDR_LOCAL_KEY.PROVINCE_LIST),
      provinceCityMap: getLocal(ADDR_LOCAL_KEY.PROVINCE_CITY_MAP) || {},
      cityAreaMap: getLocal(ADDR_LOCAL_KEY.CITY_AREA_MAP) || {},
      areaCodeMap: getLocal(ADDR_LOCAL_KEY.AREA_CODE_MAP) || {}
    };
  },
  computed: {
    cityList() {
      return this.provinceCityMap[this.provinceCode] || [];
    },
    areaList() {
      return this.cityAreaMap[this.cityCode] || [];
    },
    fullAreaName() {
      const areaItem = this.areaCodeMap[this.currentValue];
      if (!areaItem) return EMPTY_TEXT;
      let name = areaItem.provinceName;
      if (areaItem.provinceCode === areaItem.cityCode) {
        return name;
      }
      name += areaItem.cityName;
      if (areaItem.cityCode === areaItem.areaCode) {
        return name;
      }
      return name + areaItem.areaName;
    }
  },
  watch: {
    currentValue(v) {
      if (!v) {
        this.provinceCode = '';
        return;
      }
      // 取区域详情
      this.fetchAreaItem(v);
      // this.cityCode = `${v.substring(0, 4)}00`;
    },
    cityCode(v) {
      if (!v) {
        this.currentValue = '';
        return;
      }
      // 取区域列表
      this.fetchAreaList(v).then(list => {
        if (
          !this.currentValue ||
          v.substring(0, 4) !== this.currentValue.substring(0, 4)
        ) {
          this.currentValue = list[0].code;
        }
      });
      this.provinceCode = `${v.substring(0, 2)}0000`;
    },
    provinceCode(v) {
      if (!v) {
        this.cityCode = '';
        return;
      }
      // 取市列表
      this.fetchCityList(v).then(list => {
        if (
          !this.cityCode ||
          v.substring(0, 2) !== this.cityCode.substring(0, 2)
        ) {
          this.cityCode = list[0].code;
        }
      });
    }
  },
  mounted() {
    this.fetchProvinceList();
    this.fetchAreaItem(this.currentValue);
  },
  methods: {
    fetchAreaItem(areaCode) {
      if (!areaCode) return;
      this.cityCode = `${areaCode.substring(0, 4)}00`;
      const areaItem = this.areaCodeMap[areaCode];
      if (areaItem) return Promise.resolve(areaItem);
      return getAreaInfo(areaCode).then(item => {
        this.$set(this.areaCodeMap, areaCode, item);
        setLocal(ADDR_LOCAL_KEY.AREA_CODE_MAP, this.areaCodeMap);
        return Promise.resolve(item);
      });
    },
    fetchProvinceList() {
      if (this.provinceList) return Promise.resolve(this.provinceList);
      return getProvinceList().then(provinces => {
        this.provinceList = provinces;
        setLocal(ADDR_LOCAL_KEY.PROVINCE_LIST, this.provinceList);
        return Promise.resolve(this.provinceList);
      });
    },
    fetchCityList(province) {
      if (!province) return Promise.reject('no province selected');
      const cityList = this.provinceCityMap[province];
      if (cityList) return Promise.resolve(cityList);
      return getCityList(province).then(cities => {
        this.$set(this.provinceCityMap, province, cities);
        setLocal(ADDR_LOCAL_KEY.PROVINCE_CITY_MAP, this.provinceCityMap);
        return Promise.resolve(cities);
      });
    },
    fetchAreaList(city) {
      if (!city) return Promise.reject('no city selected');
      const areaList = this.cityAreaMap[city];
      if (areaList) return Promise.resolve(areaList);
      return getAreaList(city).then(areas => {
        this.$set(this.cityAreaMap, city, areas);
        setLocal(ADDR_LOCAL_KEY.CITY_AREA_MAP, this.cityAreaMap);
        return Promise.resolve(areas);
      });
    }
  }
};
