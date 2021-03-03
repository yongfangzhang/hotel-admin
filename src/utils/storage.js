import { str2Obj, obj2Str } from './index';

export const getLocal = key => {
  return str2Obj(localStorage.getItem(key));
};

export const setLocal = (key, value) => {
  if (value === null || typeof value === 'undefined') return clearLocal(key);
  return localStorage.setItem(key, obj2Str(value));
};

export const clearLocal = key => localStorage.removeItem(key);
