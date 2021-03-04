import { MODULE } from '@/store/constant';
import systemAccount from './systemAccount';
import systemAccountRole from './systemAccountRole';
import systemPermission from './systemPermission';
import systemRole from './systemRole';
import systemRoleRoute from './systemRoleRoute';
import systemLog from './systemLog';

export default {
  [MODULE.SYSTEM_ACCOUNT]: systemAccount,
  [MODULE.SYSTEM_ACCOUNT_ROLE]: systemAccountRole,
  [MODULE.SYSTEM_PERMISSION]: systemPermission,
  [MODULE.SYSTEM_ROLE]: systemRole,
  [MODULE.SYSTEM_ROLE_ROUTE]: systemRoleRoute,
  [MODULE.SYSTEM_LOG]: systemLog
};
