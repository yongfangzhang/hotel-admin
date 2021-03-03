<template>
  <div class="d-flex flex-column">
    <el-table v-loading="listLoading"
              :data="pageData.list"
              border
              height="1"
              fit
              highlight-current-row
              :empty-text="emptyText"
              class="flex-fill">
      <el-table-column v-if="sequenced"
                       label="序号"
                       align="center"
                       :width="colWidth.xxs">
        <template slot-scope="{ $index }">
          <span>{{ toFullIndex($index, pageData) }}</span>
        </template>
      </el-table-column>
      <slot name="columns" />
    </el-table>
    <div class="text-right">
      <pagination v-show="pageData.totalCount>0"
                  :total="pageData.totalCount"
                  :page.sync="pageData.currPage"
                  :limit.sync="pageData.pageSize"
                  :hide-on-single-page="false"
                  class="px-3 pb-0 pt-3 mt-0"
                  @pagination="fetchPageData()" />
    </div>
  </div>
</template>
<script>
import { defaultPageData } from '@/utils/constant';
import { ACTIONS } from '@/store/constant';
import { objectMerge } from '@/utils/index';

export default {
  name: 'SimpleTable',
  props: {
    emptyText: { type: String, default: '没有记录' },
    queries: { type: Object, default: null },
    module: { type: String, default: '' },
    action: { type: String, default: ACTIONS.FETCH_PAGE_DATA },
    sequenced: { type: Boolean, default: true }
  },
  data() {
    return {
      listLoading: true,
      pageData: defaultPageData()
    };
  },
  mounted() {
    this.fetchPageData();
  },
  activated() {
    this.fetchPageData();
  },
  methods: {
    fetchPageData(params = {}) {
      this.listLoading = true;
      const queries = this.queries || {};
      this.doAction(
        this.module,
        this.action,
        objectMerge(
          {
            limit: this.pageData.pageSize,
            page: this.pageData.currPage,
            ...queries
          },
          params
        )
      ).then((d) => {
        this.pageData = d;
        this.listLoading = false;
      });
    }
  }
};
</script>
