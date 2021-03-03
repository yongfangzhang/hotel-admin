<template>
  <div v-if="exist" class="m-view-item">
    <span class="label"
          :style="{width: computeWidth}">{{ item.label }}</span>
    <slot v-if="item.slot"
          :name="item.key" />
    <div v-else-if="item.list"
         class="content">
      <m-view v-for="v in currentValue"
              :key="v"
              :style="{width: item.contentWidth}"
              :unit="item.unit"
              :value="v"
              :map="item.map || null"
              :type="item.type" />
    </div>
    <m-view v-else
            :style="{width: item.contentWidth}"
            class="d-inline-block content"
            :unit="item.unit"
            :map="item.map || null"
            :value="currentValue"
            :type="item.type" />
    <slot name="after" />
  </div>
</template>
<script>
export default {
  name: 'MViewItem',
  props: {
    exist: {
      type: Boolean,
      default: true
    },
    entity: {
      type: Object,
      default: null
    },
    labelWidth: {
      type: String,
      default: null
    },
    item: {
      type: Object,
      default() {
        return {
          prop: null,
          unit: null,
          key: null,
          label: null,
          slot: null,
          type: null,
          map: null,
          value: null,
          contentWidth: null,
          showValue: null,
          list: false,
          placeholder: '请输入'
        };
      }
    }
  },
  computed: {
    currentValue() {
      if (this.isEmpty(this.item.value)) return this.entity[this.item.key];
      return this.item.value;
    },
    computeWidth() {
      if (this.item.labelWidth) return this.item.labelWidth + 'rem';
      if (!this.item.label) return '4rem';
      if (this.item.label.length <= 4) {
        return '4rem';
      } else {
        return '5rem';
      }
    }
  }
};
</script>
