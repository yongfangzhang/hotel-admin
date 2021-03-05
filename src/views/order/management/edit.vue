<template>
  <div v-if="viewInfo"
       class="h-100 d-flex flex-column ">
    <page-title back
                redirect-parent />
    <el-form ref="form"
             :model="viewInfo"
             :rules="formRules"
             :label-width="formLabelWidth.w6"
             label-position="left"
             class="flex-fill scrollable-y p-3">
      <el-row>
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in baseFormItems.left"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="viewInfo"
                       :disabled="item.disabled" />
        </el-col>
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in baseFormItems.right"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="viewInfo"
                       :disabled="item.disabled" />
        </el-col>
      </el-row>
    </el-form>
    <save-button @save="createOrUpdate" />
  </div>
</template>
<script>
import { MODULE } from '@/store/constant';
import { formEditMixin } from '@/utils/mixins';
export default {
  name: 'OrderManagementEdit',
  mixins: [formEditMixin],
  computed: {
    mParam() {
      return {
        paramMode: true,
        autoBack: true,
        primaryKey: 'uuid',
        module: MODULE.APARTMENT
      };
    },
    baseFormItems() {
      return {
        left: [{ key: 'name', label: '公寓名称' }],
        right: [
          {
            key: 'state',
            prop: 'state',
            label: '公寓状态',
            type: 'selector',
            map: this.APARTMENT_STATE_MAP
          },
          { key: 'remarkContent', label: '备注', type: 'remark' }
        ]
      };
    },
    formRules() {
      return {
        name: [{ required: true, message: '公寓名称不能为空', trigger: 'blur' }]
      };
    }
  }
};
</script>
