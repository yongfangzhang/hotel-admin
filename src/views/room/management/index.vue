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
            <el-form-item label="公寓名称">
              <el-input v-model="queries.account"
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
          <el-button type="primary"
                     plain
                     @click="editRow()">新建</el-button>
        </div>
      </div>
      <template slot="columns">
        <el-table-column label="公寓名称"
                         align="center"
                         prop="name"
                         show-overflow-tooltip
                         :min-width="colWidth.sm" />
        <el-table-column label="状态"
                         prop="stateName"
                         align="center"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <el-tag :type="APARTMENT_STATE_THEME_MAP[row.state]"> {{ row.stateName }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间"
                         prop="createdAt"
                         align="center"
                         :min-width="colWidth.datetime" />
        <el-table-column label="操作"
                         align="center"
                         :width="colWidth.op3">
          <template slot-scope="{ row }">
            <el-button type="text"
                       @click="editRow(row)">管理</el-button>
            <el-button type="text"
                       class="text-warning"
                       :disabled="row.state!==APARTMENT_STATE.NORMAL"
                       @click="forbiddenRow(row)">禁用</el-button>
            <el-button type="text"
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
import { PATH_MAP } from '@/router/modules/room';
import { deepClone } from '@/utils/index';

export default {
  name: 'RoomManagementIndex',
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
        module: MODULE.ROOM,
        editPath: PATH_MAP.MANAGEMENT_EDIT,
        primaryKey: 'uuid'
      };
    }
  },
  mounted() {},
  methods: {
    beforeFetch() {
      this.queries.state = +this.qStates[0] || undefined;
      this.queries.createdAtStart = this.createdRange[0];
      this.queries.createdAtStop = this.createdRange[1];
    },
    forbiddenRow(row) {
      const item = deepClone(row);
      item.state = this.APARTMENT_STATE.FORBIDDEN;
      this.saveRow(item);
    }
  }
};
</script>
