<template>
  <div class="h-100 py-3 d-flex flex-column">
    <simple-table ref="table"
                  :module="mParam.module"
                  :queries="queries"
                  :sequenced="false"
                  :before-fetch="beforeFetch"
                  class="px-3 flex-fill">
      <div slot="header"
           class="d-flex justify-content-between">
        <el-form label-position="left"
                 inline
                 @submit.native.prevent>
          <div>
            <el-form-item label="角色名称">
              <el-input v-model="queries.name"
                        placeholder="请输入"
                        @keydown.enter.native="doFilter" />
            </el-form-item>
            <el-form-item label="是否预置">
              <m-selector v-model="queries.preset"
                          :map="BOOLEAN_FLAG_MAP"
                          nullable
                          @change="doFilter" />
            </el-form-item>
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
        <el-table-column label="ID"
                         prop="id"
                         align="center"
                         :width="colWidth.xxs" />
        <el-table-column label="角色名称"
                         header-align="center"
                         prop="name"
                         show-overflow-tooltip
                         :width="colWidth.nm" />
        <el-table-column label="是否预置"
                         prop="editable"
                         align="center"
                         :width="colWidth.xs">
          <template slot-scope="{ row }">
            <m-view :value="!row.editable"
                    type="boolean" />
          </template>
        </el-table-column>
        <el-table-column label="权限"
                         align="center"
                         :width="colWidth.sm">
          <template slot-scope="{ row }">
            <el-button type="text"
                       @click="viewRoutes(row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="描述"
                         header-align="center"
                         show-overflow-tooltip
                         :width="colWidth.lg"
                         prop="description">
          <template slot-scope="{ row }">
            <m-view :value="row.description" />
          </template>
        </el-table-column>
        <el-table-column label="备注"
                         header-align="center"
                         show-overflow-tooltip
                         prop="remark">
          <template slot-scope="{ row }">
            <m-view :value="row.remark"
                    type="remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         :width="colWidth.op3">
          <template slot-scope="{ row }">
            <div>
              <el-button type="text"
                         :disabled="!row.editable"
                         @click="editRow(row)">编辑</el-button>
              <el-button type="text"
                         :disabled="!row.editable"
                         @click="deleteRow(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </template>
    </simple-table>
    <routes-dialog v-model="showRoutesDialog"
                   :view-info="currentRow" />
  </div>
</template>
<script>
import { MODULE } from '@/store/constant';
import { baseTableMixin } from '@/utils/mixins';
import { PATH_MAP } from '@/router/modules/system';
import RoutesDialog from './components/RoutesDialog';
export default {
  name: 'SystemRoleIndex',
  components: { RoutesDialog },
  mixins: [baseTableMixin],
  data() {
    return {
      currentRow: null,
      showRoutesDialog: false,
      queries: {
        name: null,
        preset: null,
        editable: null
      }
    };
  },
  computed: {
    mParam() {
      return {
        paramMode: true,
        module: MODULE.SYSTEM_ROLE,
        editPath: PATH_MAP.ROLE_EDIT,
        primaryKey: 'id'
      };
    }
  },
  mounted() {},
  methods: {
    viewRoutes(row) {
      this.currentRow = row;
      this.showRoutesDialog = true;
    },
    beforeFetch() {
      this.queries.editable = 1;
      if (this.queries.preset === null) {
        this.queries.editable = null;
      } else {
        this.queries.editable = 1 - this.queries.preset;
      }
    }
  }
};
</script>
