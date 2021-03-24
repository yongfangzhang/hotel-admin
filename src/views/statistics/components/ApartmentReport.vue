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
            <datetime-filter v-model="createdRange"
                             label="接单时间"
                             @change="doFilter" />
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
import { MODULE } from '@/store/constant';
import { reportMixins } from './mixins';
import { baseTableMixin } from '@/utils/mixins';
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
      this.queries.orderCreatedAtStart = this.createdRange[0];
      this.queries.orderCreatedAtStop = this.createdRange[1];
    },
    printReport() {}
  }
};
</script>
