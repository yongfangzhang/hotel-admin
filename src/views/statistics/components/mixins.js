import { MODULE } from '@/store/constant';
import { DATE_TYPE, WEEK_DAY } from '@/utils/constant';
import { str2Date, parseTime, isNotBlank } from '@/utils/index';
import { mapGetters } from 'vuex';

export const chartMixins = {
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      chartExtend: {
        series: {
          smooth: false
        }
      },
      chartHeight: '400px',
      chartWidth: null
    };
  },
  watch: {
    visible() {
      this.setChartSize();
    }
  },
  mounted() {
    this.setChartSize();
  },
  methods: {
    setChartSize() {
      this.$nextTick(() => {
        const body = this.$el.querySelector('.el-card__body');
        this.chartWidth = this.visible ? `${body.offsetWidth}px` : '0px';
        // this.chartHeight = this.visible ? `${body.offsetWidth}px` : '0px';
      });
    },
    groupByDateType() {
      const items = this.orderItems;
      const groups = [];
      const labelIndex = {};
      items.forEach(item => {
        const label = this.parseRowLabel(item.createdAt, this.dateType);
        if (typeof labelIndex[label] === 'undefined') {
          labelIndex[label] = groups.length;
          groups.push({
            label,
            items: []
          });
        }
        groups[labelIndex[label]].items.push(item);
      });
      return groups;
    },
    /**
     * parse row
     * @param {String} dateStr date
     * @param {Numer} dateType date type
     */
    parseRowLabel(dateStr, dateType) {
      switch (dateType) {
        case DATE_TYPE.SEVEN_DAY: {
          return WEEK_DAY[str2Date(dateStr).getDay()];
        }
        case DATE_TYPE.MONTH: {
          return dateStr.substring(0, 10);
        }
        case DATE_TYPE.YEAR: {
          return dateStr.substring(0, 7);
        }
        default:
          return dateStr;
      }
    }
  }
};

export const reportMixins = {
  props: {
    visible: { type: Boolean, default: false },
    apartmentMap: { type: Object, required: true },
    operatorMap: { type: Object, required: true }
  },
  data() {
    const begin = new Date();
    begin.setMonth(begin.getMonth() - 1);
    const end = new Date();
    return {
      showMoreFilter: false,
      shiftValue: null,
      createdRange: [parseTime(begin), parseTime(end)]
    };
  },
  computed: {
    channelFilterWidth() {
      return '100px';
    },
    shiftFilterWidth() {
      return '160px';
    },
    dateFilterWidth() {
      return '220px';
    },
    ...mapGetters(MODULE.DICT, ['ROOM_TYPE_MAP', 'SHIFT_TYPE_MAP'])
  },
  methods: {
    mergeCreatedAt() {
      if (this.createdRange) {
        this.queries.orderCreatedAtStart =
          this.createdRange[0].substring(0, 10) + ' 00:00:00';
        this.queries.orderCreatedAtStop =
          this.createdRange[1].substring(0, 10) + ' 23:59:59';
      } else {
        this.queries.orderCreatedAtStart = null;
        this.queries.orderCreatedAtStop = null;
      }
      if (isNotBlank(this.shiftValue)) {
        const times = this.shiftValue.split('-');
        this.queries.orderShiftStart = `${times[0]}:00`;
        this.queries.orderShiftStop = `${times[1]}:00`;
      } else {
        this.queries.orderShiftStart = null;
        this.queries.orderShiftStop = null;
      }
    }
  }
};
