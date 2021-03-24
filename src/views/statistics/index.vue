<template>
  <div class="h-100">
    <div class="h-100 d-flex flex-column py-3">
      <div class="d-flex justify-content-between px-3">
        <el-form label-position="left"
                 inline
                 @submit.native.prevent>
          <el-form-item label="日期">
            <m-selector v-model="dateType"
                        :map="DATE_TYPE_MAP"
                        clearable
                        @keydown.enter.native="doFilter"
                        @change="doFilter"
                        @clear="doFilter" />
          </el-form-item>
        </el-form>
        <!-- <div class="text-nowrap">
        <query-button type="query"
                      @click="doFilter" />
      </div> -->
      </div>
      <div class="scrollable-y flex-fill statistics-container">
        <el-tabs v-model="activeName"
                 class="px-3">
          <el-tab-pane label="公寓"
                       name="apartment">
            <apartment-statistics :apartment-map="apartmentMap"
                                  :order-items="orderItems"
                                  :date-type="dateType"
                                  :visible="activeName==='apartment'"
                                  @detail="onDetail" />
          </el-tab-pane>
          <el-tab-pane label="房间"
                       name="room">
            <room-statistics :apartment-map="apartmentMap"
                             :order-items="orderItems"
                             :date-type="dateType"
                             :room-map="roomMap"
                             :visible="activeName==='room'"
                             @detail="onDetail" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <m-dialog v-model="showDetailDialog"
              title="详细信息"
              :has-close="true"
              :has-confirm="false"
              :append-to-body="true"
              width="md">
      <div class="py-2 font-weight-bold">收益</div>
      <el-table :data="detailIncomeRows"
                border
                stripe>
        <el-table-column v-for="col in detailIncomeColumns"
                         :key="col"
                         :label="col"
                         :prop="col"
                         align="center">
          <template slot-scope="{ row }">
            <div v-if="col==='日期'">{{ row[col] }}</div>
            <m-view v-else
                    :value="row[col]"
                    type="currency" />
          </template>
        </el-table-column>
      </el-table>
      <div class="py-2 font-weight-bold">次数</div>
      <el-table :data="detailSaleTimesRows"
                border
                stripe>
        <el-table-column v-for="col in detailSaleTimesColumns"
                         :key="col"
                         :label="col"
                         :prop="col"
                         align="center">
          <template slot-scope="{ row }">
            <div v-if="col==='日期'">{{ row[col] }}</div>
            <m-view v-else
                    :value="row[col]"
                    type="number" />
          </template>
        </el-table-column>
      </el-table>
    </m-dialog>
  </div>
</template>
<script>
import { DATE_TYPE, DATE_TYPE_MAP } from '@/utils/constant';
import ApartmentStatistics from './components/ApartmentStatistics.vue';
import RoomStatistics from './components/RoomStatistics.vue';
import { ACTIONS, MODULE } from '@/store/constant';
import { list2Map, parseTime } from '@/utils/index';
export default {
  name: 'Statistics',
  components: { ApartmentStatistics, RoomStatistics },
  data() {
    return {
      activeName: 'apartment',
      dateType: DATE_TYPE.SEVEN_DAY,
      orderItems: [],
      apartmentMap: {},
      roomMap: {},
      detailIncomeColumns: [],
      detailIncomeRows: [],
      detailSaleTimesColumns: [],
      detailSaleTimesRows: [],
      showDetailDialog: false
    };
  },
  computed: {
    DATE_TYPE_MAP() {
      return DATE_TYPE_MAP;
    },
    dateRange() {
      const start = new Date();
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
      start.setMilliseconds(0);

      const stop = new Date();
      stop.setHours(23);
      stop.setMinutes(59);
      stop.setSeconds(59);
      stop.setMilliseconds(0);

      switch (+this.dateType) {
        case DATE_TYPE.SEVEN_DAY: {
          start.setDate(start.getDate() - 6);
          break;
        }
        case DATE_TYPE.MONTH: {
          start.setDate(1);
          break;
        }
        case DATE_TYPE.YEAR: {
          start.setDate(1);
          start.setMonth(0);
          break;
        }
        default:
          break;
      }

      return {
        createdAtStart: parseTime(start),
        createdAtStop: parseTime(stop)
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
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST)
        .then((list) => {
          this.apartmentMap = list2Map(list, 'uuid', 'shortName');
          return this.doAction(MODULE.ROOM, ACTIONS.FETCH_LIST);
        })
        .then((list) => {
          const map = {};
          list.forEach((room) => {
            map[room.uuid] =
              this.apartmentMap[room.apartmentUuid] + '-' + room.number;
          });
          this.roomMap = map;
          this.doFilter();
        });
    },
    doFilter() {
      this.doAction(MODULE.ORDER, ACTIONS.FETCH_LIST, {
        ...this.dateRange,
        asc: 'uuid',
        desc: undefined,
        states: [
          this.ORDER_STATE.UNPAID,
          this.ORDER_STATE.UNUSED,
          this.ORDER_STATE.USED,
          this.ORDER_STATE.FINISHED
        ].join(',')
      }).then((orders) => {
        this.orderItems = orders.flatMap((order) => order.items);
      });
    },
    onDetail({ incomeData, saleTimesData }) {
      this.detailIncomeColumns = incomeData.columns;
      this.detailIncomeRows = incomeData.rows;
      this.detailSaleTimesColumns = saleTimesData.columns;
      this.detailSaleTimesRows = saleTimesData.rows;
      this.showDetailDialog = true;
    }
  }
};
</script>
