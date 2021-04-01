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
              <el-input v-model="queries.name"
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
          <el-button v-if="hasPermission('apartment:create')"
                     type="primary"
                     plain
                     @click="editRow()">新建</el-button>
        </div>
      </div>
      <template slot="columns">
        <el-table-column label="公寓"
                         align="center"
                         prop="name"
                         :min-width="colWidth.nm" />
        <el-table-column label="联系人"
                         align="center"
                         prop="contactor"
                         :min-width="colWidth.sm" />
        <el-table-column label="联系人手机"
                         align="center"
                         prop="contactorMobile"
                         :min-width="colWidth.sm" />
        <el-table-column label="地址"
                         align="center"
                         prop="address">
          <template slot-scope="{ row }">
            <el-button type="text"
                       @click="showMap">{{ row.address }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         prop="stateName"
                         align="center"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <el-tag :type="APARTMENT_STATE_THEME_MAP[row.state]"> {{ row.stateName }} </el-tag>
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
            <el-button v-if="hasPermission('apartment:update')"
                       type="text"
                       :class="row.state!==APARTMENT_STATE.FORBIDDEN?'text-warning':'text-primary'"
                       @click="toggleForbiddenRow(row)">{{ row.state!==APARTMENT_STATE.FORBIDDEN ? '禁用' : '启用' }}</el-button>
            <el-button v-if="hasPermission('apartment:delete')"
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
import { MODULE } from '@/store/constant';
import { baseTableMixin } from '@/utils/mixins';
import { PATH_MAP } from '@/router/modules/apartment';
import { confirmMessage, toastWarning } from '@/utils/message';
import { deepClone } from '@/utils/index';

export default {
  name: 'ApartmentManagementIndex',
  mixins: [baseTableMixin],
  data() {
    return {
      showMoreFilter: false,
      qStates: [],
      createdRange: [],
      queries: {
        state: null,
        name: null,
        createdAtStart: null,
        createdAtStop: null
      }
    };
  },
  computed: {
    mParam() {
      return {
        paramMode: true,
        module: MODULE.APARTMENT,
        editPath: PATH_MAP.MANAGEMENT_EDIT,
        primaryKey: 'uuid'
      };
    }
  },
  methods: {
    beforeFetch() {
      this.queries.state = +this.qStates[0] || undefined;
      this.queries.createdAtStart = this.createdRange[0];
      this.queries.createdAtStop = this.createdRange[1];
    },
    toggleForbiddenRow(row) {
      const item = deepClone(row);
      const msg =
        item.state === this.APARTMENT_STATE.FORBIDDEN
          ? '是否确定启用公寓? 启用后可以直接接单.'
          : '是否确定禁用当前公寓?';

      confirmMessage(msg)
        .then(() => {
          item.state =
            item.state === this.APARTMENT_STATE.FORBIDDEN
              ? this.APARTMENT_STATE.NORMAL
              : this.APARTMENT_STATE.FORBIDDEN;
          this.saveRow(item);
        })
        .catch(() => {
          // ignore
        });
    },
    showMap() {
      toastWarning('地图查看: 敬请期待');
    }
  }
};
</script>
