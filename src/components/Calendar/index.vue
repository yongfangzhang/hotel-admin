<template>
  <div class="d-flex flex-column bg-white calendar-container">
    <!-- 标题 -->
    <div class="calendar_header d-flex justify-content-between align-items-center">
      <div class="calendar_title">{{ title }}</div>
      <el-button-group class="calendar_tab-btn">
        <el-button :type="activeButton==='last'?'primary': ''"
                   @click="toLastMonth">上个月</el-button>
        <el-button :type="activeButton==='today'?'primary': ''"
                   @click="toToday">今天</el-button>
        <el-button :type="activeButton==='next'?'primary': ''"
                   @click="toNextMonth">下个月</el-button>
      </el-button-group>
    </div>
    <!-- week -->
    <div class="calendar_weekdays d-flex align-items-center">
      <div v-for="d in days"
           :key="d"
           class="flex-fill text-center">
        {{ d }}
      </div>
    </div>
    <!-- day -->
    <div class="flex-fill calendar_days">
      <div class="border-right border-bottom">
        <div v-for="row in rowCount"
             :key="row"
             class="d-flex">
          <!--        :style="{height: rowHeight}"-->
          <div v-for="(d,idx) in days"
               :key="d"
               :class="{'notCurrentMonth': notCurrentMonth((row - 1) * 7 + idx), 'isCurDay': isCurDay((row - 1) * 7 + idx) }"
               class="border-left border-top flex-fill day-content">
            <div class="day-number">
              <span>
                {{ parseDay((row - 1) * 7 + idx) }}
              </span>
              <span class="is_current-day ml-2">
                今
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils';
import { PARSE_TIME_TYPE } from '@/utils/constant';
export default {
  name: 'Calendar',
  data() {
    return {
      activeButton: 'today',
      selectedDate: Date.now(),
      days: ['日', '一', '二', '三', '四', '五', '六']
    };
  },
  computed: {
    currentMonth() {
      return parseTime(this.selectedDate, PARSE_TIME_TYPE.MONTH);
    },
    title() {
      return parseTime(this.selectedDate, '{yyyy}年{mm}月');
    },
    firstDay() {
      return this._setDate(1).getDay();
    },
    lastTotalDate() {
      return this._setDate(0).getDate();
    },
    totalDate() {
      return this.createDate(this._addMonth(1).setDate(0)).getDate();
    },
    rowCount() {
      return Math.ceil((this.totalDate + this.firstDay) / 7);
    },
    rowHeight() {
      return `${Math.floor(10000 / this.rowCount) / 100}%`;
    }
  },
  // mounted() {
  //   this.init();
  // },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.toToday();
    },
    _setDate(v, d) {
      return this.createDate(this.createDate(d).setDate(v));
    },
    _addMonth(v, d) {
      const date = this.createDate(d);
      return this.createDate(date.setMonth(date.getMonth() + v));
    },
    createDate(d) {
      return new Date(d || this.selectedDate);
    },
    setActiveButton(flag) {
      this.activeButton = flag;
    },
    toToday() {
      this.setActiveButton('today');
      this.selectedDate = Date.now();
      this.$emit('change', this.selectedDate);
    },
    toLastMonth() {
      this.setActiveButton('last');
      this.selectedDate = this._addMonth(-1).getTime();
      this.$emit('change', this.selectedDate);
    },
    toNextMonth() {
      this.setActiveButton('next');
      this.selectedDate = this._addMonth(1).getTime();
      this.$emit('change', this.selectedDate);
    },
    parseDay(position) {
      const currentDay = position - this.firstDay + 1;
      // 上个月的
      if (currentDay < 1) {
        return this.lastTotalDate + currentDay;
      }
      //   下个月的
      if (currentDay > this.totalDate) {
        return currentDay - this.totalDate;
      }
      return currentDay;
    },
    notCurrentMonth(position) {
      const currentDay = position - this.firstDay + 1;
      // 上个月的
      if (currentDay < 1) {
        return true;
      }
      //   下个月的
      if (currentDay > this.totalDate) {
        return true;
      }
      return false;
    },
    isCurDay(num) {
      const curDate = new Date(this.selectedDate);
      const d = new Date();
      const date = this.parseDay(num);
      if (
        d.getFullYear() === curDate.getFullYear() &&
        d.getMonth() === curDate.getMonth() &&
        date === d.getDate() &&
        !this.notCurrentMonth(num)
      ) {
        return true;
      }
      return false;
    },
    parseSlotName(position) {
      let currentDay = position - this.firstDay + 1;
      let month = this.currentMonth;
      // 上个月的
      if (currentDay < 1) {
        month = parseTime(this._addMonth(-1), PARSE_TIME_TYPE.MONTH);
        currentDay = this.lastTotalDate + currentDay;
      } else if (currentDay > this.totalDate) {
        //   下个月的
        month = parseTime(this._addMonth(1), PARSE_TIME_TYPE.MONTH);
        currentDay = currentDay - this.totalDate;
      }
      return `${month}-${('0' + currentDay).slice(-2)}`;
    }
  }
};
</script>
