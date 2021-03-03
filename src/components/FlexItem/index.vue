<template>
  <div :id="id" :style="flexStyle">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'FlexItem',
  props: {
    id: {
      type: String,
      default: ''
    },
    // flex-direction : 'row', 'row-reverse', 'column', 'column-reverse'
    direction: {
      type: String,
      default: ''
    },
    // flex-wrap : 'nowrap', 'wrap', 'wrap-reverse'
    wrap: {
      type: String,
      default: ''
    },
    // justify-content : 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'
    justify: {
      type: String,
      default: ''
    },
    // align-items : 'flex-start ', 'flex-end ', 'center ', 'baseline ', 'stretch'
    align: {
      type: String,
      default: ''
    }
  },
  computed: {
    flexStyle() {
      const obj = {};
      obj['display'] = 'flex';
      if (this.direction) obj['flexDirection'] = this.direction;
      if (this.wrap) obj['flexWrap'] = this.wrap;
      if (this.justify) obj['justifyContent'] = this.justify;
      if (this.align) obj['alignItems'] = this.align;
      return obj;
    }
  }
}
</script>
