<template>
  <div>
    <el-form ref="form"
             :model="order"
             :label-width="formLabelWidth.w6"
             label-position="left"
             class="p-3">
      <el-row :gutter="6">
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in baseFormItems.left"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="order"
                       :allow-create="item.allowCreate"
                       :disabled="item.disabled" />
        </el-col>
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in baseFormItems.right"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="order"
                       :allow-create="item.allowCreate"
                       :disabled="item.disabled" />
        </el-col>
      </el-row>
    </el-form>
    <el-form ref="userForm"
             :model="orderItem"
             :label-width="formLabelWidth.w6"
             label-position="left"
             class="p-3">
      <el-row :gutter="6">
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in userFormItems.left"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="orderItem"
                       :allow-create="item.allowCreate"
                       :disabled="item.disabled"
                       @change="()=>item.change&&item.change(orderItem)" />
        </el-col>
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in userFormItems.right"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="orderItem"
                       :allow-create="item.allowCreate"
                       :disabled="item.disabled"
                       @change="()=>item.change&&item.change(orderItem)" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import { list2Map, parseTime } from '@/utils/index';
export default {
  name: 'OrderEdit',
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      roomMap: null,
      roomFullMap: null,
      apartmentMap: null,
      userMap: null,
      userFullMap: null
    };
  },
  computed: {
    orderLocked() {
      return false;
    },
    baseFormItems() {
      return {
        left: [
          {
            key: 'apartmentUuid',
            label: '公寓',
            type: 'selector',
            map: this.apartmentMap,
            disabled: true,
            isView: true
          },
          {
            key: 'userType',
            label: '客户渠道',
            type: 'selector',
            map: this.ORDER_USER_TYPE_MAP,
            disabled: true,
            isView: true
          },
          {
            key: 'state',
            label: '状态',
            type: 'selector',
            map: this.ORDER_STATE_MAP
          },
          // {
          //   key: 'userUuid',
          //   label: '客户',
          //   type: 'selector',
          //   map: this.userMap,
          //   disabled:
          //     !this.newAdded ||
          //     !this.order ||
          //     !this.order.userType ||
          //     this.order.userType === this.ORDER_USER_TYPE.SOCIAL
          // },
          {
            key: 'paidAt',
            label: '支付时间',
            type: 'datetime',
            placeholder: '请选择',
            disabled: true,
            isView: true
          }
        ],
        right: [
          {
            key: 'channel',
            label: '渠道',
            type: 'selector',
            map: this.ORDER_CHANNEL_MAP,
            disabled: true,
            isView: true
          },
          {
            key: 'bizNumber',
            label: '渠道订单号',
            disabled: true,
            isView: true
          },
          { key: 'number', label: '订单号', isView: true },
          // { key: 'canceledAt', label: '取消时间', isView: true },
          // { key: 'finishedAt', label: '完成时间', isView: true },
          {
            key: 'remarkContent',
            label: '备注',
            type: 'remark',
            alwaysEnable: true
          }
          // { key: 'commentedAt', label: '评价时间', isView: true }
        ]
      };
    },
    userFormItems() {
      return {
        left: [
          {
            key: 'roomUuid',
            label: '房间',
            type: 'selector',
            map: this.roomMap,
            change: this.onRoomChange,
            disabled: this.orderLocked,
            extral: {
              disabledFunction: this.roomDisabledFunc
            }
          },
          {
            key: 'mobile',
            label: '手机号',
            disabled: true,
            isView: true
          },
          { key: 'name', label: '客户姓名', disabled: true, isView: true },
          {
            key: 'lodgingType',
            label: '入住类型',
            type: 'selector',
            map: this.LODGING_TYPE_MAP,
            disabled: this.orderLocked
          },
          {
            key: 'liveAt',
            label: '入住时间',
            type: 'datetime',
            disabled: !this.renew || this.orderLocked
          },
          {
            key: 'leaveAt',
            label: '退房时间',
            type: 'datetime',
            disabled: !this.renew || this.orderLocked
          }
        ],
        right: [
          {
            key: 'priceType',
            label: '价格类型',
            type: 'selector',
            map: this.ROOM_PRICE_TYPE_MAP,
            change: this.onPriceTypeChange,
            disabled: this.orderLocked
          },
          { key: 'originalPrice', label: '原始价格', isView: true },
          {
            key: 'paidPrice',
            label: '实付价格',
            type: 'number',
            disabled: this.orderLocked
          }
        ]
      };
    },
    order() {
      return this.room ? this.room.relatedOrder : null;
    },
    orderItem() {
      return this.room ? this.room.relatedOrderItem : null;
    },
    renew() {
      return this.room && this.room.renew;
    }
  },
  watch: {
    room() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      if (!this.room) return;
      this.fetchRoomMap(this.room.apartmentUuid);
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST, {
        state: this.APARTMENT_STATE.NORMAL
      }).then((list) => {
        this.apartmentMap = list2Map(list, 'uuid', 'shortName');
      });
      this.doAction(MODULE.USER, ACTIONS.FETCH_LIST).then((list) => {
        this.userMap = list2Map(list, 'uuid', 'name');
        this.mobileMap = list2Map(list, 'mobile', 'mobile');
        this.userFullMap = list2Map(list, 'uuid');
        this.mobileFullMap = list2Map(list, 'mobile');
      });
    },
    presetLiveAndLeave() {
      const today = new Date();
      today.setHours(today.getHours() + 1);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      const liveAt = parseTime(today);
      today.setDate(today.getDate() + 1);
      today.setHours(12);
      const leaveAt = parseTime(today);
      return {
        liveAt,
        leaveAt
      };
    },
    onRoomChange(item) {
      this.$set(item, 'room', this.roomFullMap[item.roomUuid]);
      this.onPriceTypeChange(item);
    },
    onPriceTypeChange(item) {
      if (!item.room) return;
      item.originalPrice = item.room.priceTypeMap[item.priceType];
      item.paidPrice = item.originalPrice;
    },
    onMobileChange(item) {
      const user = this.mobileFullMap[item.mobile];
      if (!user) return;
      this.$set(item, 'name', user.name);
    },
    fetchRoomMap(apartmentUuid) {
      if (!apartmentUuid && (!this.room || !this.room.apartmentUuid)) {
        return Promise.resolve();
      }
      return this.doAction(MODULE.ROOM, ACTIONS.FETCH_LIST, {
        apartmentUuid: this.room.apartmentUuid,
        state: this.ROOM_STATE.NORMAL
      }).then((list) => {
        this.roomMap = list2Map(list, 'uuid', 'name');
        this.roomFullMap = list2Map(list, 'uuid');
        return Promise.resolve(this.roomFullMap);
      });
    },
    roomDisabledFunc(uuid) {
      if (!this.roomFullMap || !this.roomFullMap[uuid]) return true;
      return this.roomFullMap[uuid].state !== this.ROOM_STATE.EMPTY_CLEAN;
    }
  }
};
</script>
