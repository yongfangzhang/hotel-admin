<template>
  <div class="d-flex justify-content-between">
    <el-form label-position="left"
             inline
             @submit.native.prevent>
      <div>
        <el-form-item label="公寓">
          <m-selector v-model="queries.apartmentUuid"
                      :list="apartmentList"
                      :kmap="{label:'name',value:'uuid'}"
                      filterable
                      clearable
                      @keydown.enter.native="doFilter"
                      @change="doFilter"
                      @clear="doFilter" />
        </el-form-item>
        <el-form-item label="房间号">
          <el-input v-model="queries.number"
                    placeholder="请输入"
                    clearable
                    @clear="doFilter"
                    @keydown.enter.native="doFilter" />
        </el-form-item>
        <state-filter v-model="qStates"
                      :map="ROOM_STATE_MAP"
                      :theme-map="ROOM_STATE_THEME_MAP"
                      theme-type="color"
                      :max="100"
                      @change="doFilter" />
      </div>
    </el-form>
    <div class="text-nowrap">
      <query-button type="query"
                    @click="doFilter" />
      <!-- <query-button type="reset"
                    @click="resetFilter" /> -->
      <el-button type="primary"
                 @click="$emit('show-setting')">设置</el-button>
    </div>
  </div>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import { mapGetters } from 'vuex';
import { deepClone } from '@/utils';
export default {
  name: 'RoomFilter',
  data() {
    return {
      qStates: [],
      apartmentList: [],
      roomList: [],
      queries: {
        states: null,
        number: null,
        apartmentUuid: null
      }
    };
  },
  computed: {
    ...mapGetters(MODULE.DICT, ['ROOM_TYPE_MAP'])
  },
  methods: {
    init() {
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST).then((d) => {
        this.apartmentList = deepClone(d);
        this.$emit('apartment-list', this.apartmentList);
        return this.doFilter();
      });
    },
    doFilter() {
      this.beforeFetch();
      this.doAction(MODULE.ROOM, ACTIONS.FETCH_LIST, this.queries).then((d) => {
        this.roomList = deepClone(d);
        this.$emit('room-list', this.roomList);
      });
    },
    resetFilter() {
      this.queries = this.$options.data().queries;
      this.qStates = [];
      this.$nextTick(() => this.doFilter());
    },
    beforeFetch() {
      if (!this.qStates || !this.qStates.length) {
        this.queries.states = null;
      } else {
        this.queries.states = this.qStates.map((s) => +s).join(',');
      }
    }
  }
};
</script>
