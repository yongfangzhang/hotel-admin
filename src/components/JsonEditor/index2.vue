<template>
  <vue-json-editor ref="editor"
                   v-model="currentValue"
                   :show-btns="false"
                   :mode="currentMode"
                   class="cus-json-editor"
                   :class="{ noborder }" />
</template>

<script>
import VueJsonEditor from 'vue-json-editor';
import sync from '@/utils/sync';
export default {
  name: 'JsonEditor',
  components: {
    VueJsonEditor
  },
  mixins: [sync],
  props: {
    mode: { type: String, default: 'code' },
    disabled: { type: Boolean, default: false },
    noborder: { type: Boolean, default: false }
  },
  computed: {
    currentMode() {
      if (this.disabled) return 'view';
      return this.mode;
    }
  },
  watch: {
    disabled(v) {
      this.$refs.editor.editor.setMode(v ? 'view' : this.mode);
    }
  }
};
</script>
<style lang="scss">
.cus-json-editor {
  &.noborder {
    .jsoneditor {
      border: none;
    }
  }
  .jsoneditor {
    border: 1px solid #eee;
  }
  .jsoneditor-menu {
    display: none;
  }
}
</style>
