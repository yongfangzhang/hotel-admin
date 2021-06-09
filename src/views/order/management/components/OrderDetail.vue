<template>
  <div v-if="currentOrder">
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
