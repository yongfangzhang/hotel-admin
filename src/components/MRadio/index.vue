<template>
  <el-radio-group v-model="currentValue"
                  :disabled="disabled"
                  :style="{width: width}"
                  :class="{'w-100': !width}">
    <el-radio v-for="(label, value) in map"
              :key="value"
              :label="value">{{ label }}</el-radio>
  </el-radio-group>
</template>
<script>
import sync from '@/utils/sync';
export default {
  name: 'MRadio',
  mixins: [sync],
  props: {
    width: { type: String, default: null },
    map: { type: Object, default: null },
    list: { type: Array, default: null },
    kmap: { type: Object, default: null }
  },
  methods: {
    getByKey(item, key) {
      let v = item;
      key.split('.').forEach((k) => {
        v = v[k];
      });
      return v;
    },
    getLabelByKmap(item) {
      return this.getByKey(item, this.kmap.label);
    },
    getValueByKmap(item) {
      return this.getByKey(item, this.kmap.value);
    },
    getOptionValue(item) {
      const v = this.getValueByKmap(item);
      return this.kmap.nfmtValue || isNaN(+v) ? v : +v;
    }
  }
};
</script>
