<template>
  <div>
    <el-form v-if="!renew"
             ref="form"
             :model="order"
             :label-width="formLabelWidth.w6"
             label-position="left"
             class="p-3"
             :class="'font-size-'+roomSetting.fontSize">
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

          <el-form-item v-if="order"
                        label="押金状态"
                        prop="depositState"
                        class="m-form-item">
            <div class="d-flex">
              <m-selector v-model="order.depositState"
                          :map="DEPOSIT_STATE_MAP"
                          placeholder="请选择"
                          filterable />
              <el-input v-if="order.depositState===DEPOSIT_STATE.PAID||order.depositState===DEPOSIT_STATE.UNPAID"
                        v-model="order.deposit"
                        class="ml-2"
                        type="number"
                        placeholder="收押金额" />
              <el-input v-else-if="order.depositState===DEPOSIT_STATE.REFUNDED"
                        v-model="order.depositRefunded"
                        class="ml-2"
                        type="number"
                        placeholder="退押金额" />
              <el-input v-else
                        class="ml-2"
                        disabled
                        placeholder="无押金" />
            </div>
          </el-form-item>
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
             class="p-3"
             :class="'font-size-'+roomSetting.fontSize">
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
    <el-table v-if="order"
              :data="order.products"
              border
              stripe
              show-summary
              :class="'font-size-'+roomSetting.fontSize">
      <el-table-column label="序号"
                       :resizable="false"
                       align="center"
                       :width="colWidth.xxs">
        <template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称"
                       align="center"
                       prop="productName"
                       :min-width="colWidth.xs" />
      <el-table-column label="单价"
                       align="center"
                       prop="productPrice"
                       :min-width="colWidth.xs">
        <template slot-scope="{ row }">
          <m-view :value="row.productPrice"
                  type="currency" />
        </template>
      </el-table-column>
      <el-table-column label="商品数量"
                       align="center"
                       prop="productCount"
                       :min-width="colWidth.xs" />
      <el-table-column label="总价"
                       align="center"
                       prop="totalPrice"
                       :min-width="colWidth.xs">
        <template slot-scope="{ row }">
          <m-view :value="row.totalPrice"
                  type="currency" />
        </template>
      </el-table-column>
      <el-table-column label="押金支付"
                       align="center"
                       prop="paidByDeposit"
                       :min-width="colWidth.xs">
        <template slot-scope="{ row }">
          <m-view :value="row.paidByDeposit"
                  type="boolean" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import { deepClone, list2Map, parseTime } from '@/utils/index';
import { mapState } from 'vuex';
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
    ...mapState(MODULE.ROOM, ['roomSetting']),
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
          },
          {
            key: 'deposit',
            label: '押金',
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
    },
    'order.depositRefunded'() {
      this.updateDepositDeduction();
    },
    'order.deposit'() {
      this.updateDepositDeduction();
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    updateDepositDeduction() {
      const order = this.order;
      if (!order) return;

      order.depositDeduction =
        Number(order.deposit) - Number(order.depositRefunded);
    },
    init() {
      if (!this.room) return;
      this.fetchRoomMap(this.room.apartmentUuid);
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST, {
        state: this.APARTMENT_STATE.NORMAL
      }).then((d) => {
        const list = deepClone(d);
        this.apartmentMap = list2Map(list, 'uuid', 'shortName');
      });
      this.doAction(MODULE.USER, ACTIONS.FETCH_LIST).then((d) => {
        const list = deepClone(d);
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
      }).then((d) => {
        const list = deepClone(d);
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
