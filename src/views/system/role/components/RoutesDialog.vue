<template>
  <m-dialog v-model="currentValue"
            :title="title"
            :has-confirm="false"
            width="md"
            dialog-class="fixed-dialog">
    <el-table :data="routes"
              border
              fit
              highlight-current-row>
      <el-table-column label="路由路径"
                       prop="path"
                       :min-width="colWidth.lg" />
      <el-table-column label="类型"
                       prop="typeName"
                       align="center"
                       :min-width="colWidth.sm" />
      <el-table-column label="权限名称"
                       prop="caption" />
      <el-table-column label="授权标识"
                       prop="permissions">
        <template slot-scope="{ row }">
          <m-view v-if="!row.permissions" />
          <div v-else>
            <div v-for="(p,i) in row.permissions"
                 :key="i">{{ p }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="描述"
                       prop="description">
        <template slot-scope="{ row }">
          <m-view :value="row.description" />
        </template>
      </el-table-column>
    </el-table>
  </m-dialog>
</template>
<script>
import sync from '@/utils/sync';
export default {
  name: 'RoutesDialog',
  mixins: [sync],
  props: {
    viewInfo: {
      type: Object,
      default: null
    }
  },
  computed: {
    title() {
      return this.getValue('name');
    },
    routes() {
      return this.getValue('routes', []);
    }
  },
  methods: {
    getValue(k, d) {
      if (!this.viewInfo) return d;
      return this.formatText(this.viewInfo[k], d);
    }
  }
};
</script>
