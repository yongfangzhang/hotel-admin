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
          <el-dropdown-item command="changeRoomState"
                            divided>修改房态</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div :style="{backgroundColor: roomTheme, minHeight: '8.8rem'}"
         class="px-2 py-1">
      <div v-if="room.relatedOrderItem">
        <div class="py-3 d-flex justify-content-between">
          <div>入住人</div>
          <div>{{ room.relatedOrderItem.name }}</div>
        </div>
        <div class="pb-3 d-flex justify-content-between">
          <div>电话</div>
          <div>{{ room.relatedOrderItem.mobile }}</div>
        </div>
        <div class="pb-3 d-flex justify-content-between">
          <div>订单来源</div>
          <div>{{ room.relatedOrder.channelName }}</div>
        </div>
      </div>
      <div v-else
           class="py-5 text-center">
        <el-button v-if="room.state===ROOM_STATE.EMPTY_CLEAN"
                   type="text"
                   @click="createOrder">接单</el-button>
        <el-button v-else-if="room.state===ROOM_STATE.EMPTY_DARTY"
                   type="text"
                   class="text-muted"
                   @click="notifyClean">通知打扫</el-button>
      </div>
    </div>
  </el-card>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import { mapState } from 'vuex';
import { confirmMessage, toastWarning } from '@/utils/message';
export default {
  name: 'RoomItem',
  props: {
    room: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState(MODULE.ROOM, ['roomSetting']),
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
  methods: {
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
    createOrder() {
      this.$emit('create-order', this.room);
    },
    changeRoomState() {
      this.$emit('change-state', this.room);
    }
  }
};
</script>
