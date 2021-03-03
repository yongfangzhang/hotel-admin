import { MODULE } from '@/store/constant';
import systemAccount from './systemAccount';
import systemPermission from './systemPermission';
import systemRole from './systemRole';
import systemLog from './systemLog';

export default {
  [MODULE.SYSTEM_ACCOUNT]: systemAccount,
  [MODULE.SYSTEM_PERMISSION]: systemPermission,
  [MODULE.SYSTEM_ROLE]: systemRole,
  [MODULE.SYSTEM_LOG]: systemLog
};
