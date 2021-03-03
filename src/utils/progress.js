import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import logger from './logger';
import { Loading } from 'element-ui';

let loadingInstance = null;
let progressTimes = 0;
let loadingDisabled = false;

NProgress.configure({
  showSpinner: true
});

function disableClickEvent(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  return false;
}

export const startProgress = () => {
  progressTimes++;
  logger.info('start', progressTimes);
  NProgress.start();
  if (loadingDisabled) return;
  document.addEventListener('mousedown', disableClickEvent, true);
  loadingInstance = Loading.service({
    fullscreen: true,
    lock: true,
    background: 'transparent',
    text: '加载中'
  });
};

export const stopProgress = () => {
  progressTimes--;
  logger.info('stop', progressTimes);
  if (progressTimes > 0) return;
  progressTimes = 0;
  NProgress.done();
  document.removeEventListener('mousedown', disableClickEvent, true);
  if (loadingInstance) loadingInstance.close();
};

export const disableLoading = () => {
  loadingDisabled = true;
};

export const enableLoading = () => {
  loadingDisabled = false;
};
