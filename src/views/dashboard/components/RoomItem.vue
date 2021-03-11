<template>
  <el-card v-if="room"
           shadow="hover">
    <div slot="header"
         class="d-flex justify-content-between align-items-center px-2 py-1">
      <div class="flex-fill text-overflow-ellipsis"
           :title="cardTtitle">{{ cardTtitle }}</div>
      <el-button v-if="room.state===ROOM_STATE.EMPTY_CLEAN"
                 class="text-primary card-header-button"
                 type="text"
                 @click="createOrder">下单</el-button>
      <el-button v-else-if="room.state===ROOM_STATE.EMPTY_DARTY"
                 class="text-warning card-header-button"
                 type="text"
                 @click="notifyClean">打扫</el-button>
      <el-button v-else-if="room.state===ROOM_STATE.STAY_CLEAN || room.state===ROOM_STATE.STAY_DARTY"
                 class="text-danger card-header-button"
                 type="text"
                 @click="roomCheckOut">退房</el-button>
      <el-button v-if="room.state===ROOM_STATE.STAY_DARTY"
                 class="text-warning card-header-button"
                 type="text"
                 @click="notifyClean">打扫</el-button>
    </div>
    <div :style="{backgroundColor: roomTheme}"
         class="px-2 py-1">
      <div class="py-3">入住人</div>
      <div class="pb-3">订单来源</div>
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
    createOrder() {},
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
        });
    }
  }
};
</script>
