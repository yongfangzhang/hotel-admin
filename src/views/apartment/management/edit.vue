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
  name: 'ApartmentManagementEdit',
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
        left: [
          { key: 'name', label: '公寓名称' },
          { key: 'shortName', label: '公寓简称' },
          // prettier-ignore
          { key: 'state', label: '公寓状态', type: 'selector', map: this.APARTMENT_STATE_MAP },
          { key: 'contactor', label: '联系人' },
          { key: 'contactorMobile', label: '联系电话', type: 'number' },
          { key: 'saleTimes', label: '销售次数', isView: true },
          { key: 'income', label: '总收益', isView: true }
        ],
        right: [
          { key: 'areaCode', label: '区域', type: 'address' },
          { key: 'address', label: '详细地址', placeholder: '地图选址待添加' },
          // prettier-ignore
          { key: 'longitude', label: '经度', type: 'number', placeholder: '地图选址待添加' },
          // prettier-ignore
          { key: 'latitude', label: '维度', type: 'number', placeholder: '地图选址待添加' },
          { key: 'remarkContent', label: '备注', type: 'remark' }
        ]
      };
    },
    formRules() {
      return {
        name: [
          { required: true, message: '公寓名称不能为空', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '公寓简称不能为空', trigger: 'blur' }
        ],
        contactor: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        contactorMobile: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: '区域不能为空', trigger: 'change' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '经度不能为空', trigger: 'blur' }
        ],
        latitude: [{ required: true, message: '维度不能为空', trigger: 'blur' }]
      };
    }
  }
};
</script>
