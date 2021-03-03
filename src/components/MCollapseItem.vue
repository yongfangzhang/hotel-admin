<template>
  <el-collapse-item :name="title"
                    v-bind="originProps">
    <template slot="title">
      <h3 class="px-3 m-0 border-bottom w-100"> {{ title }} </h3>
      <slot name="afterheader" />
    </template>
    <slot name="content" />
  </el-collapse-item>
</template>
<script>
export default {
  name: 'MCollapseItem',
  props: {
    originProps: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: ''
    }
  }
};
</script>
