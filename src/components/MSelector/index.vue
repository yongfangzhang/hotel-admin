<template>
  <el-select v-model="currentValue"
             :placeholder="placeholder"
             :disabled="disabled"
             :clearable="clearable"
             :filterable="filterable"
             :multiple="multiple"
             :class="{'w-100': !width}"
             :style="{width: width}"
             :remote="remote"
             :remote-method="remoteMethod"
             :allow-create="allowCreate"
             @change="$emit('change')">
    <el-option v-if="nullable"
               label="请选择"
               :value="nullableValue" />
    <template v-if="map!=null">
      <el-option v-for="(label, v) in map"
                 :key="v"
                 :label="label"
                 :disabled="getDisabled(v)"
                 :value="isNaN(+v)?v:+v" />
    </template>
    <template v-else-if="list!=null">
      <el-option v-for="item in list"
                 :key="getValueByKmap(item)"
                 :label="getLabelByKmap(item)"
                 :disabled="getDisabled(getValueByKmap(item))"
                 :value="getOptionValue(item)" />
    </template>
  </el-select>
</template>
<script>
import sync from '@/utils/sync';

export default {
  name: 'MSelector',
  mixins: [sync],
  props: {
    width: { type: String, default: null },
    map: { type: Object, default: null },
    list: { type: Array, default: null },
    kmap: { type: Object, default: null },
    filterable: { type: Boolean, default: true },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    disabledFunction: { type: Function, default: null },
    nullable: { type: Boolean, default: false },
    nullableValue: { type: [String, Object, Number], default: 0 },
    clearable: { type: Boolean, default: true },
    remote: { type: Boolean, default: false },
    remoteMethod: { type: Function, default: null },
    allowCreate: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' }
  },
  methods: {
    getDisabled(v) {
      if (this.disabled) return true; // 优先父级disabled
      if (this.disabledFunction) return this.disabledFunction(v);
      return false;
    },
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
