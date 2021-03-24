<template>
  <div class="h-100 py-3 d-flex flex-column">
    <simple-table ref="table"
                  :module="mParam.module"
                  :queries="queries"
                  :before-fetch="beforeFetch"
                  class="px-3 flex-fill">
      <div slot="header"
           class="d-flex justify-content-between">
        <el-form label-position="left"
                 inline
                 @submit.native.prevent>
          <div>
            <el-form-item label="接单人">
              <m-selector v-model="queries.operatorUuid"
                          :map="operatorMap"
                          filterable
                          clearable
                          @keydown.enter.native="doFilter"
                          @change="doFilter"
                          @clear="doFilter" />
            </el-form-item>
            <el-form-item label="公寓">
              <el-input v-model="queries.name"
                        placeholder="请输入"
                        clearable
                        @clear="doFilter"
                        @keydown.enter.native="doFilter" />
            </el-form-item>
            <datetime-filter v-model="createdRange"
                             @change="doFilter" />
          </div>
        </el-form>
        <div class="text-nowrap">
          <query-button type="query"
                        @click="doFilter" />
          <query-button type="reset"
                        @click="resetFilter" />
          <el-button type="primary"
                     plain
                     @click="printReport">打印</el-button>
        </div>
      </div>
      <template slot="columns">
        <el-table-column label="公寓"
                         align="center"
                         prop="name"
                         :min-width="colWidth.nm" />
      </template>
    </simple-table>
  </div>
</template>
<script>
import { MODULE } from '@/store/constant';
import { reportMixins } from './mixins';
import { baseTableMixin } from '@/utils/mixins';
export default {
  name: 'ApartmentReport',
  mixins: [reportMixins, baseTableMixin],
  data() {
    return {
      showMoreFilter: false,
      createdRange: [],
      queries: {
        operatorUuid: null,
        report: true,
        name: null,
        createdAtStart: null,
        createdAtStop: null
      }
    };
  },
  computed: {
    mParam() {
      return {
        paramMode: true,
        module: MODULE.APARTMENT,
        primaryKey: 'uuid'
      };
    }
  },
  methods: {
    beforeFetch() {
      this.queries.createdAtStart = this.createdRange[0];
      this.queries.createdAtStop = this.createdRange[1];
    },
    printReport() {}
  }
};
</script>
