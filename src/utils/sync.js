export default {
  props: {
    value: {},
    disabled: Boolean
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      if (this.disabled) return;
      if (Array.isArray(val) && val.length === 0 && !this.syncEmitArray) {
        this.currentValue = undefined;
        return;
      }
      this.$emit('input', val);
      this.$emit('change', val, this.currentText);
    }
  }
};
