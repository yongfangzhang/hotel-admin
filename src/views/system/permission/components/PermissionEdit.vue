<template>
  <m-dialog v-model="currentValue"
            :title="title"
            @confirm="save">
    <el-form ref="form"
             :model="viewInfo"
             :rules="formRules"
             :label-width="formLabelWidth.w6"
             label-position="left"
             class="flex-fill scrollable-y">
      <m-form-item v-for="item in formItems"
                   :key="item.key"
                   :label="item.label"
                   :prop="item.key"
                   :item="item"
                   :entity="viewInfo" />
    </el-form>
  </m-dialog>
</template>
<script>
import sync from '@/utils/sync';
import { createModel } from '@/store/modules/system/systemPermission';
export default {
  name: 'PermissionEdit',
  mixins: [sync],
  props: {
    viewInfo: {
      type: Object,
      default() {
        return createModel();
      }
    }
  },
  computed: {
    title() {
      if (!this.viewInfo || this.invalidId(this.viewInfo.id)) {
        return '新建权限';
      }
      return '权限编辑';
    },
    formItems() {
      return [
        {
          key: 'caption',
          label: '权限标题'
        },
        {
          key: 'type',
          label: '权限类型',
          type: 'selector',
          map: this.ROUTE_TYPE_MAP
        },
        { key: 'path', label: '权限路径' },
        { key: 'permissions', label: '授权标识', type: 'textarea' },
        { key: 'description', label: '描述', type: 'textarea' }
      ];
    },
    formRules() {
      return {
        caption: [
          { required: true, message: '请输入权限标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择权限类型', trigger: 'change' }
        ],
        path: [{ required: true, message: '请输入权限路径', trigger: 'blur' }],
        permissions: [
          { required: true, message: '请输入授权标识', trigger: 'blur' }
        ]
      };
    }
  },
  methods: {
    save() {
      this.$refs.form.validate((v) => {
        if (!v) return;
        this.$emit('save', this.viewInfo);
      });
    }
  }
};
</script>
