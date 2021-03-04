<template>
  <el-button v-if="type == 'query'"
             icon="el-icon-search"
             :style="btnStyle"
             @click="$emit('click')">查询
  </el-button>
  <el-button v-else-if="type == 'reset'"
             icon="el-icon-refresh-right"
             :style="btnStyle"
             @click="$emit('click')">重置
  </el-button>
</template>
<script>
export default {
  name: 'QueryButton',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    btnStyle() {
      return {
        color: '#409EFF',
        border: 'none',
        padding: '7px',
        margin: '0',
        fontSize: '14px'
      }
    }
  }
}
</script>
