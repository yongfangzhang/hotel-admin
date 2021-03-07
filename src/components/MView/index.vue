<template>
  <div v-if="isStringEmpty(value)">{{ emptyText }}</div>
  <div v-else-if="type === 'text'">{{ formatText(value) }}<span v-if="unit">{{ unit }}</span></div>
  <div v-else-if="type === 'boolean'">{{ value? '是': '否' }}</div>
  <div v-else-if="type === 'sex'">{{ value === 1? '男': '女' }}</div>
  <div v-else-if="type === 'selector'">{{ map ? map[value] : emptyText }}</div>
  <m-remark v-else-if="type === 'remark'"
            is-view
            :remark="value" />
  <div v-else-if="type === 'url'">
    <a class="text-primary"
       :href="value"
       target="_blank">{{ value }}</a>
  </div>
  <div v-else-if="type === 'email'">
    <a class="text-primary"
       :href="'mailto:'+value">{{ value }}</a>
  </div>
  <div v-else-if="type === 'tel'">
    <a class="text-primary"
       :href="'tel:'+value">{{ value }}</a>
  </div>
  <div v-else-if="type === 'date'">
    {{ formatDate(value) }}
  </div>
  <div v-else-if="type === 'datetime'">
    {{ formatDateTime(value) }}
  </div>
  <div v-else-if="type === 'resource'">
    <m-previewer :uuids="value" />
  </div>
  <div v-else-if="type === 'address'">
    <m-address-view :value="value" />
  </div>
  <div v-else-if="type === 'textarea'">
    {{ value }}
  </div>
  <div v-else-if="type === 'number'">
    {{ value }}
  </div>
  <div v-else-if="type === 'currency'">
    <el-button type="text">{{ formatAmount(value) }}</el-button>
  </div>
  <div v-else>{{ emptyText }}</div>
</template>
<script>
import { EMPTY_TEXT } from '@/utils/constant';
export default {
  name: 'MView',
  props: {
    value: {
      type: [Object, Array, String, Boolean, Number],
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    map: {
      type: Object,
      default() {
        return {};
      }
    },
    unit: {
      type: String,
      default: null
    }
  },
  computed: {
    emptyText() {
      return EMPTY_TEXT;
    }
  }
};
</script>
