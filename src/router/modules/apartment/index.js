import Layout from '@/layout';
import { createNormalRoute, fillPath, path2Name } from '@/router/utils';

const ROOT_PATH = '/apartment';

export const PATH_MAP = {
  MANAGEMENT: fillPath(ROOT_PATH, 'management/index'),
  MANAGEMENT_EDIT: fillPath(ROOT_PATH, 'management/edit')
};

export default {
  path: ROOT_PATH,
  component: Layout,
  meta: { title: '公寓', icon: 'example' },
  redirect: PATH_MAP.MANAGEMENT,
  name: path2Name(ROOT_PATH),
  children: [
    createNormalRoute(PATH_MAP.MANAGEMENT, '公寓管理', { icon: '' }, {}),
    createNormalRoute(
      PATH_MAP.MANAGEMENT_EDIT,
      '公寓编辑',
      { activeMenu: PATH_MAP.MANAGEMENT },
      { hidden: true }
    )
  ]
};
