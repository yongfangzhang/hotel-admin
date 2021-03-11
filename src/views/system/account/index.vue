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
            <el-form-item label="账号名称">
              <el-input v-model="queries.account"
                        placeholder="请输入"
                        clearable
                        @clear="doFilter"
                        @keydown.enter.native="doFilter" />
            </el-form-item>
            <el-form-item label="用户名称">
              <el-input v-model="queries.name"
                        placeholder="请输入"
                        clearable
                        @clear="doFilter"
                        @keydown.enter.native="doFilter" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="queries.mobile"
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
                          :map="USER_STATE_MAP"
                          :theme-map="USER_STATE_THEME_MAP"
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
        <el-table-column label="账号名称"
                         align="center"
                         prop="account"
                         :min-width="colWidth.sm" />
        <el-table-column label="用户名称"
                         align="center"
                         prop="user.name"
                         :min-width="colWidth.nm" />
        <el-table-column label="性别"
                         align="center"
                         prop="user.genderName"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <el-tag :type="GENDER_THEME_MAP[row.gender]"> {{ row.user.genderName }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号"
                         align="center"
                         prop="user.mobile"
                         :min-width="colWidth.sm">
          <template slot-scope="{ row }">
            <m-view :value="row.user.mobile"
                    type="tel" />
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         prop="stateName"
                         align="center"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <el-tag :type="USER_STATE_THEME_MAP[row.state]"> {{ row.stateName }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色"
                         align="center"
                         prop="remark"
                         :min-width="colWidth.xs">
          <template slot-scope="{ row }">
            <el-tag v-for="r in row.roles"
                    :key="r.id"
                    class="mr-2"
                    effect="plain">{{ r.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间"
                         prop="createdAt"
                         align="center"
                         :min-width="colWidth.datetime" />
        <el-table-column label="最后登录时间"
                         prop="lastLoginAt"
                         align="center"
                         :min-width="colWidth.datetime" />
        <el-table-column label="操作"
                         align="center"
                         :min-width="colWidth.op3">
          <template slot-scope="{ row }">
            <el-button type="text"
                       :disabled="row.state!==USER_STATE.NORMAL"
                       @click="editRow(row)">管理</el-button>
            <el-button v-if="row.state===USER_STATE.NORMAL"
                       type="text"
                       class="text-danger"
                       @click="deleteRow(row)">删除</el-button>
            <el-button v-else
                       type="text"
                       class="text-success"
                       @click="recoverRow(row)">恢复</el-button>
          </template>
        </el-table-column>
      </template>
    </simple-table>
  </div>
</template>
<script>
import { MODULE } from '@/store/constant';
import { baseTableMixin } from '@/utils/mixins';
import { PATH_MAP } from '@/router/modules/system';
import { deepClone } from '@/utils/index';

export default {
  name: 'SystemAccountIndex',
  mixins: [baseTableMixin],
  data() {
    return {
      showMoreFilter: false,
      qStates: [],
      createdRange: [],
      queries: {
        account: null,
        state: null,
        name: null,
        mobile: null,
        createdAtStart: null,
        createdAtStop: null
      }
    };
  },
  computed: {
    mParam() {
      return {
        paramMode: true,
        module: MODULE.SYSTEM_ACCOUNT,
        editPath: PATH_MAP.ACCOUNT_EDIT,
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
    recoverRow(row) {
      const item = deepClone(row);
      item.state = this.USER_STATE.NORMAL;
      this.saveRow(item);
    }
  }
};
</script>
