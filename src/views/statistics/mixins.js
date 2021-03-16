import { str2Date } from '@/utils/index';
import { DATE_TYPE, WEEK_DAY } from '@/utils/constant';

export default {
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
