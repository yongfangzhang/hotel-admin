<template>
  <div class="h-100 pb-3 d-flex flex-column">
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
            <el-form-item label="渠道">
              <m-selector v-model="queries.channel"
                          :map="ORDER_CHANNEL_MAP"
                          :width="channelFilterWidth"
                          filterable
                          clearable
                          @keydown.enter.native="doFilter"
                          @change="doFilter"
                          @clear="doFilter" />
            </el-form-item>
            <datetime-filter v-model="createdRange"
                             label="接单日期"
                             :width="dateFilterWidth"
                             @change="doFilter" />
            <el-form-item label="班次">
              <m-selector v-model="shiftValue"
                          :map="SHIFT_TYPE_MAP"
                          :width="shiftFilterWidth"
                          filterable
                          clearable
                          @keydown.enter.native="doFilter"
                          @change="doFilter"
                          @clear="doFilter" />
            </el-form-item>
            <el-button type="text"
                       @click="showMoreFilter=!showMoreFilter">更多查询</el-button>
          </div>
          <div v-show="showMoreFilter">
            <el-form-item label="接单人">
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
        <el-table-column label="销售次数"
                         align="center"
                         prop="saleTimes"
                         :min-width="colWidth.xs" />
        <el-table-column label="总收益"
                         align="center"
                         prop="income"
                         :min-width="colWidth.sm">
          <template slot-scope="{ row }">
            <m-view :value="row.income"
                    type="currency" />
          </template>
        </el-table-column>
      </template>
    </simple-table>
  </div>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import { reportMixins } from './mixins';
import { baseTableMixin } from '@/utils/mixins';
import printJS from 'print-js';

export default {
  name: 'RoomReport',
  mixins: [baseTableMixin, reportMixins],
  data() {
    return {
      queries: {
        number: null,
        channel: null,
        report: true,
        operatorUuid: null,
        apartmentUuid: null,
        orderShiftStart: null,
        orderShiftStop: null,
        orderCreatedAtStart: null,
        orderCreatedAtStop: null
      }
    };
  },
  computed: {
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
      this.mergeCreatedAt();
    },
    printReport() {
      const queries = this.queries || {};
      this.doAction(MODULE.ROOM, ACTIONS.FETCH_PAGE_DATA, {
        limit: -1,
        page: 1,
        ...queries
      }).then((d) => {
        d.list.forEach((item) => {
          item.apartmentName = this.apartmentMap[item.apartmentUuid];
          item.typeName = this.ROOM_TYPE_MAP[item.typeUuid];
        });
        printJS({
          documentTitle: '房间报表',
          printable: d.list,
          properties: [
            { field: 'apartmentName', displayName: '公寓' },
            { field: 'floorNumber', displayName: '楼号' },
            { field: 'unitNumber', displayName: '单元号' },
            { field: 'number', displayName: '房间号' },
            { field: 'typeName', displayName: '房间类型' },
            { field: 'saleTimes', displayName: '销售次数' },
            { field: 'income', displayName: '总收益' }
          ],
          type: 'json'
        });
      });
    }
  }
};
</script>
