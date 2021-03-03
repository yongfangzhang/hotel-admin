<template>
  <el-col :xs="xs"
          :sm="sm">
    <el-form-item :label="label"
                  :prop="propName">
      <m-edit v-model="currentValue"
              :disabled="disabled"
              :type="type"
              :remark="remark"
              :map="map"
              :remote="remote"
              :remote-method="remoteMethod" />
    </el-form-item>
  </el-col>
</template>
<script>
import sync from '@/utils/sync';
export default {
  name: 'ColFormItem',
  mixins: [sync],
  props: {
    xs: { type: Number, default: 24 },
    sm: { type: Number, default: 12 },
    label: { type: String, default: '' },
    propName: { type: String, default: '' },
    type: { type: String, default: 'text' },
    disabled: { type: Boolean, default: false },
    remote: { type: Boolean, default: false },
    remoteMethod: { type: Function, default: null },
    remark: { type: Array, default: null },
    map: { type: Object, default: null }
  }
};
</script>
