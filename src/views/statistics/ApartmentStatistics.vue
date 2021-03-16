<template>
  <div class="statistics-card-panel">
    <el-row>
      <el-col :xs="24"
              :sm="12">
        <el-card shadow="hover">
          <div slot="header"
               class="p-3 d-flex align-items-center justify-content-between">
            <div> 销售次数 </div>
            <div>
              <el-button type="text"
                         @click="$emit('detail', {incomeData, saleTimesData})">详细</el-button>
            </div>
          </div>
          <ve-line :data="saleTimesData"
                   :legend-visible="false"
                   :height="chartHeight"
                   :width="chartWidth"
                   :extend="chartExtend" />
        </el-card>
      </el-col>
      <el-col :xs="24"
              :sm="12">
        <el-card shadow="hover">
          <div slot="header"
               class="p-3 d-flex align-items-center justify-content-between">
            <div> 总收益 </div>
            <div>
              <el-button type="text"
                         @click="$emit('detail', {incomeData, saleTimesData})">详细</el-button>
            </div>
          </div>
          <ve-line :data="incomeData"
                   :legend-visible="false"
                   :height="chartHeight"
                   :width="chartWidth"
                   :extend="chartExtend" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import chartMixins from './mixins';

export default {
  name: 'ApartmentStatistics',
  mixins: [chartMixins],
  props: {
    orderItems: {
      type: Array,
      required: true
    },
    apartmentMap: {
      type: Object,
      required: true
    },
    dateType: {
      // 本周，本月，本年
      type: Number,
      required: true
    }
  },
  computed: {
    chartData() {
      const groups = this.groupByDateType();

      const columns = ['日期'].concat(Object.values(this.apartmentMap));

      const timesRows = [];
      const incomeRows = [];

      groups.forEach((d) => {
        const row1 = { 日期: d.label };
        const row2 = { 日期: d.label };
        d.items.forEach((item) => {
          const apartmentName = this.apartmentMap[item.apartmentUuid];
          if (!row1[apartmentName]) row1[apartmentName] = 0;
          if (!row2[apartmentName]) row2[apartmentName] = 0;
          row1[apartmentName] += 1;
          row2[apartmentName] += +item.paidPrice;
        });
        timesRows.push(row1);
        incomeRows.push(row2);
      });

      return {
        columns,
        timesRows,
        incomeRows
      };
    },
    saleTimesData() {
      const { columns, timesRows } = this.chartData;
      return { columns, rows: timesRows };
    },
    incomeData() {
      const { columns, incomeRows } = this.chartData;
      return { columns, rows: incomeRows };
    }
  }
};
</script>
