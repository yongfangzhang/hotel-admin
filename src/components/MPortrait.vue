<template>
  <el-image v-if="fileList.length && fileList[0].fileType===RES_FILE_TYPE.IMAGE"
            :src="fileList[0].url"
            :fit="fit">
    <div slot="error"
         class="image-slot">
      <i class="el-icon-picture-outline" />
    </div>
  </el-image>
</template>
<script>
import { resourceMixin } from '@/utils/mixins';
export default {
  name: 'MPortrait',
  mixins: [resourceMixin],
  props: {
    fit: { type: String, default: 'cover' }
  }
};
</script>
