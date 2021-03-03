<template>
  <div><slot /></div>
</template>

<script>
import sync from '@/utils/sync';
import select from '@/utils/select';

export default {
  name: 'MCommonSelect',
  mixins: [sync, select]
}
</script>
