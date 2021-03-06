<template>
  <div class="h-100 pb-3 d-flex flex-column">
    <simple-table ref="table"
                  :module="mParam.module"
                  :queries="queries"
                  :before-fetch="beforeFetch"
                  class="px-3 flex-fill">
      <div slot="header">
        <div class="d-flex justify-content-between">
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
                <el-input v-model="queries.name"
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
        <div class="pb-3">
          <span>时间查询区间: </span>
          <span v-if="queries.orderCreatedAtStart"
                class="text-primary">{{ queries.orderCreatedAtStart }} ~ {{ queries.orderCreatedAtStop }}, </span>
          <span v-else
                class="text-primary">无</span>
          <span>班次查询区间: </span>
          <span v-if="queries.orderShiftStart"
                class="text-primary">{{ queries.orderShiftStart }} ~ {{ queries.orderShiftStop }}</span>
          <span v-else
                class="text-primary">无</span>
        </div>
      </div>
      <template slot="columns">
        <el-table-column label="公寓"
                         align="center"
                         prop="name"
                         :min-width="colWidth.nm" />
        <el-table-column label="联系人"
                         align="center"
                         prop="contactor"
                         :min-width="colWidth.sm" />
        <el-table-column label="联系人手机"
                         align="center"
                         prop="contactorMobile"
                         :min-width="colWidth.sm" />
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
import { deepClone } from '@/utils';

export default {
  name: 'ApartmentReport',
  mixins: [reportMixins, baseTableMixin],
  data() {
    return {
      queries: {
        operatorUuid: null,
        channel: null,
        report: true,
        name: null,
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
        module: MODULE.APARTMENT,
        primaryKey: 'uuid'
      };
    }
  },
  methods: {
    beforeFetch() {
      this.mergeCreatedAt();
    },
    printReport() {
      const queries = this.queries || {};
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_PAGE_DATA, {
        limit: -1,
        page: 1,
        ...queries
      }).then((data) => {
        const d = deepClone(data);
        printJS({
          documentTitle: '公寓报表',
          printable: d.list,
          properties: [
            { field: 'name', displayName: '公寓' },
            { field: 'contactor', displayName: '联系人' },
            { field: 'contactorMobile', displayName: '联系人手机' },
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
