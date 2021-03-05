import Layout from '@/layout';
import { createNormalRoute, fillPath, path2Name } from '@/router/utils';

const ROOT_PATH = '/room';

export const PATH_MAP = {
  MANAGEMENT: fillPath(ROOT_PATH, 'management/index'),
  MANAGEMENT_EDIT: fillPath(ROOT_PATH, 'management/edit'),
  PRICE: fillPath(ROOT_PATH, 'price/index'),
  PRICE_EDIT: fillPath(ROOT_PATH, 'price/edit')
};

export default {
  path: ROOT_PATH,
  component: Layout,
  meta: { title: '房间', icon: 'example' },
  redirect: PATH_MAP.MANAGEMENT,
  name: path2Name(ROOT_PATH),
  children: [
    createNormalRoute(PATH_MAP.MANAGEMENT, '房间管理', { icon: '' }, {}),
    createNormalRoute(
      PATH_MAP.MANAGEMENT_EDIT,
      '房间编辑',
      { activeMenu: PATH_MAP.MANAGEMENT },
      { hidden: true }
    ),
    createNormalRoute(PATH_MAP.PRICE, '房价管理', { icon: '' }, {}),
    createNormalRoute(
      PATH_MAP.PRICE_EDIT,
      '房价编辑',
      { activeMenu: PATH_MAP.PRICE },
      { hidden: true }
    )
  ]
};
