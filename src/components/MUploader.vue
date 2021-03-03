<template>
  <el-upload ref="upload"
             :multiple="item.multiple"
             :action="finalUploadUrl"
             :disabled="disabled"
             :headers="requestHeaders"
             :on-preview="previewClick"
             :on-success="uploadSuccess"
             :on-remove="removeHandler"
             :on-error="errorHandler"
             :on-change="changeHandler"
             :on-progress="progressHandler"
             :before-remove="beforeRemove"
             :before-upload="beforeUpload"
             :show-file-list="item.showList"
             :file-list="fileList"
             :list-type="item.listType"
             :auto-upload="true"
             :accept="item.accept"
             class="d-inline-block">
    <div v-if="item.tip" slot="tip">{{ item.tip }}</div>
    <el-image v-if="limitOneSrc && !item.showList && item.type === 'media'"
              :src="limitOneSrc"
              :preview-src-list="previewList"
              class="avatar" />
    <div v-show="item.type === 'document'">
      <a v-if="limitOneSrc && disabled"
         :href="limitOneSrc"
         target="_blank"
         :download="limitOneSrc">
        {{ fileNames[0] }}
      </a>
      <span v-else
            class="text-link">{{ fileNames[0] }}</span>
    </div>
    <el-button v-if="btnVisible" type="primary" :disabled="disabled">点击上传</el-button>
  </el-upload>
</template>
<script>
import { resourceMixin } from '@/utils/mixins';
import logger from '../utils/logger';
export default {
  name: 'MUploader',
  mixins: [resourceMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default() {
        return {
          multiple: false,
          limit: 1,
          resourceType: 1,
          listType: 'picture',
          showList: true,
          accept: 'image/*',
          type: 'media'
        }
      }
    },
    previewClick: {
      type: Function,
      default() {
        return null
      }
    },
    errorHandler: {
      type: Function,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      uploading: false
    }
  },
  computed: {
    finalUploadUrl() {
      if (!this.item.resourceType) return this.uploadUrl;
      return `${this.uploadUrl}?type=${this.item.resourceType}`;
    },
    btnVisible() {
      if (this.item.limit === 1) {
        if (this.uploading || this.limitOneSrc) {
          return false
        }
        return true;
      }
      return true;
    },
    previewList() {
      if (this.disabled) {
        return [this.limitOneSrc];
      }
      return [];
    }
  },
  watch: {
    currentValue(n) {
      if (!n) {
        this.fileList = []
      }
    }
  },
  methods: {
    uploadSuccess(ret) {
      const response = ret.data;
      logger.info('上传资源响应', ret);
      this.fileList = this.resourceFiles2ElList([response]);
      this.currentValue = response.uuid;
      this.clearFiles();
    },
    clearFiles() {
      if (this.item.limit === 1 && !this.item.showList) {
        this.$nextTick(() => {
          this.$refs['upload'].clearFiles();
        });
      }
    },
    changeHandler() {
      // 文件状态改变，成功或失败
      this.uploading = false;
    },
    removeHandler(file) {
      // 文件列表移除文件时的钩子
      this.$emit('remove', file);
      let index = -1;
      this.fileList.forEach((item, idx) => {
        if (item.uuid === file.uuid) {
          index = idx;
        }
      });
      this.fileList.splice(index, 1);
      this.currentValue = '';
      // limit 1 清空list
      // if (this.item.limit === 1) {
      //   this.$refs['upload'].clearFiles();
      // }
      this.uploading = false;
    },
    progressHandler(evt, file) {
      // 文件上传时的钩子
      this.$emit('progress', file)
    },
    beforeUpload(file) {
      // 文件上传前的钩子
      this.uploading = true;
      logger.info('文件上传前的钩子', file)
    },
    beforeRemove(file) {
      logger.info('移除文件前的钩子', file)
    }
  }
};
</script>
<style scoped>
  .avatar {
    width: 200px;
    max-height: 400px;
    overflow: hidden;
    max-width: 100%;
  }
</style>
