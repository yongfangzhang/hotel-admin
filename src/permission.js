import router from './router';
import store from './store';
import { Message } from 'element-ui';
import { startProgress, stopProgress } from '@/utils/progress';
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';
import { MODULE, ACTIONS } from './store/constant';

const whiteList = ['/login', '/auth-redirect']; // no redirect whitelist

router.beforeEach((to, from, next) => {
  // start progress bar
  startProgress();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      stopProgress();
      next({ path: '/' });
    } else {
      // determine whether the user has obtained his permission routes through getInfo
      const hasRoutes = store.getters.routes && store.getters.routes.length > 0;
      if (hasRoutes) {
        stopProgress();
        next();
      } else {
        try {
          // get user info
          // note: routes must be a object array!
          store
            .dispatch('user/getInfo')
            .then(d => {
              store
                .dispatch('permission/generateRoutes', d.routes)
                .then(accessRoutes => {
                  router.addRoutes(accessRoutes);
                  // hack method to ensure that addRoutes is complete
                  // set the replace: true, so the navigation will not leave a history record
                  stopProgress();
                  next({ ...to, replace: true });
                });
            })
            .catch(error => {
              Message.error(error || 'Has Error');
              stopProgress();
            });
          // 初始化各种带权限的常驻kv
          store.dispatch(`${MODULE.MY}/${ACTIONS.MY_INFO}`);
          store.dispatch(`${MODULE.ENUMS}/${ACTIONS.FETCH_ENUM}`);
        } catch (error) {
          // remove token and go to login page to re-login
          store.dispatch('user/resetToken').then(d => {
            Message.error(error || 'Has Error');
            stopProgress();
            next(`/login?redirect=${to.path}`);
          });
        }
      }
    }
  } else {
    /* has no token*/
    store.commit('permission/clearRoutes'); // clear routes
    store.dispatch('tagsView/delAllViews'); // clear tags

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      stopProgress();
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      stopProgress();
      next(`/login?redirect=${to.path}`);
    }
  }
});

// router.afterEach(() => {
//   // finish progress bar
//   stopProgress();
// });
