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
            <el-form-item label="公寓">
              <m-selector v-model="queries.apartmentUuid"
                          :map="apartmentMap"
                          filterable
                          clearable
                          @keydown.enter.native="doFilter"
                          @change="doFilter"
                          @clear="doFilter" />
            </el-form-item>
            <el-form-item label="房间号">
              <el-input v-model="queries.number"
                        placeholder="请输入"
                        clearable
                        @clear="doFilter"
                        @keydown.enter.native="doFilter" />
            </el-form-item>
            <el-button type="text"
                       @click="showMoreFilter=!showMoreFilter">更多查询</el-button>
          </div>
          <div v-show="showMoreFilter">
            <datetime-filter v-model="createdRange"
                             @change="doFilter" />
            <state-filter v-model="qStates"
                          :map="ROOM_STATE_MAP"
                          :theme-map="ROOM_STATE_THEME_MAP"
                          theme-type="color"
                          @change="doFilter" />
          </div>
        </el-form>
        <div class="text-nowrap">
          <query-button type="query"
                        @click="doFilter" />
          <query-button type="reset"
                        @click="resetFilter" />
          <el-button v-if="hasPermission('room:create')"
                     type="primary"
                     plain
                     @click="editRow()">新建</el-button>
        </div>
      </div>
      <template slot="columns">
        <el-table-column label="公寓"
                         align="center"
                         prop="apartmentUuid"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="apartmentMap[row.apartmentUuid]" />
          </template>
        </el-table-column>
        <el-table-column label="楼号"
                         align="center"
                         prop="floorNumber"
                         :min-width="colWidth.xs" />
        <el-table-column label="单元号"
                         align="center"
                         prop="unitNumber"
                         :min-width="colWidth.xs" />
        <el-table-column label="房间号"
                         align="center"
                         prop="number"
                         :min-width="colWidth.xs" />
        <el-table-column label="房间类型"
                         align="center"
                         prop="typeUuid"
                         :min-width="colWidth.sm">
          <template slot-scope="{ row }">
            <m-view :value="ROOM_TYPE_MAP[row.typeUuid]" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="基础价格"
                         align="center"
                         prop="price"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="row.price"
                    type="currency" />
          </template>
        </el-table-column> -->
        <el-table-column v-for="(priceName, priceType) in ROOM_PRICE_TYPE_MAP"
                         :key="priceType"
                         :label="priceName"
                         align="center"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="getPrice(row.prices, priceType)"
                    type="currency"
                    @click.native="updateRoomPrice(row, priceType)" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="销售次数"
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
        </el-table-column> -->
        <el-table-column label="状态"
                         prop="stateName"
                         align="center"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <el-tag>
              <span :style="{color: ROOM_STATE_THEME_MAP[row.state]}">
                {{ row.stateName }}
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间"
                         prop="createdAt"
                         align="center"
                         :min-width="colWidth.datetime" />
        <el-table-column label="操作"
                         align="center"
                         :min-width="colWidth.op3">
          <template slot-scope="{ row }">
            <el-button type="text"
                       @click="editRow(row)">管理</el-button>
            <el-button v-if="hasPermission('room:update')"
                       type="text"
                       :class="row.state!==ROOM_STATE.FORBIDDEN?'text-warning':'text-primary'"
                       @click="toggleForbiddenRow(row)">{{ row.state!==ROOM_STATE.FORBIDDEN ? '禁用' : '启用' }}</el-button>
            <el-button v-if="hasPermission('room:delete')"
                       type="text"
                       class="text-danger"
                       @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </simple-table>
  </div>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import { baseTableMixin } from '@/utils/mixins';
import { PATH_MAP } from '@/router/modules/room';
import { deepClone, list2Map } from '@/utils/index';
import { mapGetters } from 'vuex';
import { confirmMessage } from '@/utils/message';

export default {
  name: 'RoomManagementIndex',
  mixins: [baseTableMixin],
  data() {
    return {
      showMoreFilter: false,
      qStates: [],
      createdRange: [],
      apartmentMap: {},
      queries: {
        state: null,
        number: null,
        apartmentUuid: null,
        createdAtStart: null,
        createdAtStop: null
      }
    };
  },
  computed: {
    ...mapGetters(MODULE.DICT, ['ROOM_TYPE_MAP']),
    mParam() {
      return {
        paramMode: true,
        module: MODULE.ROOM,
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
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST).then((d) => {
        const list = deepClone(d);
        this.apartmentMap = list2Map(list, 'uuid', 'shortName');
      });
    },
    getPrice(prices, type) {
      if (!prices || !prices.length) return 0;
      const priceItem = prices.filter((p) => +p.type === +type)[0];
      return priceItem ? priceItem.price : 0;
    },
    beforeFetch() {
      this.queries.state = +this.qStates[0] || undefined;
      this.queries.createdAtStart = this.createdRange[0];
      this.queries.createdAtStop = this.createdRange[1];
    },
    toggleForbiddenRow(row) {
      const item = deepClone(row);
      const msg =
        item.state === this.ROOM_STATE.FORBIDDEN
          ? '是否确定启用房间? 启用后可以直接接单.'
          : '是否确定禁用当前房间?';

      confirmMessage(msg)
        .then(() => {
          item.state =
            item.state === this.ROOM_STATE.FORBIDDEN
              ? this.ROOM_STATE.EMPTY_CLEAN
              : this.ROOM_STATE.FORBIDDEN;
          this.saveRow(item);
        })
        .catch(() => {
          // ignore
        });
    },
    updateRoomPrice(room, type) {
      if (!this.hasPermission('room:price:update')) return;

      const name = this.ROOM_PRICE_TYPE_MAP[type];

      this.$prompt(`请输入${name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d+(\.\d+)?$/,
        inputErrorMessage: '价格无效',
        inputType: 'number',
        inputValue: this.getPrice(room.prices, type),
        inputPlaceholder: `请输入${name}`
      })
        .then(({ value }) => {
          return this.doAction(MODULE.ROOM, ACTIONS.UPDATE_ROOM_PRICE, {
            uuid: room.uuid,
            model: {
              type: +type,
              price: value
            }
          });
        })
        .then(() => {
          this.doFilter();
        })
        .catch(() => {
          // ignore
        });
    }
  }
};
</script>
