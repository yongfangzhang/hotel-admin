export const EMPTY_TEXT = '--';

export const PAGE_SIZE = 10;
export const SELECTOR_SEARCH_LIST_SIZE = 50;

export const ACCOUNT_TYPE = 2;

export const PARSE_TIME_TYPE = {
  YEAR: '{yyyy}',
  MONTH: '{yyyy}-{mm}',
  DATE: '{yyyy}-{mm}-{dd}',
  DATETIME: '{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}'
};

export const VIEW_IMG_TYPE = {
  ID_CARD: 1,
  BUS_LICENSE: 2,
  LOGO: 21
};

export const MAX_UPLOAD_SIZE = {
  LOGO: 100 // 100K
};

export const DESC_BY_UUID = {
  sidx: 'uuid',
  order: 'desc'
};

export const ERROR_CODE = {
  SUCCESS: 0, // 成功
  FAIL: 1, // 请求失败
  RECORD_EXSITED: 2, // 该记录已存在

  REQ_NOT_SUPPORTED: 10, // 请求方法不支持
  REQ_INVALID_PARAMS: 11, // 请求参数错误

  USER_ACCOUNT_EXIST: 20, // 用户账号已存在
  USER_ACCOUNT_PASSWORD_ERROR: 21, // 用户名或密码错误
  USER_ACCOUNT_FORBIDDEN: 22, // 用户已禁用
  USER_ACCOUNT_NOT_EXIST: 23, // 用户账号不存在
  ACCESS_DENIED: 401 // 没有权限
};

export const defaultPageData = () => {
  return {
    currPage: 1,
    list: [],
    pageSize: PAGE_SIZE,
    totalCount: 0,
    totalPage: 0
  };
};

// col1: 独占一列
// col21: 2列, 第一列
// col22: 2列, 第二列
export const FORM_COL_1 = 'col1';
export const FORM_COL_21 = 'col21';
export const FORM_COL_22 = 'col22';

export const FORM_COL_MAP = {
  [FORM_COL_21]: { sm: 12 },
  [FORM_COL_22]: { sm: 12 },
  [FORM_COL_1]: { sm: 24 }
};
/**
 * 常量文件
 */
export const CONST = {
  mxk_CONST: 0,
  mxk_SOCKET_TIMEOUT: 15000,
  mxk_PAGE_SIZE: 20
};

export const SEX = {
  mxk_MALE: 1,
  mxk_FEMALE: 2
};

export const PERSON = {
  mxk_ALL: 0,
  mxk_BBP: 1, // 被保人
  mxk_TBP: 2, // 投保人
  mxk_TBPS: 3, // 投保人配偶
  mxk_BBPS: 4 // 被保人配偶
};

export const AGE = {
  mxk_DEF_AGE: 18,
  mxk_DEF_MIN_AGE: 0,
  mxk_DEF_MAX_AGE: 105
};

export const DATA_TYPE = {
  mxk_BOOLEAN: 1,
  mxk_INTEGER: 2,
  mxk_SEX: 3,
  mxk_DATE: 4
};

export const CALC_MODE = {
  mxk_P2C: 0, // 保费==>保额
  mxk_C2P: 1, // 保额==>保费
  mxk_UMODE: 2, // 万能
  mxk_CP_DISABLED: 3 // 保额保费不可调
};

export const PLAN_TYPE = {
  mxk_MAKE: 1, // 制作
  mxk_COMPARE: 2 // 比较
};

export const PRAISE_TYPE = {
  mxk_SHARE: 1,
  mxk_SHARE_COMMENT: 2,
  mxk_REPORT: 10,
  mxk_REPORT_COMMENT: 11
};

export const COMMENT_TYPE = {
  mxk_SHARE: 1,
  mxk_REPORT: 2
};

export const PAGINATION_SIZE = 10;

export const RESOURCE_TYPE = {
  VIDEO: 1, // 视频
  IMAGE: 2, // 图片
  AUDIO: 3, // 音频
  FILE: 4 // 文件
};

export const ACCEPT_TYPE = {
  [RESOURCE_TYPE.VIDEO]: 'video/*',
  [RESOURCE_TYPE.IMAGE]: 'image/*',
  [RESOURCE_TYPE.AUDIO]: 'audio/*',
  [RESOURCE_TYPE.FILE]: undefined
};

export const MAX_IMAGES_COUNT = 9;

export const AUDIO_MAX_DURATION = 60;

export const CONTENT_TYPE = {
  TEXT: 1, // "文本"
  RICH_TEXT: 2, // "富文本"
  JSON: 3, // "JSON"
  IMAGE: 4, // "图片"
  AUDIO: 5, // "音频"
  VIDEO: 6, // "视频"
  DOCUMENT: 7, // "文档"
  URI: 100 // "链接"
};

export const DATE_TYPE = {
  // TODAY: 0,
  SEVEN_DAY: 1,
  MONTH: 2,
  YEAR: 3
};

export const DATE_TYPE_MAP = {
  // TODAY: 0,
  [DATE_TYPE.SEVEN_DAY]: '近七日',
  [DATE_TYPE.MONTH]: '本月',
  [DATE_TYPE.YEAR]: '本年度'
};

export const MAX_DATE_TIME = '9999-12-31 23:59:59';

export const WEEK_DAY = [
  '周日',
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六'
];
