<template>
  <el-form-item :label="label">
    <el-date-picker v-model="currentValue"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="起始时间"
                    end-placeholder="结束时间"
                    :style="{width: width}"
                    @change="$emit('change',$event)" />
  </el-form-item>
</template>
<script>
import sync from '@/utils/sync';
export default {
  name: 'DatetimeFilter',
  mixins: [sync],
  props: {
    width: { type: String, default: null },
    label: {
      type: String,
      default: '创建时间'
    }
  }
};
</script>
