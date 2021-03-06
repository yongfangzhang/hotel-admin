import Layout from '@/layout';
import {
  createNormalRoute,
  fillPath,
  path2Name,
  SEQUENCE
} from '@/router/utils';

const ROOT_PATH = '/order';

export const PATH_MAP = {
  MANAGEMENT: fillPath(ROOT_PATH, 'management/index'),
  MANAGEMENT_EDIT: fillPath(ROOT_PATH, 'management/edit')
};

export default {
  path: ROOT_PATH,
  component: Layout,
  meta: { title: '订单', icon: 'example', sequence: SEQUENCE.ORDER },
  redirect: PATH_MAP.MANAGEMENT,
  name: path2Name(ROOT_PATH),
  children: [
    createNormalRoute(PATH_MAP.MANAGEMENT, '订单管理', { icon: '' }, {}),
    createNormalRoute(
      PATH_MAP.MANAGEMENT_EDIT,
      '订单编辑',
      { activeMenu: PATH_MAP.MANAGEMENT },
      { hidden: true }
    )
  ]
};
