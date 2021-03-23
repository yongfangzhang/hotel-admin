<template>
  <el-card v-if="room"
           shadow="hover">
    <div slot="header"
         class="d-flex justify-content-between align-items-center px-2 py-1">
      <div class="flex-fill text-overflow-ellipsis"
           :title="cardTtitle">{{ cardTtitle }}</div>
      <el-dropdown class="card-header-button py-2"
                   size="mini"
                   type="primary"
                   @command="handleDropdownCommand">
        <span class="text-primary cursor-pointer">
          操作<i class="el-icon-arrow-down" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="room.state!==ROOM_STATE.EMPTY_CLEAN"
                            command="createOrder">接单</el-dropdown-item>
          <el-dropdown-item :disabled="room.state!==ROOM_STATE.EMPTY_DARTY && room.state!==ROOM_STATE.STAY_DARTY"
                            command="notifyClean">通知打扫</el-dropdown-item>
          <el-dropdown-item :disabled="room.state!==ROOM_STATE.STAY_CLEAN && room.state!==ROOM_STATE.STAY_DARTY"
                            command="roomCheckOut">退房</el-dropdown-item>
          <el-dropdown-item :disabled="room.state!==ROOM_STATE.STAY_CLEAN && room.state!==ROOM_STATE.STAY_DARTY"
                            command="renewOrder">续住</el-dropdown-item>
          <el-dropdown-item command="changeRoomState"
                            divided>修改房态</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div :style="{backgroundColor: roomTheme, height: roomSetting.rowHeight+'px'}"
         class="px-2 py-1 cursor-pointer"
         :class="{'remain-warning': remainTime.diff===0}">
      <!-- <el-popover v-if="room.relatedOrderItem"
                  placement="top-start"
                  title="详情"
                  width="260"
                  trigger="hover"
                  @show="calcRemainTime">
        <div class="font-12">
          <div class="my-2"><span class="room-item-tip-title">公寓:</span> {{ apartmentName }}</div>
          <div class="my-2"><span class="room-item-tip-title">订单号:</span> {{ room.relatedOrder.number }}</div>
          <div class="my-2"><span class="room-item-tip-title">订单渠道:</span> {{ room.relatedOrder.channelName }}</div>
          <div class="my-2"><span class="room-item-tip-title">渠道单号:</span> {{ room.relatedOrder.bizNumber || '-' }}</div>
          <div class="my-2"><span class="room-item-tip-title">入住人:</span> {{ room.relatedOrderItem.name }}</div>
          <div class="my-2"><span class="room-item-tip-title">电话:</span> {{ room.relatedOrderItem.mobile }}</div>
          <div class="my-2"><span class="room-item-tip-title">入住类型:</span> {{ room.relatedOrderItem.lodgingTypeName }}</div>
          <div class="my-2"><span class="room-item-tip-title">入住时间:</span> {{ room.relatedOrderItem.liveAt }}</div>
          <div class="my-2"><span class="room-item-tip-title">退房时间:</span> {{ room.relatedOrderItem.leaveAt }}</div>
          <div class="my-2"><span class="room-item-tip-title">剩余时间:</span> {{ remainTime.text }}</div>
        </div> -->
      <div v-if="room.relatedOrderItem"
           @click="updateOrder">
        <div class="py-3 d-flex justify-content-between">
          <div class="text-overflow-ellipsis">入住人</div>
          <div class="text-overflow-ellipsis">{{ room.relatedOrderItem.name }}</div>
        </div>
        <div class="pb-3 d-flex justify-content-between">
          <div class="text-overflow-ellipsis">电话</div>
          <div class="text-overflow-ellipsis">{{ room.relatedOrderItem.mobile }}</div>
        </div>
        <div class="pb-3 d-flex justify-content-between">
          <div class="text-overflow-ellipsis">订单渠道</div>
          <div class="text-overflow-ellipsis">{{ room.relatedOrder.channelName }}</div>
        </div>
      </div>
      <!-- </el-popover> -->
      <div v-else-if="room.state===ROOM_STATE.EMPTY_CLEAN"
           class="text-center h-100 d-flex align-items-center justify-content-center"
           @click="createOrder">
        <el-button type="text"
                   @click="createOrder">接单</el-button>
      </div>
      <div v-else-if="room.state===ROOM_STATE.EMPTY_DARTY"
           class="text-center h-100 d-flex align-items-center justify-content-center"
           @click="notifyClean">
        <el-button type="text"
                   class="text-muted">通知打扫</el-button>
      </div>
    </div>
  </el-card>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import { mapState } from 'vuex';
import { confirmMessage, toastWarning } from '@/utils/message';
import { EMPTY_TEXT } from '@/utils/constant';
import { formatDuration, str2DateTimestamp } from '@/utils/index';
export default {
  name: 'RoomItem',
  props: {
    apartmentMap: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      remainTime: { diff: -1, text: EMPTY_TEXT }
    };
  },
  computed: {
    ...mapState(MODULE.ROOM, ['roomSetting']),
    apartmentName() {
      if (!this.apartmentMap || !this.room) {
        return EMPTY_TEXT;
      }
      const apartment = this.apartmentMap[this.room.apartmentUuid];
      if (!apartment) return EMPTY_TEXT;
      return apartment.shortName;
    },
    cardTtitle() {
      if (!this.room) return '';
      let title = '';
      if (this.roomSetting.showFloorNumber) {
        title += `${this.room.floorNumber}-`;
      }
      if (this.roomSetting.showUnitNumber) {
        title += `${this.room.unitNumber}-`;
      }
      title += this.room.number;
      return title;
    },
    roomTheme() {
      if (!this.room) return;
      return this.ROOM_STATE_THEME_MAP[this.room.state];
    }
  },
  watch: {
    room() {
      this.calcRemainTime();
    }
  },
  mounted() {
    this.calcRemainTime();
  },
  methods: {
    calcRemainTime() {
      if (!this.room || !this.room.relatedOrderItem) {
        this.remainTime = { diff: -1, text: EMPTY_TEXT };
      } else {
        this.remainTime = formatDuration(
          Date.now(),
          str2DateTimestamp(this.room.relatedOrderItem.leaveAt),
          0
        );
      }
    },
    handleDropdownCommand(command) {
      this[command] && this[command]();
    },
    notifyClean() {
      toastWarning('通知保洁打扫房间的功能待实现');
    },
    roomCheckOut() {
      confirmMessage(
        `退房后房间状态自动切换为【${
          this.ROOM_STATE_MAP[this.ROOM_STATE.EMPTY_DARTY]
        }】, 是否继续?`
      )
        .then((_) => {
          return this.doAction(MODULE.ROOM, ACTIONS.UPDATE_ITEM, {
            uuid: this.room.uuid,
            state: this.ROOM_STATE.EMPTY_DARTY
          });
        })
        .then(() => {
          this.$emit('filter');
        })
        .catch(() => {
          // ignore
        });
    },
    updateOrder() {
      this.$emit('update-order', this.room);
    },
    renewOrder() {
      this.$emit('renew-order', this.room);
    },
    createOrder() {
      this.$emit('create-order', this.room);
    },
    changeRoomState() {
      this.$emit('change-state', this.room);
    }
  }
};
</script>
