<template>
  <el-dialog title="引用信息"
             :visible.sync="currentValue"
             :width="dialogWidth.md">
    <el-table :data="refData"
              border
              fit
              highlight-current-row>
      <el-table-column label="引用ID"
                       prop="refId"
                       :width="colWidth.xs" />
      <el-table-column label="引用类型"
                       prop="refTypeName"
                       :width="colWidth.md" />
      <el-table-column label="引用描述"
                       prop="refName" />
    </el-table>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="currentValue = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import sync from '@/utils/sync';
export default {
  name: 'ModelReference',
  mixins: [sync],
  props: {
    refData: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
