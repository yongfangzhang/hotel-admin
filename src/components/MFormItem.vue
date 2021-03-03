<template>
  <el-form-item v-if="exist && entity"
                :label="item.label"
                :label-width="labelWidth"
                :prop="item.prop || item.key"
                :class="customClass"
                class="m-form-item">
    <template v-if="item.hint" #label>
      <m-edit-hint :title="item.label" :desc="item.hint" />
    </template>
    <slot name="before" />
    <slot v-if="item.slot"
          :name="item.key" />
    <m-edit v-else
            v-model="entity[item.key]"
            :disabled="!item.alwaysEnable && disabled"
            :type="item.type"
            :placeholder="item.placeholder"
            :remark="entity.remark"
            :kmap="item.kmap"
            :map="item.map"
            :list="item.list"
            :multiple="item.multiple"
            :on-preview="onPreview"
            :extral="item.extral"
            :is-view="item.isView != undefined ? item.isView : isView "/>
    <slot name="after" />
  </el-form-item>
</template>
<script>
export default {
  name: 'MFormItem',
  props: {
    exist: {
      type: Boolean,
      default: true
    },
    isView: {
      type: Boolean,
      default: false
    },
    entity: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default() {
        return {
          prop: null,
          key: null,
          label: null,
          slot: null,
          type: null,
          map: null,
          extral: null,
          className: null,
          placeholder: null,
          multiple: false
        };
      }
    },
    onPreview: {
      type: Function,
      default() {
        return null
      }
    },
    customClass: { type: Array, default() { return [] } }
  }
};
</script>
