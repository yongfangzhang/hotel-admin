import Layout from '@/layout';
import { createNormalRoute, fillPath, path2Name } from '@/router/utils';

const ROOT_PATH = '/system';

export const PATH_MAP = {
  SYSTEM_LOG: fillPath(ROOT_PATH, 'slog/index'),
  ACCOUNT: fillPath(ROOT_PATH, 'account/index'),
  ACCOUNT_EDIT: fillPath(ROOT_PATH, 'account/edit'),
  ROLE: fillPath(ROOT_PATH, 'role/index'),
  ROLE_EDIT: fillPath(ROOT_PATH, 'role/edit'),
  PERMISSION: fillPath(ROOT_PATH, 'permission/index')
};

export default {
  path: ROOT_PATH,
  component: Layout,
  meta: { title: '系统管理', icon: 'example' },
  redirect: PATH_MAP.SYSTEM_LOG,
  name: path2Name(ROOT_PATH),
  children: [
    createNormalRoute(PATH_MAP.ACCOUNT, '用户管理', { icon: '' }, {}),
    createNormalRoute(
      PATH_MAP.ACCOUNT_EDIT,
      '用户编辑',
      { activeMenu: PATH_MAP.ACCOUNT },
      { hidden: true }
    ),
    createNormalRoute(PATH_MAP.ROLE, '角色管理', { icon: '' }, {}),
    createNormalRoute(
      PATH_MAP.ROLE_EDIT,
      '角色编辑',
      { activeMenu: PATH_MAP.ROLE },
      { hidden: true }
    ),
    createNormalRoute(PATH_MAP.SYSTEM_LOG, '系统日志', { icon: '' }, {})
    // createNormalRoute(PATH_MAP.PERMISSION, '权限管理')
  ]
};
