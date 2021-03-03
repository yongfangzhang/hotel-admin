<template>
  <el-form-item :label="label">
    <el-checkbox-group v-model="currentValue"
                       :max="max"
                       @change="$emit('change',$event)">
      <el-checkbox v-for="(theme, state) in themeMap"
                   :key="state"
                   :label="+state">
        <span :class="'text-' + theme"> {{ map[state] }} </span>
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>
<script>
import sync from '@/utils/sync';
export default {
  name: 'StateFilter',
  mixins: [sync],
  props: {
    label: {
      type: String,
      default: '状态'
    },
    max: {
      type: Number,
      default: 1
    },
    themeMap: {
      type: Object,
      default() {
        return this.PUBLISH_STATE_THEME_MAP;
      }
    },
    map: {
      type: Object,
      default() {
        return this.PUBLISH_STATE_MAP;
      }
    }
  },
  data() {
    return {
      syncEmitArray: true
    };
  }
};
</script>
