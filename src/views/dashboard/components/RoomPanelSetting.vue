<template>
  <m-dialog v-model="currentValue"
            title="房态面板设置"
            :close-on-confirm="true"
            :has-close="false"
            :has-confirm="true"
            :append-to-body="true"
            width="xs"
            @on-close="onClose">
    <el-form ref="form"
             :model="roomSetting"
             :label-width="formLabelWidth.w8">
      <el-form-item label="显示楼号">
        <el-switch v-model="roomSetting.showFloorNumber" />
      </el-form-item>
      <el-form-item label="显示单元号">
        <el-switch v-model="roomSetting.showUnitNumber" />
      </el-form-item>
      <el-form-item label="字体大小">
        <el-select v-model="roomSetting.fontSize"
                   placeholder="请选择">
          <el-option v-for="v in fontArr"
                     :key="v"
                     :label="v"
                     :value="v" />
        </el-select>
      </el-form-item>
      <el-form-item label="每行房间数">
        <el-select v-model="roomSetting.colSpan"
                   placeholder="请选择">
          <el-option v-for="v in spanArr"
                     :key="v"
                     :label="v+'个'"
                     :value="v" />
        </el-select>
      </el-form-item>
      <el-form-item label="每个房间高度">
        <el-input v-model="roomSetting.rowHeight"
                  placeholder="请输入"
                  type="number" />
      </el-form-item>
      <el-form-item label="房态颜色">
        <div v-for="(color, val ) in ROOM_STATE_THEME_MAP"
             :key="val">
          <div class="mr-3 text-middle d-inline-block"
               :style="{color}">{{ ROOM_STATE_MAP[val] }}</div>
          <el-color-picker :value="ROOM_STATE_THEME_MAP[val]"
                           class="text-middle"
                           @change="c=>onColorChanged(val,c)" />
        </div>
      </el-form-item>
    </el-form>
    <el-button slot="footer-left"
               type="danger"
               @click="resetRoomStateTheme">重置房态颜色</el-button>
  </m-dialog>
</template>
<script>
import sync from '@/utils/sync';
import { MODULE, MUTATIONS } from '@/store/constant';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'RoomPanelSetting',
  mixins: [sync],
  data() {
    return {
      spanArr: [1, 2, 3, 4, 6, 8, 12, 24],
      fontArr: ['12px', '14px', '16px', '18px', '20px']
    };
  },
  computed: {
    ...mapState(MODULE.ROOM, ['roomSetting'])
  },
  methods: {
    ...mapMutations(MODULE.ENUMS, [MUTATIONS.UPDATE_ROOM_STATE_THEME_MAP]),
    ...mapMutations(MODULE.ROOM, [MUTATIONS.UPDATE_ROOM_SETTING]),
    onColorChanged(v, c) {
      this[MUTATIONS.UPDATE_ROOM_STATE_THEME_MAP]({
        ...this.ROOM_STATE_THEME_MAP,
        [v]: c
      });
    },
    resetRoomStateTheme() {
      this[MUTATIONS.UPDATE_ROOM_STATE_THEME_MAP]();
    },
    onClose() {
      this[MUTATIONS.UPDATE_ROOM_SETTING](this.roomSetting);
    }
  }
};
</script>
