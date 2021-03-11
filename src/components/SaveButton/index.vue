<template>
  <div class="text-right p-3 border-top">
    <slot name="before" />
    <el-button type="primary"
               @click="$emit('save')">
      {{ caption }}
    </el-button>
    <slot name="after" />
  </div>
</template>
<script>
export default {
  name: 'SaveButton',
  props: {
    caption: { type: String, default: '保存' }
  }
};
</script>
