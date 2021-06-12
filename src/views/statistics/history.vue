<template>
  <div class="h-100 pb-3 d-flex flex-column">
    <div class="d-flex justify-content-between border-bottom">
      <el-form class="pt-3 px-3"
               label-position="left"
               inline
               @submit.native.prevent>
        <div>
          <datetime-filter v-model="createdRange"
                           label="接单日期(最大区间7天)"
                           :width="dateFilterWidth" />
        </div>
      </el-form>
    </div>
    <div class="d-flex p-3 flex-fill flex-column">
      <el-table :data="roomList"
                border
                stripe
                height="1"
                class="w-100 h-100 flex-fill">
        <el-table-column label="公寓"
                         align="center"
                         prop="apartmentUuid"
                         :width="colWidth.sm">
          <template slot-scope="{ row }">
            <m-view :value="apartmentMap[row.apartmentUuid]" />
          </template>
        </el-table-column>
        <el-table-column label="房间号"
                         align="center"
                         prop="number"
                         :width="colWidth.sm" />
        <el-table-column label="房间类型"
                         align="center"
                         prop="typeUuid"
                         :width="colWidth.sm">
          <template slot-scope="{ row }">
            <m-view :value="ROOM_TYPE_MAP[row.typeUuid]" />
          </template>
        </el-table-column>
        <el-table-column v-for="col in dateColumns"
                         :key="col"
                         :label="col"
                         header-align="center"
                         :min-width="colWidth.date">
          <template slot-scope="{ row }">
            <div>{{ row.uuid }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { deepClone, list2Map, parseTime, str2Date } from '@/utils';
import { PARSE_TIME_TYPE } from '@/utils/constant';
import { ACTIONS, MODULE } from '@/store/constant';
import { baseTableMixin } from '@/utils/mixins';
import { mapGetters } from 'vuex';
const MAX_DAYS = 6;
const RANGE_MILL_SECONDS = MAX_DAYS * 24 * 3600 * 1000;

export default {
  name: 'StatisticsHistory',
  mixins: [baseTableMixin],
  data() {
    const begin = new Date();
    begin.setDate(begin.getDate() - MAX_DAYS);
    const end = new Date();
    return {
      queries: {
        orderCreatedAtStart: null,
        orderCreatedAtStop: null
      },
      apartmentMap: {},
      createdRange: [
        parseTime(begin, PARSE_TIME_TYPE.DATE),
        parseTime(end, PARSE_TIME_TYPE.DATE)
      ],
      roomList: []
    };
  },
  computed: {
    ...mapGetters(MODULE.DICT, ['ROOM_TYPE_MAP']),
    dateFilterWidth() {
      return '220px';
    },
    dateColumns() {
      const begin = str2Date(this.createdRange[0]);
      const end = str2Date(this.createdRange[1]);
      const columns = [];

      while (begin.getTime() <= end.getTime()) {
        columns.push(parseTime(begin, PARSE_TIME_TYPE.DATE));
        begin.setDate(begin.getDate() + 1);
      }
      return columns;
    }
  },
  watch: {
    createdRange(v) {
      const begin = str2Date(v[0]);
      let end = str2Date(v[1]);

      if (end.getTime() - begin.getTime() > RANGE_MILL_SECONDS) {
        // 超范围
        end = new Date(begin.getTime() + RANGE_MILL_SECONDS);
        this.createdRange = [
          parseTime(begin, PARSE_TIME_TYPE.DATE),
          parseTime(end, PARSE_TIME_TYPE.DATE)
        ];
      }
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
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST).then((d) => {
        const list = deepClone(d);
        this.apartmentMap = list2Map(list, 'uuid', 'shortName');
      });
      this.doFilter();
    },
    doFilter() {
      this.doAction(MODULE.ROOM, ACTIONS.FETCH_LIST).then((d) => {
        this.roomList = deepClone(d);
      });
    }
  }
};
</script>
