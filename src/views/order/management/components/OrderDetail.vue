<template>
  <div v-if="currentOrder" class="m-view-panel-sm">
    <div class="pb-3 border-bottom">
      <div class="pb-3 border-bottom font-weight-bold">订单: {{ currentOrder.number }}</div>
      <div class="m-view-item">
        <span class="label">渠道</span>
        <m-view class="order-detail-view"
                :value="currentOrder.channelName" />
      </div>
      <div class="m-view-item">
        <span class="label">房价</span>
        <m-view type="currency"
                class="order-detail-view"
                :value="currentOrder.paidPrice" />
      </div>
      <div class="m-view-item">
        <span class="label">商品</span>
        <m-view type="currency"
                class="order-detail-view"
                :value="currentOrder.productIncome" />
      </div>
      <div class="m-view-item">
        <span class="label">押金</span>
        <m-view type="currency"
                class="order-detail-view"
                :value="currentOrder.deposit" />
      </div>
      <div class="m-view-item">
        <span class="label">押金扣除</span>
        <m-view type="currency"
                class="order-detail-view"
                :value="currentOrder.depositDeduction" />
      </div>
      <div class="m-view-item">
        <span class="label">收益</span>
        <m-view type="currency"
                class="order-detail-view"
                :value="currentOrder.paidPrice + currentOrder.productIncome" />
      </div>
    </div>
    <div class="pt-3">
      <div v-for="item in currentOrder.items"
           :key="item.uuid">
        <div class="pb-3 border-bottom font-weight-bold">入住人: {{ item.name }} ({{ item.mobile }})</div>
        <div class="m-view-item">
          <span class="label">公寓</span>
          <m-view type="selector"
                  class="order-detail-view"
                  :map="apartmentMap"
                  :value="item.apartmentUuid" />
        </div>
        <div class="m-view-item">
          <span class="label">房间</span>
          <m-view class="order-detail-view"
                  :value="item.room.name" />
        </div>
        <div class="m-view-item">
          <span class="label">入住时间</span>
          <m-view class="order-detail-view"
                  :value="item.liveAt" />
        </div>
        <div class="m-view-item">
          <span class="label">退房时间</span>
          <m-view class="order-detail-view"
                  :value="item.leaveAt" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrderDetail',
  props: {
    currentOrder: {
      type: Object,
      default: null
    },
    apartmentMap: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>
