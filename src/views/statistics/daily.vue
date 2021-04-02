<template>
  <calendar @change="selectedDateChanged">每日统计</calendar>
</template>
<script>
export default {
  name: 'StatisticsDaily',
  methods: {
    selectedDateChanged(date) {
      console.log(date);
    }
  }
};
</script>
