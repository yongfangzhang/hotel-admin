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
            <el-form-item label="订单号">
              <el-input v-model="queries.number"
                        placeholder="请输入"
                        clearable
                        @clear="doFilter"
                        @keydown.enter.native="doFilter" />
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
            <el-form-item label="渠道">
              <m-selector v-model="queries.channel"
                          :map="ORDER_CHANNEL_MAP"
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
            <datetime-filter v-model="createdRange"
                             @change="doFilter" />
            <state-filter v-model="qStates"
                          :map="APARTMENT_STATE_MAP"
                          :theme-map="APARTMENT_STATE_THEME_MAP"
                          @change="doFilter" />
          </div>
        </el-form>
        <div class="text-nowrap">
          <query-button type="query"
                        @click="doFilter" />
          <query-button type="reset"
                        @click="resetFilter" />
          <el-button v-if="hasPermission('order:create')"
                     type="primary"
                     plain
                     @click="editRow()">新建</el-button>
        </div>
      </div>
      <template slot="columns">
        <el-table-column label="订单号"
                         align="center"
                         prop="number"
                         :min-width="colWidth.md" />
        <el-table-column label="渠道"
                         align="center"
                         prop="channelName"
                         :min-width="colWidth.xs" />
        <el-table-column label="客户类型"
                         align="center"
                         prop="userTypeName"
                         :min-width="colWidth.xs" />
        <el-table-column label="状态"
                         prop="stateName"
                         align="center"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <el-tag :type="ORDER_STATE_THEME_MAP[row.state]"> {{ row.stateName }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付价格"
                         align="center"
                         prop="paidPrice"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="row.paidPrice"
                    type="currency" />
          </template>
        </el-table-column>
        <el-table-column label="押金"
                         align="center"
                         prop="deposit"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="row.deposit"
                    type="currency" />
          </template>
        </el-table-column>
        <el-table-column label="扣除押金"
                         align="center"
                         prop="depositDeduction"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="row.depositDeduction"
                    type="currency" />
          </template>
        </el-table-column>
        <el-table-column label="押金状态"
                         align="center"
                         prop="depositState"
                         :min-width="colWidth.sm">
          <template slot-scope="{ row }">
            <el-tag :type="DEPOSIT_STATE_THEME_MAP[row.depositState]"> {{ row.depositStateName }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间"
                         prop="createdAt"
                         align="center"
                         :min-width="colWidth.datetime" />
        <el-table-column label="支付时间"
                         prop="paidAt"
                         align="center"
                         :min-width="colWidth.datetime" />
        <el-table-column label="操作"
                         align="center"
                         :min-width="colWidth.op2">
          <template slot-scope="{ row }">
            <el-button type="text"
                       @click="editRow(row)">管理</el-button>
            <el-button v-if="hasPermission('order:update')"
                       type="text"
                       class="text-danger"
                       :disabled="row.state===ORDER_STATE.UNPAID"
                       @click="abandonRow(row)">作废</el-button>
          </template>
        </el-table-column>
      </template>
    </simple-table>
  </div>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import { baseTableMixin } from '@/utils/mixins';
import { PATH_MAP } from '@/router/modules/order';
import { deepClone, list2Map } from '@/utils/index';

export default {
  name: 'OrderManagementIndex',
  mixins: [baseTableMixin],
  data() {
    return {
      apartmentMap: null,
      showMoreFilter: false,
      qStates: [],
      createdRange: [],
      queries: {
        state: null,
        number: null,
        apartmentUuid: null,
        channel: null,
        createdAtStart: null,
        createdAtStop: null
      }
    };
  },
  computed: {
    mParam() {
      return {
        paramMode: true,
        module: MODULE.ORDER,
        editPath: PATH_MAP.MANAGEMENT_EDIT,
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
    init() {
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST).then((list) => {
        this.apartmentMap = list2Map(list, 'uuid', 'shortName');
      });
    },
    beforeFetch() {
      this.queries.state = +this.qStates[0] || undefined;
      this.queries.createdAtStart = this.createdRange[0];
      this.queries.createdAtStop = this.createdRange[1];
    },
    abandonRow(row) {
      const item = deepClone(row);
      item.state = this.ORDER_STATE.ABANDON;
      this.saveRow(item);
    }
  }
};
</script>
