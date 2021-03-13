<template>
  <div v-if="type === 'text'">
    <span v-if="isView"
          v-text="currentValue ? currentValue + (extral && extral.append ? extral.append : '') : '--'" />
    <el-input v-else
              v-model="currentValue"
              v-bind="originProps"
              :disabled="disabled"
              clearable
              :placeholder="placeholder"
              @keyup.native.enter="onEnter">
      <template v-if="extral && extral.append"
                slot="append">{{ extral.append }}</template>
    </el-input>
  </div>
  <div v-else-if="type === 'number'">
    <span v-if="isView"
          v-text="currentValue ? currentValue + (extral && extral.append ? extral.append : '') : '--'" />
    <el-input v-else
              v-model="currentValue"
              type="number"
              :disabled="disabled"
              :placeholder="placeholder"
              @keyup.native.enter="onEnter">
      <template v-if="extral && extral.append"
                slot="append">{{ extral.append }}</template>
    </el-input>
  </div>
  <div v-else-if="type === 'textarea'">
    <span v-if="isView"
          v-text="currentValue || '--'" />
    <el-input v-else
              v-model="currentValue"
              type="textarea"
              :rows="extral.rows || 3"
              :placeholder="placeholder"
              :disabled="disabled"
              @keyup.native.enter="onEnter" />
  </div>
  <div v-else-if="type == 'date' || type == 'datetime' || type === 'datetimerange' || type === 'daterange'">
    <span v-if="isView"
          v-text="currentValue || '--'" />
    <el-date-picker v-else
                    v-model="currentValue"
                    class="w-100"
                    :type="type"
                    :value-format="valueFormat"
                    :disabled="disabled"
                    :placeholder="placeholder" />
  </div>
  <div v-else-if="type === 'selector'">
    <span v-if="isView"
          v-text="map[currentValue] || '--'" />
    <m-selector v-else
                v-model="currentValue"
                :disabled="disabled"
                :map="map"
                :placeholder="placeholder"
                :remote="remote"
                :list="list"
                :kmap="kmap"
                :multiple="multiple"
                :filterable="extral.filterable"
                :remote-method="remoteMethod"
                :allow-create="allowCreate"
                :disabled-function="extral.disabledFunction" />
  </div>
  <div v-else-if="type === 'radio'">
    <span v-if="isView"
          v-text="map[currentValue] || '--'" />
    <m-radio v-else
             v-model="currentValue"
             :disabled="disabled"
             :map="map"
             :list="list"
             :kmap="kmap" />
  </div>
  <div v-else-if="type === 'boolean'">
    <span v-if="isView"
          v-text="currentValue ? '是' : '否'" />
    <el-checkbox v-else
                 v-model="currentValue"
                 :disabled="disabled" />
  </div>
  <el-switch v-else-if="type === 'switch'"
             v-model="currentValue"
             :disabled="disabled"
             :active-text="extral.activeText"
             :inactive-text="extral.inactiveText"
             :active-value="extral.activeValue"
             :inactive-value="extral.inactiveValue" />
  <m-address-form v-else-if="type === 'address'"
                  v-model="currentValue"
                  :disabled="disabled" />
  <m-uploader v-else-if="type === 'resource'"
              v-model="currentValue"
              :item="extral"
              :uuids="extral.uuids"
              :preview-click="onPreview"
              :disabled="disabled" />
  <m-remark v-else-if="type === 'remark'"
            v-model="currentValue"
            :disabled="disabled"
            :class-name="className"
            :remark="remark" />
  <div v-else />
</template>
<script>
import sync from '@/utils/sync';
export default {
  name: 'MEdit',
  mixins: [sync],
  props: {
    originProps: { type: Object, default: null },
    type: {
      type: String,
      default: 'text'
    },
    isView: { type: Boolean, default: false },
    remark: { type: Array, default: null },
    map: { type: Object, default: null },
    list: { type: Array, default: null },
    kmap: { type: Object, default: null },
    extral: {
      type: Object,
      default() {
        return {};
      }
    },
    className: { type: String, default: '' },
    remote: { type: Boolean, default: false },
    remoteMethod: { type: Function, default: null },
    allowCreate: { type: Boolean, default: false },
    placeholder: {
      type: String,
      // default: '请输入'
      default() {
        if (this.type && this.type === 'date') {
          return '选择日期';
        }
        if (this.type && this.type === 'selector') {
          return '请选择';
        }
        return '请输入';
      }
    },
    uuids: {
      type: [Array, String],
      default: null
    },
    onPreview: {
      type: Function,
      default() {
        return null;
      }
    },
    multiple: { type: Boolean, default: false }
  },
  computed: {
    valueFormat() {
      if (this.type === 'datetime') {
        return 'yyyy-MM-dd HH:mm:ss';
      } else {
        return 'yyyy-MM-dd';
      }
    }
  },
  methods: {
    onEnter(evt) {
      this.extral.enter && this.extral.enter(evt);
    }
  }
};
</script>
