import { Message, MessageBox } from 'element-ui';

const checkCondition = condition => {
  return typeof condition === 'undefined' || condition;
};

export const toastSuccess = (msg, condition) => {
  if (!checkCondition(condition)) return;
  Message.success(msg || '操作成功');
};

export const toastWarning = (msg, condition) => {
  if (!checkCondition(condition)) return;
  Message.warning(msg || '操作警告');
};

export const toastError = (msg, condition) => {
  if (!checkCondition(condition)) return;
  Message.error(msg || '操作失败');
};

export const assertWarning = (msg, condition) => {
  if (!checkCondition(condition)) return;
  toastWarning(msg, condition);
  throw new Error(msg);
};

export const confirmMessage = msg => {
  return MessageBox.confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });
};

export const alertMessage = msg => {
  return MessageBox.alert(msg, '提示', {
    cancelButtonText: '关闭',
    type: 'warning'
  });
};
