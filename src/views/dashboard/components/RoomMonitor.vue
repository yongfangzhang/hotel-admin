<template>
  <div class="h-100">
    <div class="h-100 py-3 d-flex flex-column">
      <room-filter ref="filter"
                   class="px-3"
                   @show-setting="showSetting=true"
                   @room-list="roomList=$event"
                   @apartment-list="apartmentList=$event" />
      <div class="flex-fill scrollable-y room-item-panel"
           :style="{fontSize: roomSetting.fontSize }">
        <div v-for="(rooms,apartment) in roomGroupList"
             :key="apartment">
          <div class="font-18 p-3 border-bottom border-top d-flex align-items-center">
            <div class="font-weight-bold">{{ apartmentMap[apartment].shortName }}</div>
            <div class="font-weight-bold">【{{ apartmentMap[apartment].address }}】</div>
            <!-- <div>【联系人】{{ apartmentMap[apartment].contactor }}</div>
            <div> (</div>
            <m-view type="tel"
                    :value="apartmentMap[apartment].contactorMobile" />
            <div> )</div> -->
          </div>
          <el-row class="px-3 pb-3">
            <el-col v-for="room in rooms"
                    :key="room.uuid"
                    :span="24 / roomSetting.colSpan"
                    class="pt-3">
              <room-item :room="room"
                         :apartment-map="apartmentMap"
                         @filter="doFilter"
                         @create-order="createOrder"
                         @change-state="changeRoomState"
                         @update-order="updateOrder"
                         @renew-order="renewOrder"
                         @check-out="roomCheckOut" />
            </el-col>
          </el-row>
        </div>
        <div v-if="!roomList || roomList.length===0"
             class="text-center mt-5 text-muted">暂未查询到房间</div>
      </div>
      <!-- <div class="text-right pt-3 px-3 border-top">
        <el-button type="primary"
                   @click="createRoom">
          新建房间
        </el-button>
      </div> -->
    </div>
    <room-panel-setting v-model="showSetting" />
    <m-dialog v-model="showStateDialog"
              title="修改房间状态"
              :close-on-confirm="true"
              :has-close="true"
              :has-confirm="true"
              :append-to-body="true"
              width="xs"
              @confirm="confirmChangeState">
      <el-form v-if="currentRoom"
               label-position="left"
               inline
               @submit.native.prevent>
        <el-form-item label="房间状态">
          <m-selector v-model="currentRoom.state"
                      :clearable="false"
                      :map="availableRoomStateMap" />
        </el-form-item>
      </el-form>
    </m-dialog>
    <m-dialog v-model="showOrderDialog"
              :title="currentRoom && currentRoom.renew ? '续住' : '修改订单'"
              :close-on-confirm="true"
              :has-close="true"
              :has-confirm="true"
              :append-to-body="true"
              @confirm="confirmUpdateOrder">
      <order-edit v-if="showOrderDialog"
                  :room="currentRoom" />
    </m-dialog>
    <m-dialog v-model="showCheckOutDialog"
              title="退房"
              :close-on-confirm="true"
              :has-close="true"
              :has-confirm="true"
              :append-to-body="true"
              width="md"
              @confirm="confirmCheckOut"
              @on-close="doFilter">
      <div :class="'font-size-'+roomSetting.fontSize">
        <div>退房后房间状态自动切换为【{{ ROOM_STATE_MAP[ROOM_STATE.EMPTY_DARTY] }}】</div>
        <product-info v-if="currentRoom && currentRoom.relatedOrder "
                      :order="currentRoom.relatedOrder" />
        <div v-if="currentRoom && currentRoom.relatedOrder"
             class="m-view-item">
          <span class="label">应退押金</span>
          <m-view class="order-detail-view"
                  type="currency"
                  :value="+currentRoom.relatedOrder.deposit || 0" />
        </div>
        <div v-if="currentRoom && currentRoom.relatedOrder"
             class="m-view-item">
          <span class="label">实退押金</span>
          <el-input v-model="refundDeposit"
                    class="order-detail-view w-auto"
                    type="number"
                    placeholder="请输入实退押金" />
        </div>
      </div>
    </m-dialog>
  </div>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import RoomFilter from './RoomFilter.vue';
import RoomItem from './RoomItem.vue';
import RoomPanelSetting from './RoomPanelSetting.vue';
import OrderEdit from './OrderEdit.vue';
import { mapState } from 'vuex';
import { deepClone, list2Map } from '@/utils/index';
import { confirmMessage } from '@/utils/message';
import { PATH_MAP } from '@/router/modules/order/index';
import ProductInfo from './ProductInfo.vue';

export default {
  name: 'RoomMonitor',
  components: {
    RoomFilter,
    RoomItem,
    RoomPanelSetting,
    OrderEdit,
    ProductInfo
  },
  data() {
    return {
      currentRoom: null,
      apartmentList: [],
      roomList: [],
      showOrderDialog: false,
      showStateDialog: false,
      showSetting: false,
      showCheckOutDialog: false,
      refundDeposit: 0
    };
  },
  computed: {
    ...mapState(MODULE.ROOM, ['roomSetting']),
    apartmentMap() {
      return list2Map(this.apartmentList, 'uuid');
    },
    availableRoomStateMap() {
      const ROOM_STATE = this.ROOM_STATE;
      const ROOM_STATE_MAP = this.ROOM_STATE_MAP;
      return {
        [ROOM_STATE.EMPTY_CLEAN]: ROOM_STATE_MAP[ROOM_STATE.EMPTY_CLEAN],
        [ROOM_STATE.EMPTY_DARTY]: ROOM_STATE_MAP[ROOM_STATE.EMPTY_DARTY],
        [ROOM_STATE.STAY_CLEAN]: ROOM_STATE_MAP[ROOM_STATE.STAY_CLEAN],
        [ROOM_STATE.STAY_DARTY]: ROOM_STATE_MAP[ROOM_STATE.STAY_DARTY]
      };
    },
    roomGroupList() {
      const group = {};
      this.roomList.forEach((room) => {
        if (!group[room.apartmentUuid]) {
          group[room.apartmentUuid] = [];
        }
        group[room.apartmentUuid].push(room);
      });
      return group;
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
      this.$refs.filter.init();
    },
    doFilter() {
      this.currentRoom = null;
      this.$refs.filter.doFilter();
    },
    // createRoom() {},
    createOrder(room) {
      this.$router.push({
        path: PATH_MAP.MANAGEMENT_EDIT,
        query: {
          uuid: '',
          apartmentUuid: room.apartmentUuid,
          roomUuid: room.uuid
        }
      });
    },
    updateOrder(room) {
      this.currentRoom = { renew: false, ...deepClone(room) };
      this.showOrderDialog = true;
    },
    renewOrder(room) {
      this.currentRoom = { renew: true, ...deepClone(room) };
      this.showOrderDialog = true;
    },
    roomCheckOut(room) {
      this.currentRoom = deepClone(room);
      const order = this.currentRoom.relatedOrder;
      if (order) {
        this.refundDeposit = Number(order.deposit) || 0;
      } else {
        this.refundDeposit = 0;
      }
      this.showCheckOutDialog = true;
    },
    confirmCheckOut() {
      this.showCheckOutDialog = false;
      if (!this.currentRoom) {
        return;
      }
      const order = this.currentRoom.relatedOrder;
      const originDeposit = Number(order.deposit) || 0;
      let refundDeposit = Number(this.refundDeposit) || 0;
      if (order) {
        refundDeposit = Math.min(originDeposit, refundDeposit);
        refundDeposit = Math.max(0, refundDeposit);
      }
      this.doAction(MODULE.ROOM, ACTIONS.UPDATE_ITEM, {
        uuid: this.currentRoom.uuid,
        state: this.ROOM_STATE.EMPTY_DARTY,
        depositDeduction: originDeposit - refundDeposit
      })
        .then(() => {
          this.doFilter();
        })
        .catch(() => {
          // ignore
        });
    },
    changeRoomState(room) {
      this.currentRoom = deepClone(room);
      this.showStateDialog = true;
    },
    confirmUpdateOrder() {
      this.showOrderDialog = false;
      if (!this.currentRoom) {
        return;
      }
      const { renew, relatedOrder, relatedOrderItem } = this.currentRoom;
      relatedOrder.renew = renew;
      relatedOrder.items = [relatedOrderItem];

      this.doAction(MODULE.ORDER, ACTIONS.UPDATE_ITEM, relatedOrder)
        .then(() => {
          this.doFilter();
        })
        .catch(() => {
          // ignore
        });
    },
    confirmChangeState() {
      this.showStateDialog = false;
      if (!this.currentRoom) {
        return;
      }
      const state = +this.currentRoom.state;
      let msg = `修改状态为【${this.availableRoomStateMap[state]}】`;
      switch (state) {
        case this.ROOM_STATE.EMPTY_CLEAN:
          msg += '将清空房间并可以继续接单';
          break;
        case this.ROOM_STATE.EMPTY_DARTY:
          msg += '将清空房间并等待打扫';
          break;
        case this.ROOM_STATE.STAY_CLEAN:
          msg += '该房间将不能继续接单';
          break;
        case this.ROOM_STATE.STAY_DARTY:
          msg += '将通知保洁打扫房间(功能暂未实现)';
          break;
        default:
          break;
      }
      msg += ', 是否继续?';
      confirmMessage(msg)
        .then((_) => {
          return this.doAction(MODULE.ROOM, ACTIONS.UPDATE_ITEM, {
            uuid: this.currentRoom.uuid,
            state
          });
        })
        .then(() => {
          this.doFilter();
        })
        .catch(() => {
          // ignore
        });
    }
    // refreshRelatedOrder() {
    //   if (!this.currentRoom || !this.currentRoom.relatedOrder) return;
    //   this.doAction(
    //     MODULE.ORDER,
    //     ACTIONS.FETCH_VIEW_INFO,
    //     this.currentRoom.relatedOrder.uuid
    //   ).then((d) => {
    //     this.currentRoom.relatedOrder = d;
    //   });
    // }
  }
};
</script>
