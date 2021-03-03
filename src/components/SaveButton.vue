<template>
  <div class="text-right p-2 px-3 border-top">
    <el-button type="primary"
               @click="$emit('save')">
      {{ caption }}
    </el-button>
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
