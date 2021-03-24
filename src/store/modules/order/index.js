import { MODULE } from '@/store/constant';
import order from './order';
import orderItem from './order-item';

export default {
  [MODULE.ORDER]: order,
  [MODULE.ORDER_ITEM]: orderItem
};
