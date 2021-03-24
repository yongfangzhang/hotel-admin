<template>
  <div class="h-100 py-3 d-flex flex-column">
    <simple-table ref="table"
                  :module="mParam.module"
                  :queries="queries"
                  :before-fetch="beforeFetch"
                  class="px-3 flex-fill">
      <div slot="header"
           class="d-flex justify-content-between">
        <el-form label-position="left"
                 inline
                 @submit.native.prevent>
          <div>
            <el-form-item label="员工">
              <m-selector v-model="queries.operatorUuid"
                          :map="operatorMap"
                          filterable
                          clearable
                          @keydown.enter.native="doFilter"
                          @change="doFilter"
                          @clear="doFilter" />
            </el-form-item>
            <el-form-item label="公寓">
              <m-selector v-model="queries.apartmentUuid"
                          :map="apartmentMap"
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
            <datetime-filter v-model="createdRange"
                             @change="doFilter" />
          </div>
        </el-form>
        <div class="text-nowrap">
          <query-button type="query"
                        @click="doFilter" />
          <query-button type="reset"
                        @click="resetFilter" />
          <el-button type="primary"
                     plain
                     @click="printReport">打印</el-button>
        </div>
      </div>
      <template slot="columns">
        <el-table-column label="公寓"
                         align="center"
                         prop="apartmentUuid"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="apartmentMap[row.apartmentUuid]" />
          </template>
        </el-table-column>
        <el-table-column label="楼号"
                         align="center"
                         prop="floorNumber"
                         :min-width="colWidth.xs" />
        <el-table-column label="单元号"
                         align="center"
                         prop="unitNumber"
                         :min-width="colWidth.xs" />
        <el-table-column label="房间号"
                         align="center"
                         prop="number"
                         :min-width="colWidth.xs" />
        <el-table-column label="房间类型"
                         align="center"
                         prop="typeUuid"
                         :min-width="colWidth.sm">
          <template slot-scope="{ row }">
            <m-view :value="ROOM_TYPE_MAP[row.typeUuid]" />
          </template>
        </el-table-column>
      </template>
    </simple-table>
  </div>
</template>
<script>
import { MODULE } from '@/store/constant';
import { reportMixins } from './mixins';
import { baseTableMixin } from '@/utils/mixins';
import { mapGetters } from 'vuex';

export default {
  name: 'RoomReport',
  mixins: [baseTableMixin, reportMixins],
  data() {
    return {
      createdRange: [],
      queries: {
        number: null,
        operatorUuid: null,
        apartmentUuid: null,
        createdAtStart: null,
        createdAtStop: null
      }
    };
  },
  computed: {
    ...mapGetters(MODULE.DICT, ['ROOM_TYPE_MAP']),
    mParam() {
      return {
        paramMode: true,
        module: MODULE.ROOM,
        primaryKey: 'uuid'
      };
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {},
    beforeFetch() {
      this.queries.createdAtStart = this.createdRange[0];
      this.queries.createdAtStop = this.createdRange[1];
    },
    printReport() {}
  }
};
</script>
