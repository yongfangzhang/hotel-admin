/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}

/**
 * @param {string} fax
 * @returns {Boolean}
 */
export function validFax(fax) {
  const reg = /^0\d{2,3}(-)?\d{7,8}$/;
  return reg.test(fax);
}

/**
 * @param {string} zip 邮编验证
 * @returns {Boolean}
 */
export function validZip(zip) {
  const reg = /^\d{6}$/;
  return reg.test(zip);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true;
  }
  return false;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
}

export function validMobile(mobile) {
  const reg = /^1\d{10}$/;
  return reg.test(mobile);
}

export function validPassword(pass) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{8,}$/;
  return reg.test(pass);
}

export const emailValidator = (rule, value, callback) => {
  if (validEmail(value)) {
    callback();
  } else {
    callback(new Error('邮箱格式不正确'));
  }
};

/*
* 传真校验
* */

export const faxValidator = (rule, value, callback) => {
  if (validFax(value)) {
    callback();
  } else {
    callback(new Error('传真格式不正确'));
  }
};

/*
* 非必填传真校验
* */

export const faxNrValidator = (rule, value, callback) => {
  if (!value || validFax(value)) {
    callback();
  } else {
    callback(new Error('传真格式不正确'));
  }
};

/*
*  邮编校验
* */

export const zipValidator = (rule, value, callback) => {
  if (validZip(value)) {
    callback();
  } else {
    callback(new Error('邮编格式不正确'));
  }
};

/*
* 邮编非必填校验
* */

export const zipNrValidator = (rule, value, callback) => {
  if (!value || validZip(value)) {
    callback();
  } else {
    callback(new Error('邮编格式不正确'));
  }
};

export const mobileValidator = (rule, value, callback) => {
  if (validMobile(value)) {
    callback();
  } else {
    callback(new Error('手机号格式不正确'));
  }
};

/*
 *  非必填手机号校验
 * */

export const mobileNrValidator = (rule, value, callback) => {
  if (value && !validMobile(value)) {
    callback(new Error('手机号格式不正确'));
  } else {
    callback();
  }
};

/*
 * 非必填邮箱校验
 * */

export const emailNrValidator = (rule, value, callback) => {
  if (value && !validEmail(value)) {
    callback(new Error('邮箱格式不正确'));
  } else {
    callback();
  }
};

/**
 *  密码校验
 * **/

export const passwordValidator = (rule, value, callback) => {
  if (validPassword(value)) {
    callback();
  } else {
    callback(new Error('请输入8位以上字母和数字的密码组合'));
  }
};

/*
 * 校验身份证数据
 * */

export const validIdentifyNumber = val => {
  return /^[0-9A-Z]{18}$/g.test(val);
};

/*
* 校验大写字母和数字的组合
* */

export const validDocTypeNumber = val => {
  return /^[0-9A-Z]*[0-9]+$/g.test(val);
};

/*
 *  非必填身份证号
 * */

export const identifyNrValidator = (rule, value, callback) => {
  if (value && !validIdentifyNumber(value)) {
    callback(new Error('身份证格式不正确'));
  } else {
    callback();
  }
};

/*
 *  必填身份证号
 * */

export const identifyValidator = (rule, value, callback) => {
  if (!value) {
    callback('请输入证件号码');
  } else if (!validIdentifyNumber(value)) {
    callback(new Error('身份证格式不正确'));
  } else {
    callback();
  }
};

export const validCertNumber = val => {
  return /^([0-9A-Z]{18}|[0-9A-Z]{15})$/g.test(val);
};

export const validBankNumber = val => {
  return /^[0-9]{9,24}$/g.test(val);
};

/*
 *  bankAccountNrValidator  非必填银行账号
 * */

export const bankAccountNrValidator = (rule, value, callback) => {
  if (value && !validBankNumber(value)) {
    callback(new Error('银行账号格式不正确'));
  } else {
    callback();
  }
};

/*
 *  车辆校验那一挂的
 * */

export const carNumValidator = val => {
  return /^(([A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(
    val
  );
};

export const validateVinNumber = val => {
  return /^[0-9A-Z]{17}$/.test(val);
};

export const validateEngine = val => {
  return /^[0-9A-Z]+$/.test(val);
};

export const vinNumberValidator = (rules, value, callback) => {
  if (!value) {
    callback(new Error('请输入车架号'));
  } else if (validateVinNumber(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的车架号'));
  }
};

/*
* 车牌号校验
* */

export const carNumberValidator = (rules, value, callback) => {
  if (!value) {
    callback(new Error('请输入车牌号'));
  } else if (carNumValidator(value.substr(1))) {
    callback();
  } else {
    callback(new Error('请输入正确车牌号码格式'));
  }
};

/*
 * 发动机号校验
 * */

export const engineValidator = (rules, value, callback) => {
  if (!value) {
    callback(new Error('请输入发动机号'));
  } else if (validateEngine(value)) {
    callback();
  } else {
    callback(new Error('请输入正确发动机号'));
  }
};

/*
*  必填日期范围
* */

export const dateRangeValidator = (rules, value, callback) => {
  if (!value || (value && !value.length)) {
    callback(new Error('请选择有效日期'));
  } else {
    callback();
  }
};

/*
* 必填执业证号
* */

export const validClerkNumber = (rules, value, callback) => {
  if (!value) {
    callback(new Error('请填写执业证号'));
  } else if (/^[0-9A-Za-z]+$/.test(value)) {
    callback();
  } else {
    callback('输入正确的格式（数字、字母或字母数字组合）');
  }
};

/*
* 非必填营业执照号
* */

export const validNrCertNumber = (rules, value, callback) => {
  if (value && !validCertNumber(value)) {
    callback(new Error('营业执照格式错误'));
  } else {
    callback();
  }
};
