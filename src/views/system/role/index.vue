<template>
  <div class="h-100 py-3 d-flex flex-column">
    <simple-table ref="table"
                  :module="mParam.module"
                  :queries="queries"
                  class="px-3 flex-fill">
      <div slot="header"
           class="d-flex justify-content-between">
        <el-form label-position="left"
                 inline
                 @submit.native.prevent>
          <div>
            <el-form-item label="角色编码">
              <el-input v-model="queries.code"
                        placeholder="请输入"
                        @keydown.enter.native="doFilter" />
            </el-form-item>
            <el-form-item label="角色名称">
              <el-input v-model="queries.name"
                        placeholder="请输入"
                        @keydown.enter.native="doFilter" />
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
        <el-table-column label="角色编码"
                         align="center"
                         prop="code"
                         :min-width="colWidth.md" />
        <el-table-column label="角色名称"
                         align="center"
                         prop="name"
                         :min-width="colWidth.md" />
        <el-table-column label="权限"
                         align="center"
                         :min-width="colWidth.md">
          <template slot-scope="{ row }">
            <el-button type="text"
                       @click="viewRoutes(row)">查看</el-button>
          </template>
        </el-table-column>

        <!-- <el-table-column label="描述"
                         header-align="center"
                         :min-width="colWidth.lg"
                         prop="description">
          <template slot-scope="{ row }">
            <m-view :value="row.description" />
          </template>
        </el-table-column> -->
        <el-table-column label="备注"
                         header-align="center"
                         prop="remark">
          <template slot-scope="{ row }">
            <m-view :value="row.remark"
                    type="remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         :min-width="colWidth.op3">
          <template slot-scope="{ row }">
            <div>
              <el-button type="text"
                         @click="editRow(row)">编辑</el-button>
              <el-button type="text"
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
        code: null
      }
    };
  },
  computed: {
    mParam() {
      return {
        paramMode: true,
        module: MODULE.SYSTEM_ROLE,
        editPath: PATH_MAP.ROLE_EDIT,
        primaryKey: 'uuid'
      };
    }
  },
  methods: {
    viewRoutes(row) {
      this.currentRow = row;
      this.showRoutesDialog = true;
    }
  }
};
</script>
