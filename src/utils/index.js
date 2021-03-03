import { Message } from 'element-ui';

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  if (time == null) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

/*
 * 单证生成随机20位数  yyyyMMddHHmmss，再加上6位随机数
 * */

export function productRandomDocNumber() {
  const str1 = parseTime(new Date(), '{y}{m}{d}{h}{i}{s}');
  const str2 = Math.round(Math.random() * 1000000);
  return str1 + str2;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {string} input filesize
 * @returns {number} output value
 */
export function friendlyFileSize(byteSize) {
  if (byteSize == null || byteSize === '') {
    return '0 Bytes';
  }
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  const srcSize = parseFloat(byteSize);
  index = Math.floor(Math.log(srcSize) / Math.log(1024));
  let size = srcSize / Math.pow(1024, index);
  size = size.toFixed(2); // 保留的小数位数
  return size + unitArr[index];
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object' || target === null) {
    target = {};
  }
  if (typeof source !== 'object' || source === null) {
    return target;
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object' && sourceProperty) {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export function isEmpty(v) {
  return v === null || typeof v === 'undefined' || v === '';
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  return str2Obj(obj2Str(source));
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + '';
  const randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

/**
 * convert object to string
 * @param {*} obj
 * @param {*} spacer
 */
export const obj2Str = (obj, spacer) => {
  if (obj == null || typeof obj === 'string') return obj;
  return JSON.stringify(obj, null, spacer);
};

/**
 * convert string to object
 * @param {*} str
 */
export const str2Obj = (str) => {
  if (!str || typeof str !== 'string') return str;
  try {
    return JSON.parse(str);
  } catch (error) {
    return str;
  }
};

export const countChildren = (tree) => {
  if (!tree || !tree.length) {
    return 0;
  }
  let count = tree.length;
  tree.forEach((t) => {
    count += countChildren(t.children);
  });
  return count;
};

export const tree2List = (tree) => {
  let list = [];
  if (!tree) {
    return list;
  }
  if (!Array.isArray(tree)) {
    tree = [tree];
  }
  if (!tree.length) {
    return list;
  }
  list = list.concat(tree);
  tree.forEach((t) => {
    list = list.concat(tree2List(t.children));
  });
  return list;
};

export const tree2Map = (map, tree, k = 'id') => {
  if (!tree) {
    return map;
  }
  if (!Array.isArray(tree)) {
    tree = [tree];
  }
  if (!tree.length) {
    return map;
  }
  tree.forEach((t) => {
    map[t[k]] = t;
    tree2Map(map, t.children, k);
  });
  return map;
};

export const getValueByKeys = (obj, key) => {
  // x.y.@0.s
  let v = obj;
  if (!v || !key) return null;
  if (key.indexOf('.') < 0) return obj[key];
  const arrReg = new RegExp(/^@(\d+)$/, 'g');
  key.split('.').forEach((k) => {
    if (isEmpty(v) || typeof v !== 'object') return;
    const arrRet = arrReg.exec(k);
    if (arrRet) {
      // 数组
      v = v[arrRet[1]];
    } else {
      v = v[k];
    }
  });
  return v;
};

const getValueByKey = (obj, key) => {
  let ret = deepClone(obj);
  key.split('.').forEach((k) => {
    ret = ret[k];
  });
  return ret;
};

export const list2Map = (list, k, v) => {
  const map = {};
  if (!list || !list.length) return map;
  list.forEach((item) => {
    map[getValueByKey(item, k)] =
      typeof v === 'undefined' || v === null ? item : getValueByKey(item, v);
  });
  return map;
};

export const list2GroupMap = (list, k) => {
  const map = {};
  list.forEach((item) => {
    if (!map[item[k]]) {
      map[item[k]] = [];
    }
    map[item[k]].push(item);
  });
  return map;
};

export const randomString = (count) => {
  return (1e9 * Math.random()).toString(26).replace('.', '').substring(4);
};

export const generateUuid = () => {
  return randomString(4) + randomString(4) + randomString(8) + randomString(16);
};

export const formatDuration = (startTime, endTime) => {
  if (!startTime) return 0;
  const startDate = new Date(startTime);
  const endDate = endTime ? new Date(endTime) : new Date();
  const diff = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(diff / 3600 / 1000);
  const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  return `${hours}小时${minutes}分钟${seconds}秒`;
};

export const removeByKeyValue = (arr, k, v) => {
  if (!arr || arr.length === 0) return;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i][k] !== v) continue;
    arr.splice(i, 1);
    break;
  }
};

export const str2Date = (str) => {
  try {
    const strArr = str.split(/-|\s|:/g);
    const d = new Date(
      strArr[0], // y
      strArr[1] - 1 || 0, // m - 1
      strArr[2] || 0, // d
      strArr[3] || 0, // h
      strArr[4] || 0, // m
      strArr[5] || 0 // s
    );
    return d;
  } catch (ex) {
    console.error('日期格式错误');
    return null;
  }
};

export const str2DateTimestamp = (str) => {
  const d = str2Date(str);
  if (!d) return 0;
  return d.getTime();
};

export const saveAs = (file, content) => {
  const data = new Blob([content], { type: 'text/plain;charset=UTF-8' });
  const downloadUrl = window.URL.createObjectURL(data);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = file;
  anchor.click();
  window.URL.revokeObjectURL(data);
};

export const isObject = (o) => {
  return (
    typeof o === 'object' &&
    o !== null &&
    o.constructor &&
    o.constructor === Object
  );
};

export const deepExtend = (...args) => {
  const to = Object(args[0]);
  for (let i = 1; i < args.length; i += 1) {
    const nextSource = args[i];
    if (nextSource !== undefined && nextSource !== null) {
      const keysArray = Object.keys(Object(nextSource));
      for (
        let nextIndex = 0, len = keysArray.length;
        nextIndex < len;
        nextIndex += 1
      ) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            deepExtend(to[nextKey], nextSource[nextKey]);
          } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            to[nextKey] = {};
            deepExtend(to[nextKey], nextSource[nextKey]);
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
};

/**
 * list [value...]
 * map { value: name}
 */
export const filterMapByList = (map, list) => {
  if (!map || !list) return {};
  const rtn = {};
  list.forEach((item) => {
    rtn[item] = map[item];
  });
  return rtn;
};

/**
 * find idx of given key-value in list
 */
export const findIdx = (list, key, value) => {
  let idx = -1;
  if (!list) return idx;
  for (let i = 0; i < list.length; i++) {
    if (list[i][key] === value) {
      idx = i;
    }
  }
  return idx;
};

/*
 * 格式化 货币
 * */

export const toThousands = (num) => {
  if (!num) return 0;
  const c =
    num.toString().indexOf('.') !== -1
      ? num.toLocaleString()
      : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return c;
};

/**
 * 下载文件
 * @param {二进制流} data
 * @param {文件名} name
 */
export const downloadFile = (data, name) => {
  let suffix = '';
  switch (data.type) {
    case 'application/vnd.ms-excel':
      suffix = 'xls';
      break;
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      suffix = 'xlsx';
      break;
    case 'application/json':
      Message({ message: '文件导出错误', type: 'error' });
      return;
  }
  const fileName = `${name}.${suffix}`;
  const blob = new Blob([data], { type: data.type });
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
};

/**
 * base64转码
 * @param {*} data
 */
export const base64Encode = (data) => {
  let rv;
  rv = encodeURIComponent(data);
  rv = unescape(rv);
  rv = window.btoa(rv);
  return rv;
};

/**
 * 滚动
 * @param {*} name
 */
export function scrollToTab(name) {
  const el = document.querySelector(`#${name}`);
  if (el) el.scrollIntoView(true, { behavior: 'smooth' });
}

export const isBlank = (v) => {
  return isEmpty(v) || isEmpty((v + '').trim());
};

export const isNotBlank = (v) => {
  return !isBlank(v);
};
