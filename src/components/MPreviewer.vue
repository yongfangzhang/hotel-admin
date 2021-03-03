<template>
  <div>
    <div v-for="file in fileList"
         :key="file.uuid">
      <el-image v-if="file.fileType===RES_FILE_TYPE.IMAGE"
                :src="file.url"
                :fit="fit"
                :preview-src-list="srcList">
        <div slot="error"
             class="image-slot">
          <i class="el-icon-picture-outline" />
        </div>
      </el-image>
      <div v-else>！！！！！！！！！！请实现我！！！！！！！！！！！！</div>
    </div>
  </div>
</template>
<script>
import { resourceMixin } from '@/utils/mixins';
export default {
  name: 'MPreviewer',
  mixins: [resourceMixin],
  props: {
    fit: { type: String, default: 'cover' }
  }
};
</script>
