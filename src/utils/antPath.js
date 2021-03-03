import logger from './logger';

export const antPathMatcher = (targetPath, path) => {
  logger.info(targetPath, path);
  if (!path) return false;
  if (targetPath === path) return true;
  if (targetPath.indexOf('**') === -1) {
    // 不存在**
    targetPath += '**';
  }
  targetPath = targetPath.replace('*', '.');
  const reg = new RegExp(targetPath, 'g');
  return path.match(reg) !== null;
};
