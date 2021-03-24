import Layout from '@/layout';
import {
  createNormalRoute,
  fillPath,
  path2Name,
  SEQUENCE
} from '@/router/utils';

const ROOT_PATH = '/statistics';

export const PATH_MAP = {
  INDEX: fillPath(ROOT_PATH, 'index'),
  REPORT: fillPath(ROOT_PATH, 'report')
};

export default {
  path: ROOT_PATH,
  component: Layout,
  meta: { title: '统计分析', icon: 'example', sequence: SEQUENCE.STATISTICS },
  redirect: PATH_MAP.INDEX,
  name: path2Name(ROOT_PATH),
  children: [
    createNormalRoute(PATH_MAP.INDEX, '最近收益', { icon: 'example', affix: true }, {}),
    createNormalRoute(PATH_MAP.REPORT, '报表', { icon: 'example', affix: true }, {})
  ]
};
