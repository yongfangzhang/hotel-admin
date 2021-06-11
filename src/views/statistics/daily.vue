<template>
  <div class="h-100">
    <calendar @change="selectedDateChanged"
              @selected="showDetail">
      <div v-for="(items,date) in statisticsMap"
           :key="date"
           :slot="date">
        <daily-item :items="items" />
      </div>
    </calendar>
    <m-dialog v-model="detailDialog"
              title="详情"
              :close-on-confirm="true"
              :has-close="true"
              :has-confirm="false"
              :append-to-body="true"
              width="md">
      <el-table :data="selectedItems"
                border
                stripe
                show-summary>
        <el-table-column label="序号"
                         :resizable="false"
                         align="center"
                         :width="colWidth.xxs">
          <template slot-scope="{ $index }">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道"
                         align="center"
                         prop="channelName"
                         :min-width="colWidth.xs" />
        <el-table-column label="房间收益"
                         align="center"
                         prop="paidPrice"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="row.paidPrice"
                    type="currency" />
          </template>
        </el-table-column>
        <el-table-column label="商品收益"
                         align="center"
                         prop="productIncome"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="row.productIncome"
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
        <el-table-column label="已退押金"
                         align="center"
                         prop="depositRefunded"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="row.depositRefunded"
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
      </el-table>
    </m-dialog>
  </div>
</template>
<script>
import { deepClone, list2GroupMap, parseTime } from '@/utils';
import { PARSE_TIME_TYPE } from '@/utils/constant';
import { ACTIONS, MODULE } from '@/store/constant';
import DailyItem from './components/DailyItem.vue';
export default {
  name: 'StatisticsDaily',
  components: { DailyItem },
  data() {
    return {
      statisticsMap: {},
      selectedItems: [],
      detailDialog: false
    };
  },
  methods: {
    selectedDateChanged(timestamp) {
      const date = new Date(timestamp);
      const startAt = parseTime(date.setDate(1), PARSE_TIME_TYPE.DATE);
      date.setMonth(date.getMonth() + 1);
      const stopAt = parseTime(date.setDate(0), PARSE_TIME_TYPE.DATE);

      this.doAction(MODULE.DAILY_STATISTICS, ACTIONS.FETCH_LIST, {
        statisticsStartDate: startAt,
        statisticsStopDate: stopAt
      }).then((d) => {
        const list = deepClone(d);
        this.statisticsMap = list2GroupMap(list, 'statisticsDate');
      });
    },
    showDetail(date) {
      this.selectedItems = this.statisticsMap[date];
      if (!this.selectedItems || !this.selectedItems.length) return;
      this.detailDialog = true;
    }
  }
};
</script>
