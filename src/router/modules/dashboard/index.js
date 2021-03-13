import Layout from '@/layout';
import {
  createNormalRoute,
  fillPath,
  path2Name,
  SEQUENCE
} from '@/router/utils';

const ROOT_PATH = '/dashboard';

export const PATH_MAP = {
  INDEX: fillPath(ROOT_PATH, 'index')
};

export default {
  path: ROOT_PATH,
  component: Layout,
  meta: { title: '首页', icon: 'home', sequence: SEQUENCE.DASHBOARD },
  redirect: PATH_MAP.INDEX,
  name: path2Name(ROOT_PATH),
  children: [
    createNormalRoute(PATH_MAP.INDEX, '首页', { icon: 'home', affix: true }, {})
  ]
};
