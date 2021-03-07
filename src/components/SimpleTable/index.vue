<template>
  <div class="d-flex flex-column justify-content-between simple-table-container"
       :class="{ 'h-100': autoFill }">
    <slot name="header" />
    <el-table v-show="visible"
              :id="id"
              :ref="tableName"
              :data="pageData.list"
              :height="height"
              fit
              :highlight-current-row="highlightCurrentRow"
              :header-cell-class-name="headerClass"
              :cell-class-name="cellClass"
              :header-row-class-name="headerRowClass"
              :row-class-name="rowClassName"
              :empty-text="emptyText"
              :stripe="stripe"
              :border="border"
              :show-summary="showSummary"
              :summary-method="summaryMethod"
              :span-method="spanMethod"
              :row-key="rowKey"
              :expand-row-keys="expandRowKeys"
              class="flex-fill border"
              style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
              @sort-change="handleSortChange"
              @current-change="handleCurrentChange"
              @selection-change="handleSelectionChange">
      <slot name="expand" />
      <el-table-column v-if="sequenced"
                       label="序号"
                       :resizable="false"
                       :fixed="sequencedFixed"
                       align="center"
                       :min-width="colWidth.xxs">
        <template slot-scope="{ row, $index }">
          <span>{{ toFullIndex($index, pageData, row) }}</span>
        </template>
      </el-table-column>
      <slot name="columns" />
    </el-table>
    <slot name="footer" />
    <div v-show="visible"
         :class="paginationAlign"
         class="py-3"
         style="display: flex; justify-content: space-between; align-items: center;">
      <slot name="pagination-left" />
      <pagination v-show="pageData.totalCount > 0"
                  :total="pageData.totalCount"
                  :page.sync="pageData.currPage"
                  :limit.sync="pageData.pageSize"
                  :hide-on-single-page="false"
                  class="p-0 mt-0 flex-fill"
                  @pagination="fetchPageData" />
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
    id: { type: String, default: '' },
    emptyText: { type: String, default: '没有记录' },
    sequencedFixed: { type: String, default: null },
    queries: { type: Object, default: null },
    module: { type: String, default: '' },
    action: { type: String, default: ACTIONS.FETCH_PAGE_DATA },
    sequenced: { type: Boolean, default: true },
    auto: { type: Boolean, default: true },
    height: { type: [Number, String], default: 1 },
    autoFill: { type: Boolean, default: false },
    rowKey: { type: String, default: '' },
    expandRowKeys: { type: Array, default: null },
    highlightCurrentRow: { type: Boolean, default: true },
    headerClass: {
      type: Function,
      default() {
        return 'simple-table-header';
      }
    },
    cellClass: {
      type: Function,
      default() {
        return '';
      }
    },
    tableName: {
      type: String,
      default: 'table'
    },
    headerRowClass: {
      type: Function,
      default() {
        return '';
      }
    },
    rowClassName: {
      type: Function,
      default() {
        return '';
      }
    },
    tableHeight: {
      type: Number,
      default: 1
    },
    paginationAlign: {
      type: String,
      default: 'text-right'
    },
    beforeFetch: {
      type: Function,
      default: null
    },
    afterFetch: {
      type: Function,
      default: null
    },
    stripe: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: true
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryMethod: {
      type: Function,
      default: null
    },
    spanMethod: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      listLoading: true,
      pageData: defaultPageData()
    };
  },
  mounted() {
    if (!this.auto) return;
    this.fetchPageData();
  },
  activated() {
    if (!this.auto) return;
    this.refresh();
  },
  methods: {
    refresh() {
      this.fetchPageData({
        page: this.pageData.currPage
      });
    },
    doLayout() {
      this.$refs[this.tableName].doLayout();
    },
    toggleRowExpansion(row, closeOther) {
      if (closeOther) {
        this.pageData.list.forEach((data) => {
          this.$refs[this.tableName].toggleRowExpansion(data, false);
        });
      }
      this.$refs[this.tableName].toggleRowExpansion(row);
    },
    fetchPageData(params, doFilter) {
      if (this.beforeFetch) {
        this.beforeFetch();
      }
      if (doFilter) {
        this.pageData.currPage = 1;
      }
      if (!params) {
        params = {};
      }
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
        if (this.afterFetch) {
          this.pageData = this.afterFetch(d);
        } else {
          this.pageData = d;
        }
        this.$emit('total', d.totalCount);
        this.$emit('data', d);
        this.listLoading = false;
      });
    },
    handleCurrentChange(row) {
      this.$emit('current-change', row);
    },
    handleSelectionChange(val) {
      this.$emit('selection-change', val);
    },
    handleSortChange(val) {
      this.$emit('sort-change', val);
    },
    getDataList() {
      return this.pageData.list;
    }
  }
};
</script>
<style lang="scss">
.no-flex {
  flex: none !important;
}
</style>
