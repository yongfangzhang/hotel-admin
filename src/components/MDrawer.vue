<template>
  <el-drawer ref="drawer"
             :visible.sync="currentValue"
             :append-to-body="appendToBody"
             :destroy-on-close="destroyOnClose"
             :with-header="withHeader"
             :custom-class="customClass"
             :direction="direction"
             :size="curSize"
             :title="title"
             :before-close="handleClose"
             @open="$emit('open')"
             @opened="$emit('opened')"
             @close="$emit('close')"
             @closed="$emit('closed')">
    <slot />
    <el-button v-if="isFold && expandable" type="info" class="fold-btn" icon="el-icon-d-arrow-left" @click="isFold = false" />
    <el-button v-if="!isFold && expandable" type="info" class="fold-btn" icon="el-icon-d-arrow-right" @click="isFold = true" />
  </el-drawer>
</template>
<script>
import sync from '@/utils/sync';
export default {
  name: 'MDrawer',
  mixins: [sync],
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    },
    withHeader: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    expandable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: '40%'
    },
    expandSize: {
      type: String,
      default: 'calc(100% - 210px)'
    },
    title: {
      type: String,
      default: ''
    },
    isConfirm: {
      type:Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: '信息还未提交, 是否确认关闭？'
    }
  },
  data() {
    return {
      curSize: '',
      isFold: true
    }
  },
  watch: {
    isFold(nv) {
      this.curSize = nv ? this.size : this.expandSize;
      this.$nextTick(_ => {
        this.$emit('fold', nv);
      })
    }
  },
  created() {
    this.curSize = this.size;
  },
  methods: {
    closeDrawer() {
      this.$refs.drawer.closeDrawer();
    },
    handleClose(done) {
      if(this.isConfirm) {
        this.$confirm(this.confirmText, '提示', {
        type: 'warning'
      }).then(_ => {
          done();
        }).catch(_ => {});
      }else {
        done();
      }
    }
  }
};
</script>
