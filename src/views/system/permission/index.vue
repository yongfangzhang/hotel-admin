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
            <el-form-item label="类型">
              <m-selector v-model="queries.type"
                          :map="ROUTE_TYPE_MAP"
                          nullable
                          filterable
                          @change="doFilter" />
            </el-form-item>
            <el-form-item label="权限名称">
              <el-input v-model="queries.caption"
                        placeholder="请输入"
                        @keydown.enter.native="doFilter" />
            </el-form-item>
            <el-form-item label="授权标识">
              <el-input v-model="queries.permissions"
                        placeholder="请输入"
                        @keydown.enter.native="doFilter" />
            </el-form-item>
          </div>
        </el-form>
        <div class="text-nowrap">
          <el-button type="primary"
                     @click="doFilter">查询</el-button>
          <el-button type="primary"
                     plain
                     @click="resetFilter">重置</el-button>
          <el-button type="primary"
                     plain
                     @click="editPermission()">新建</el-button>
        </div>
      </div>
      <template slot="columns">
        <el-table-column label="路由路径"
                         header-align="center"
                         prop="path"
                         :width="colWidth.md" />
        <el-table-column label="类型"
                         prop="typeName"
                         align="center"
                         :width="colWidth.sm" />
        <el-table-column label="权限名称"
                         header-align="center"
                         prop="caption" />
        <el-table-column label="授权标识"
                         header-align="center"
                         prop="permissions">
          <template slot-scope="{ row }">
            <m-view v-if="!row.permissions" />
            <div v-else>
              <div v-for="(p,i) in row.permissions.split(',')"
                   :key="i">{{ p }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="描述"
                         header-align="center"
                         prop="description">
          <template slot-scope="{ row }">
            <m-view :value="row.description" />
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         :width="colWidth.op3">
          <template slot-scope="{ row }">
            <div>
              <el-button type="text"
                         @click="editPermission(row)">编辑</el-button>
              <el-button type="text"
                         @click="deleteRow(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </template>
    </simple-table>
    <permission-edit v-model="showEditDialog"
                     :view-info="currentRow"
                     @save="saveItem" />
  </div>
</template>
<script>
import { MODULE } from '@/store/constant';
import { baseTableMixin } from '@/utils/mixins';
import { createModel } from '@/store/modules/system/systemPermission';
import PermissionEdit from './components/PermissionEdit';
import { deepClone } from '@/utils/index';

export default {
  name: 'SystemPermissionIndex',
  components: { PermissionEdit },
  mixins: [baseTableMixin],
  data() {
    return {
      showEditDialog: false,
      currentRow: null,
      queries: {
        permissions: null,
        caption: null,
        type: null
      }
    };
  },
  computed: {
    mParam() {
      return {
        paramMode: true,
        module: MODULE.SYSTEM_PERMISSION,
        primaryKey: 'id'
      };
    }
  },
  mounted() {},
  methods: {
    editPermission(row) {
      this.currentRow = row ? deepClone(row) : createModel();
      this.showEditDialog = true;
    },
    saveItem(item) {
      this.saveRow(item).then((d) => {
        this.showEditDialog = false;
      });
    }
  }
};
</script>
