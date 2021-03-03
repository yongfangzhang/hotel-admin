<template>
  <el-dialog :title="title"
             :visible.sync="currentValue"
             :width="width"
             custom-class="fixed-dialog">
    <el-form v-if="entity"
             :label-width="labelWidth"
             label-position="left">
      <el-form-item v-for="item in items"
                    :key="item.key"
                    :label="item.label"
                    class="mb-1">
        <slot v-if="item.slot"
              :name="item.key" />
        <m-view v-else
                :value="parseValue(item)"
                :type="item.type" />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="currentValue=false"> 关闭 </el-button>
    </span>
  </el-dialog>
</template>
<script>
import sync from '@/utils/sync';
import { getValueByKeys } from '@/utils/index';

export default {
  name: 'MViewDialog',
  mixins: [sync],
  props: {
    title: { type: String, default: '' },
    width: { type: String, default: '60%' },
    labelWidth: { type: String, default: '80px' },
    entity: { type: Object, default: null },
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    parseValue(item) {
      const v = getValueByKeys(this.entity, item.key);
      if (item.map) {
        return item.map[v];
      }
      return v;
    }
  }
};
</script>

