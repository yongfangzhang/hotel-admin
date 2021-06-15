<template>
  <div class="h-100">
    <div class="h-100 d-flex flex-column">
      <div class="d-flex justify-content-between">
        <el-form class="pt-3 px-3"
                 label-position="left"
                 inline
                 @submit.native.prevent>
          <div>
            <datetime-filter v-model="createdRange"
                             label="接单日期(最大区间7天)"
                             :width="dateFilterWidth" />
            <el-form-item label="公寓">
              <m-selector v-model="queries.apartmentUuid"
                          :map="apartmentMap"
                          filterable
                          clearable
                          @keydown.enter.native="doFilter"
                          @change="doFilter"
                          @clear="doFilter" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="d-flex px-3 pb-3 flex-fill flex-column scrollable-y">
        <el-table :data="roomList"
                  border
                  stripe
                  class="w-100 h-100 flex-fill scrollable-y">
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
            <template slot-scope="{ row, column}">
              <div v-if="roomOrderMap[column.label] && roomOrderMap[column.label][row.uuid]">
                <el-button v-for="item in roomOrderMap[column.label][row.uuid]"
                           :key="item.uuid"
                           type="text"
                           class="m-0 text-left d-block w-100"
                           @click="showOrderDetail(item.order)">
                  <div>姓名: {{ item.name }}</div>
                  <div>渠道: {{ item.order.channelName }}</div>
                  <div>房价: {{ item.order.paidPrice }}</div>
                  <div>商品: {{ item.order.productIncome }}</div>
                  <div>收益: {{ item.order.paidPrice + item.order.productIncome }}</div>
                </el-button>
              </div>
              <div v-else
                   class="text-center">--</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <m-dialog v-model="showDetailDialog"
              title="订单详情"
              :has-close="true"
              :has-confirm="false"
              :append-to-body="true"
              width="sm">
      <order-detail :current-order="currentOrder"
                    :apartment-map="apartmentMap" />
    </m-dialog>
  </div>
</template>
<script>
import { deepClone, list2Map, parseTime, str2Date } from '@/utils';
import { PARSE_TIME_TYPE } from '@/utils/constant';
import { ACTIONS, MODULE } from '@/store/constant';
import { baseTableMixin } from '@/utils/mixins';
import { mapGetters } from 'vuex';
import OrderDetail from '@/views/order/management/components/OrderDetail.vue';

const MAX_DAYS = 6;
const RANGE_MILL_SECONDS = MAX_DAYS * 24 * 3600 * 1000;

export default {
  name: 'StatisticsHistory',
  components: { OrderDetail },
  mixins: [baseTableMixin],
  data() {
    const begin = new Date();
    begin.setDate(begin.getDate() - MAX_DAYS);
    const end = new Date();
    return {
      currentOrder: null,
      showDetailDialog: false,
      queries: {
        apartmentUuid: null,
        createdAtStart: null,
        createdAtStop: null
      },
      apartmentMap: {},
      createdRange: [
        parseTime(begin, PARSE_TIME_TYPE.DATE),
        parseTime(end, PARSE_TIME_TYPE.DATE)
      ],
      roomList: [],
      roomOrderMap: {}
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
        return;
      }
      this.doFilter();
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
      this.doAction(MODULE.ROOM, ACTIONS.FETCH_LIST).then((d) => {
        this.roomList = deepClone(d);
        this.doFilter();
      });
    },
    doFilter() {
      this.queries.createdAtStart = this.createdRange[0];
      this.queries.createdAtStop = this.createdRange[1];
      this.doAction(MODULE.ORDER, ACTIONS.FETCH_LIST, {
        ...this.queries,
        desc: 'uuid',
        states: [
          this.ORDER_STATE.UNPAID,
          this.ORDER_STATE.UNUSED,
          this.ORDER_STATE.USED,
          this.ORDER_STATE.FINISHED
        ].join(',')
      }).then((d) => {
        const orderList = deepClone(d);
        const map = {};
        orderList.forEach((order) => {
          const createdAt = parseTime(order.createdAt, PARSE_TIME_TYPE.DATE);
          if (!map[createdAt]) map[createdAt] = {};
          const colMap = map[createdAt];
          order.items.forEach((item) => {
            item.order = order;
            if (!colMap[item.roomUuid]) colMap[item.roomUuid] = [];
            colMap[item.roomUuid].push(item);
          });
        });
        console.log(map);
        this.roomOrderMap = map;
      });
    },
    showOrderDetail(order) {
      this.currentOrder = order;
      this.showDetailDialog = true;
    }
  }
};
</script>
