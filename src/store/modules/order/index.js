import { MODULE } from '@/store/constant';
import order from './order';
import orderItem from './order-item';
import orderProduct from './order-product';

export default {
  [MODULE.ORDER]: order,
  [MODULE.ORDER_ITEM]: orderItem,
  [MODULE.ORDER_PRODUCT]: orderProduct
};
