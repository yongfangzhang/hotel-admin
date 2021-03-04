<template>
  <div class="h-100 py-3 d-flex flex-column">
    <simple-table ref="table"
                  :module="mParam.module"
                  :queries="queries"
                  class="px-3 flex-fill">
      <div slot="header"
           class="d-flex justify-content-between">
        <el-form label-position="left"
                 inline
                 @submit.native.prevent>
          <!-- <el-form-item label="操作目标">
            <m-selector v-model="queries.target"
                        :map="OPERATION_TARGET_MAP"
                        @change="doFilter" />
          </el-form-item> -->
          <el-form-item label="操作类型">
            <m-selector v-model="queries.type"
                        :map="OPERATION_MAP"
                        @change="doFilter" />
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker v-model="time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="起始时间"
                            end-placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            @change="timeOnChange" />
          </el-form-item>
        </el-form>
        <div class="text-nowrap">
          <query-button type="query"
                        @click="doFilter" />
          <query-button type="reset"
                        @click="resetFilter" />
        </div>
      </div>
      <template slot="columns">
        <el-table-column prop="accountName"
                         label="用户"
                         align="center"
                         :width="colWidth.nm" />
        <el-table-column prop="ip"
                         label="IP"
                         align="center"
                         :width="colWidth.md" />
        <el-table-column prop="target"
                         label="操作目标"
                         align="center"
                         :width="colWidth.md">
          <template slot-scope="{ row }">
            <div v-text="OPERATION_TARGET_MAP[row.target]" />
          </template>
        </el-table-column>
        <el-table-column prop="type"
                         label="操作类型"
                         align="center"
                         :width="colWidth.md">
          <template slot-scope="{ row }">
            <div v-text="OPERATION_MAP[row.type]" />
          </template>
        </el-table-column>
        <el-table-column prop="content"
                         label="操作详细"
                         header-align="center" />
        <el-table-column prop="createdAt"
                         label="操作时间"
                         align="center"
                         :width="colWidth.tm"
                         sortable />
      </template>
    </simple-table>
  </div>
</template>
<script>
import { MODULE } from '@/store/constant';
import { baseTableMixin } from '@/utils/mixins';
export default {
  name: 'SystemLog',
  mixins: [baseTableMixin],
  data() {
    return {
      queries: {
        content: '',
        target: '',
        type: '',
        createdAtStart: '',
        createdAtStop: ''
      },
      levelMap: {
        1: '1',
        2: '2',
        3: '3'
      },
      time: [],
      selectRows: []
    };
  },
  computed: {
    mParam() {
      return {
        module: MODULE.SYSTEM_LOG
      };
    }
  },
  methods: {
    resetFilter() {
      this.queries = this.$options.data().queries;
      this.time = [];
      this.$nextTick(() => this.doFilter());
    },
    timeOnChange(data) {
      this.queries.createdAtStart = data ? data[0] : '';
      this.queries.createdAtStop = data ? data[1] : '';
      this.$nextTick(() => this.doFilter());
    }
  }
};
</script>
