<template>
  <div>
    <!-- <div class="d-flex justify-content-between text-primary"><span>销量:</span> <span>{{ items.length }}</span></div> -->
    <div class="d-flex justify-content-between text-primary"><span>房间收益:</span> <span>{{ roomIncome }}</span></div>
    <!-- <div class="d-flex justify-content-between text-primary"><span>押金收益:</span> <span>{{ depositIncome }}</span></div> -->
    <div class="d-flex justify-content-between text-primary"><span>商品收益:</span> <span>{{ productIncome }}</span></div>
    <div class="d-flex justify-content-between text-primary"><span>合计:</span> <span>{{ totalIncome }}</span></div>
  </div>
</template>
<script>
import { EMPTY_TEXT } from '@/utils/constant';
export default {
  name: 'DailyItem',
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    roomIncome() {
      return this.sumValue(this.items, 'paidPrice');
    },
    depositIncome() {
      return this.sumValue(this.items, 'depositDeduction');
    },
    productIncome() {
      return this.sumValue(this.items, 'productIncome');
    },
    totalIncome() {
      return this.roomIncome + this.depositIncome + this.productIncome;
    }
  },
  methods: {
    sumValue(items, fields) {
      if (!items || !items.length) return EMPTY_TEXT;
      let v = 0;
      if (!Array.isArray(fields)) fields = [fields];
      items.forEach((item) => {
        fields.forEach((field) => {
          v += Number(item[field]) || 0;
        });
      });
      return v;
    }
  }
};
</script>
