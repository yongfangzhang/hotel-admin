import Layout from '@/layout';
import {
  createNormalRoute,
  fillPath,
  path2Name,
  SEQUENCE
} from '@/router/utils';

const ROOT_PATH = '/statistics';

export const PATH_MAP = {
  INDEX: fillPath(ROOT_PATH, 'index')
};

export default {
  path: '',
  component: Layout,
  meta: { title: '统计分析', icon: 'home', sequence: SEQUENCE.STATISTICS },
  redirect: PATH_MAP.INDEX,
  name: path2Name(ROOT_PATH),
  children: [
    createNormalRoute(PATH_MAP.INDEX, '统计分析', { icon: 'home', affix: true }, {})
  ]
};
