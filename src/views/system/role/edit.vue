<template>
  <div v-if="viewInfo"
       class="h-100 d-flex flex-column ">
    <page-title back
                redirect-parent />
    <el-form ref="form"
             :disabled="vDisabled"
             :model="viewInfo"
             :rules="formRules"
             :label-width="formLabelWidth.w6"
             label-position="left"
             class="flex-fill scrollable-y p-3">
      <el-row>
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in formItems.left"
                       :key="item.key"
                       :label="item.label"
                       :prop="item.key"
                       :item="item"
                       :entity="viewInfo" />
        </el-col>
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in formItems.right"
                       :key="item.key"
                       :label="item.label"
                       :prop="item.key"
                       :item="item"
                       :entity="viewInfo" />
        </el-col>
      </el-row>
      <el-transfer v-model="addedRoutes"
                   class="m-transfer"
                   :data="allRoutes"
                   filterable
                   :titles="['所有权限', '已添加权限']"
                   :button-texts="['删除', '添加']"
                   :format="{ noChecked: '${total}', hasChecked: '${checked}/${total}' }"
                   :props="{ key: 'id', label: 'caption' }"
                   @change="handleChange">
        <span slot-scope="{ option }">{{ option.caption }}【{{ option.path }}】</span>
      </el-transfer>
    </el-form>
    <save-button @save="createOrUpdate" />
  </div>
</template>
<script>
import { MODULE, ACTIONS } from '@/store/constant';
import { formEditMixin } from '@/utils/mixins';
import { mapActions } from 'vuex';
import { toastWarning } from '@/utils/message';
export default {
  name: 'SystemRoleEdit',
  mixins: [formEditMixin],
  data() {
    return {
      allRoutes: [],
      addedRoutes: []
    };
  },
  computed: {
    vDisabled() {
      return this.viewInfo !== null && !this.viewInfo.editable;
    },
    mParam() {
      return {
        paramMode: true,
        autoBack: true,
        primaryKey: 'id',
        module: MODULE.SYSTEM_ROLE
      };
    },
    newAdded() {
      return !this.viewInfo || +this.viewInfo.id < 1;
    },
    formItems() {
      return {
        left: [
          {
            key: 'name',
            label: '角色名称'
          },
          { key: 'description', label: '描述', type: 'textarea' }
        ],
        right: [{ key: 'remarkContent', label: '备注', type: 'remark' }]
      };
    },
    formRules() {
      return {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      };
    }
  },
  watch: {
    viewInfo() {
      this.initAddedRoutes();
    }
  },
  mounted() {
    this.doAction(MODULE.SYSTEM_PERMISSION, ACTIONS.FETCH_LIST).then((d) => {
      this.allRoutes = d;
    });
  },
  methods: {
    ...mapActions(MODULE.SYSTEM_ROLE, [
      ACTIONS.BATCH_ADD_ROUTES,
      ACTIONS.BATCH_DELETE_ROUTES
    ]),
    initAddedRoutes() {
      if (!this.viewInfo) {
        this.addedRoutes = [];
      } else {
        this.addedRoutes = this.viewInfo.routes.map((r) => +r.id);
      }
    },
    fallBackTransfer(keys) {
      this.addedRoutes = this.addedRoutes.filter((r) => keys.indexOf(r) < 0);
    },
    handleChange(value, direction, movedKeys) {
      if (this.vDisabled) {
        this.fallBackTransfer(movedKeys);
        return toastWarning('禁止操作');
      }
      if (this.newAdded) {
        this.addedRoutes = [];
        return toastWarning('请先添加角色');
      }
      switch (direction) {
        case 'right':
          this[ACTIONS.BATCH_ADD_ROUTES]({
            roleId: this.viewInfo.id,
            routeIds: movedKeys
          }).catch((_) => this.fallBackTransfer(movedKeys));
          break;
        case 'left':
          this[ACTIONS.BATCH_DELETE_ROUTES]({
            roleId: this.viewInfo.id,
            routeIds: movedKeys
          }).catch((_) => this.fallBackTransfer(movedKeys));
          break;
        default:
          break;
      }
    }
  }
};
</script>
