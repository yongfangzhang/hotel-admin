<template>
  <iframe :src="dashboardUrl"
          noborder
          class="w-100 h-100 border-0" />
</template>
<script>
export default {
  name: 'Dashboard',
  computed: {
    dashboardUrl() {
      return `${process.env.BASE_URL}dashboard.html`;
    }
  }
};
</script>
