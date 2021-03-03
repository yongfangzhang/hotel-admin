<template>
  <div class="app-title border-bottom">
    <h3>{{ title || routeTitle }}</h3>
    <div v-if="btns || back || closeTag">
      <el-button v-for="(btn,index) in btns"
                 :key="index"
                 class="ml-3"
                 @click="btnAction(btn)"> {{ btn.title }} </el-button>
      <el-button v-if="back"
                 class="ml-3"
                 @click="$router.back()">返回</el-button>
      <el-button v-if="closeTag"
                 class="ml-3"
                 @click="close">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { eventBiz, EVENT } from '@/store/constant';
export default {
  name: 'PageTitle',
  props: {
    back: {
      type: Boolean,
      default: false
    },
    btns: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    closeTag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      routeTitle: this.$route.meta.title
    };
  },
  methods: {
    btnAction(btn) {
      if (btn.back) return this.$router.back();
      if (btn.to) {
        this.$router.push({
          path: btn.to,
          query: btn.query
        });
      }
      if (btn.action) btn.action();
    },
    close() {
      eventBiz.$emit(EVENT.CLOSE_SELECTED_TAG);
    }
  }
};
</script>
