<template>
  <el-row class="mx-0">
    <el-col :span="8"
            class="pl-0 pr-1">
      <m-selector v-model="provinceCode"
                  :disabled="disabled"
                  :list="provinceList"
                  :kmap="kmap"
                  filterable />
    </el-col>
    <el-col :span="8"
            class="px-1">
      <m-selector v-model="cityCode"
                  :disabled="disabled"
                  :list="cityList"
                  :kmap="kmap"
                  filterable />
    </el-col>
    <el-col :span="8"
            class="pr-0 pl-1">
      <m-selector v-model="currentValue"
                  :disabled="disabled"
                  :list="areaList"
                  :kmap="kmap"
                  filterable />
    </el-col>
  </el-row>
</template>
<script>
import { addressMixin } from '@/utils/mixins';
export default {
  name: 'MAddressForm',
  mixins: [addressMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    kmap() {
      return { label: 'name', value: 'code', nfmtValue: true };
    }
  }
};
</script>
