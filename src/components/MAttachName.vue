<template>
  <div>
    <div v-for="file in fileList"
         :key="file.uuid">
      <a :href="file.url"
         :download="file.url"
         class="text-primary"
         target="_blank">
        {{ file.name }}
      </a>
    </div>
  </div>
</template>
<script>
import { resourceMixin } from '@/utils/mixins';
export default {
  name: 'MAttachName',
  mixins: [resourceMixin]
};
</script>
