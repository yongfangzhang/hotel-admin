<template>
  <el-collapse :value="activeName"
               class="m-collapse">
    <el-collapse-item v-for="item in items"
                      :key="item.title"
                      :name="item.title">
      <template slot="title">
        <h3 class="px-3 m-0 border-bottom w-100"> {{ item.title }} </h3>
      </template>
      <el-row class="mt-3">
        <el-col v-for="(col, k) in cols"
                :key="k"
                :xs="24"
                :sm="col.sm"
                class="px-3">
          <el-form-item v-for="child in item[k]"
                        :key="child.key"
                        :label="child.label"
                        :prop="child.key">
            <slot v-if="child.slot"
                  :name="child.key" />
            <m-edit v-else
                    v-model="entity[child.key]"
                    :disabled="!child.alwaysEnable && disabled"
                    :type="child.type"
                    :remark="entity.remark"
                    :map="child.map" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import { FORM_COL_MAP } from '@/utils/constant';
export default {
  name: 'MFormEdit',
  props: {
    disabled: { type: Boolean, default: false },
    entity: { type: Object, default: null },
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    cols() {
      return FORM_COL_MAP;
    },
    activeName() {
      return this.items.map(item => item.title);
    }
  }
};
</script>
