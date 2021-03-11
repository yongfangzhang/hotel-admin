<template>
  <el-dialog :title="title"
             :top="top"
             :visible.sync="currentValue"
             :width="dialogWidth[width]"
             :custom-class="dialogClass"
             :close-on-click-modal="closeOnClickModal"
             :close-on-press-escape="closeOnPressEscape"
             :append-to-body="appendToBody"
             :destroy-on-close="destroyOnClose"
             :show-close="showClose"
             @open="open"
             @close="onClose">
    <slot />
    <span v-if="hasClose || hasConfirm"
          slot="footer"
          class="dialog-footer w-100">
      <slot name="footer-left" />
      <el-button v-if="hasClose"
                 @click="close"> {{ closeText }} </el-button>
      <el-button v-if="hasConfirm"
                 type="primary"
                 :disabled="confirmDisabled"
                 @click="confirm"> {{ confirmText }} </el-button>
    </span>
  </el-dialog>
</template>
<script>
import sync from '@/utils/sync';
import { EMPTY_TEXT } from '@/utils/constant';
export default {
  name: 'MDialog',
  mixins: [sync],
  props: {
    top: { type: String, default: '15vh' },
    destroyOnClose: { type: Boolean, default: false },
    appendToBody: { type: Boolean, default: false },
    closeOnClickModal: { type: Boolean, default: true },
    closeOnPressEscape: { type: Boolean, default: true },
    dialogClass: { type: String, default: '' },
    title: { type: String, default: EMPTY_TEXT },
    width: { type: String, default: 'sm' },
    hasConfirm: { type: Boolean, default: true },
    confirmText: { type: String, default: '确定' },
    hasClose: { type: Boolean, default: true },
    closeText: { type: String, default: '关闭' },
    showClose: { type: Boolean, default: true }, // 右上角close按钮
    closeOnConfirm: { type: Boolean, default: false },
    confirmDisabled: { type: Boolean, default: false }
  },
  methods: {
    close() {
      this.currentValue = false;
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm');
      if (this.closeOnConfirm) {
        this.currentValue = false;
      }
    },
    open() {
      this.$emit('open');
    },
    onClose() {
      this.$emit('on-close');
    }
  }
};
</script>
