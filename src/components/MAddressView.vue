<template>
  <span>{{ fullAreaName }}</span>
</template>
<script>
import { addressMixin } from '@/utils/mixins';
export default {
  name: 'MAddressView',
  mixins: [addressMixin]
};
</script>
