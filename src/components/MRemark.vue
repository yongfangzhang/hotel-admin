<template>
  <div :class="[className]">
    <template v-if="remark!=null">
      <div v-for="(r,idx) in remark"
           :key="idx">
        <div>【{{ r.createdAt }}】: {{ r.content }} </div>
      </div>
    </template>
    <div v-if="isView && (remark==null || !remark.length)"> {{ emptyText }} </div>
    <el-input v-if="!isView"
              v-model="currentValue"
              :disabled="disabled"
              type="textarea"
              rows="3"
              placeholder="请输入备注" />
  </div>
</template>
<script>
import sync from '@/utils/sync';
import { EMPTY_TEXT } from '@/utils/constant';

export default {
  name: 'MRemark',
  mixins: [sync],
  props: {
    remark: { type: Array, default: null },
    isView: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    className: { type: String, default: '' }
  },
  computed: {
    emptyText() {
      return EMPTY_TEXT;
    }
  }
};
</script>
