<template>
  <el-upload ref="uploader"
             v-bind="uploadProps"
             :on-change="onFileChange">
    <el-button type="primary"
               :loading="loading">上传</el-button>
  </el-upload>
</template>
<script>
import XLSX from 'xlsx';
import { objectMerge } from '@/utils/index';
export default {
  name: 'LocalUpload',
  props: {
    publicProps: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    uploadProps() {
      return objectMerge(
        {
          action: '',
          autoUpload: false,
          limit: 1,
          showFileList: false
        },
        this.publicProps
      );
    }
  },
  methods: {
    clearFiles() {
      this.loading = false;
      this.$refs.uploader.clearFiles();
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name);
    },
    onFileChange(file) {
      if (this.isExcel(file)) {
        this.readExcelFile(file.raw);
      } else {
        this.readTxtFile(file.raw);
      }
    },
    readExcelFile(rawFile) {
      this.loading = true;
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const results = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.$emit('change', results);
        this.clearFiles();
      };
      reader.onerror = () => {
        this.clearFiles();
      };
      reader.onabort = () => {
        this.clearFiles();
      };
      reader.readAsArrayBuffer(rawFile);
    },
    readTxtFile(rawFile) {
      this.loading = true;
      const reader = new FileReader();
      reader.onload = (e, rs) => {
        this.$emit('change', e.target.result);
        this.clearFiles();
      };
      reader.onerror = () => {
        this.clearFiles();
      };
      reader.onabort = () => {
        this.clearFiles();
      };
      reader.readAsText(rawFile);
    }
  }
};
</script>
