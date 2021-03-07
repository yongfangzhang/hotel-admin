<template>
  <iframe :src="announceUrl"
          noborder
          class="w-100 h-100 border-0" />
</template>
<script>
export default {
  name: 'AnnounceIndex',
  computed: {
    announceUrl() {
      return `${process.env.BASE_URL}announce.html`;
    }
  }
};
</script>
