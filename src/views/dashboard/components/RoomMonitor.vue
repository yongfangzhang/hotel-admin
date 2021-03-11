<template>
  <div>
    <div class="h-100 py-3 d-flex flex-column">
      <room-filter ref="filter"
                   class="px-3"
                   @show-setting="showSetting=true" />
      <div class="flex-fill scrollable-y room-item-panel">
        <div v-for="(rooms,apartment) in roomGroupList"
             :key="apartment">
          <div class="font-18 p-3 border-bottom border-top d-flex align-items-center">
            <div class="font-weight-bold">{{ apartmentMap[apartment].name }}</div>
            <div class="font-weight-bold">【{{ apartmentMap[apartment].address }}】</div>
            <!-- <div>【联系人】{{ apartmentMap[apartment].contactor }}</div>
            <div> (</div>
            <m-view type="tel"
                    :value="apartmentMap[apartment].contactorMobile" />
            <div> )</div> -->
          </div>
          <el-row class="p-3">
            <el-col v-for="room in rooms"
                    :key="room.uuid"
                    :span="24 / roomSetting.colSpan">
              <room-item :room="room"
                         @filter="doFilter" />
            </el-col>
          </el-row>
        </div>
        <div v-if="!roomList || roomList.length===0"
             class="text-center mt-5 text-muted">暂未查询到房间</div>
      </div>
      <div class="text-right pt-3 px-3 border-top">
        <el-button type="primary"
                   @click="createRoom">
          新建房间
        </el-button>
      </div>
    </div>
    <room-panel-setting v-model="showSetting" />
  </div>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import RoomFilter from './RoomFilter.vue';
import RoomItem from './RoomItem.vue';
import RoomPanelSetting from './RoomPanelSetting.vue';
import { mapState } from 'vuex';
import { list2Map } from '@/utils/index';
export default {
  name: 'RoomMonitor',
  components: { RoomFilter, RoomItem, RoomPanelSetting },
  data() {
    return {
      showSetting: false
    };
  },
  computed: {
    ...mapState(MODULE.ROOM, ['roomSetting']),
    roomList() {
      return this.$store.state[MODULE.ROOM].list || [];
    },
    apartmentMap() {
      const apartmentList = this.$store.state[MODULE.APARTMENT].list || [];
      return list2Map(apartmentList, 'uuid');
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
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST);
    },
    createRoom() {},
    doFilter() {
      this.$refs.filter.doFilter();
    }
  }
};
</script>
