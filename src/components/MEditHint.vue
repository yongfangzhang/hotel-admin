<template>
  <span>
    <span v-text="title" />
    <el-tooltip v-if="visible" class="item" effect="dark" :content="desc" placement="top-start" :tabindex="-1">
      <i class="el-icon-question" />
      <div v-if="!desc" slot="content">
        <slot />
      </div>
    </el-tooltip>
  </span>
</template>
<script>
export default {
  name: 'MEditHint',
  props: {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: true
    }
  }
};
</script>
