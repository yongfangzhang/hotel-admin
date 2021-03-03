import Cookies from 'js-cookie';
import { EMPTY_TEXT } from './constant';

export const TokenKey = 'Access-Token';
export const TenantKey = 'Tenant';
export const DeviceKey = 'User-Device';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getTenant() {
  if (process.env.NODE_ENV === 'development') {
    return process.env.VUE_APP_DEBUG_TENANT;
  }
  return Cookies.get(TenantKey, { path: '/' });
}

export function setTenant(tenant) {
  return Cookies.set(TenantKey, tenant);
}

export function getUserDevice() {
  const nav = window.navigator || {
    platform: EMPTY_TEXT,
    appName: EMPTY_TEXT,
    appCodeName: EMPTY_TEXT
  };
  return `${nav.platform} ${nav.appName} ${nav.appCodeName}`;
}
