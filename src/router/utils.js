import { objectMerge } from '@/utils/index';

export const path2Name = path => {
  const name = path
    .split('/')
    .map(p => {
      if (!p) return '';
      return p[0].toUpperCase() + p.substring(1);
    })
    .join('');
  return name;
};

export const createNormalRoute = (path, title, meta = {}, opt = {}) => {
  const pathVariableIdex = path.indexOf('/:');
  const viewPath =
    pathVariableIdex > -1 ? path.substring(0, pathVariableIdex) : path;
  // remove icon
  meta.icon = 'example';
  return objectMerge(
    {
      path,
      component: resolve => require([`@/views${viewPath}`], resolve),
      // component: () => import(`@/views${viewPath}`),
      name: path2Name(viewPath),
      meta: objectMerge(
        {
          title,
          isMenu: !opt.hidden,
          activeMenu: !opt.hidden ? path : null,
          icon: 'example'
        },
        meta
      ),
      props: pathVariableIdex > -1
    },
    opt
  );
};

export const fillPath = (root, path) => `${root}/${path}`;
