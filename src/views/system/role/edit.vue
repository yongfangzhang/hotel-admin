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
                   :props="{ key: 'uuid', label: 'caption' }"
                   @change="handleChange">
        <span slot-scope="{ option }">{{ option.caption }}【{{ option.path }}】</span>
      </el-transfer>
    </el-form>
    <save-button @save="createOrUpdate" />
  </div>
</template>
<script>
import { MODULE, ACTIONS, MUTATIONS } from '@/store/constant';
import { formEditMixin } from '@/utils/mixins';
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
    mParam() {
      return {
        paramMode: true,
        autoBack: true,
        primaryKey: 'uuid',
        module: MODULE.SYSTEM_ROLE
      };
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
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.doAction(MODULE.SYSTEM_PERMISSION, ACTIONS.FETCH_LIST).then((d) => {
        this.allRoutes = d;
      });
    },
    initAddedRoutes() {
      if (!this.viewInfo) {
        this.addedRoutes = [];
      } else {
        this.addedRoutes = this.viewInfo.routes.map((r) => r.uuid);
      }
    },
    updateRole() {
      this.doAction(
        MODULE.SYSTEM_ROLE,
        ACTIONS.FETCH_VIEW_INFO,
        this.viewInfo.uuid
      ).then((data) => {
        this.doMutation(MODULE.SYSTEM_ROLE, MUTATIONS.SET_VIEW_INFO, data);
      });
    },
    handleChange(value, direction, routeUuids) {
      if (this.newAdded) {
        this.addedRoutes = [];
        return toastWarning('请先添加角色');
      }
      switch (direction) {
        case 'right':
          routeUuids.forEach((routeUuid) => {
            this.doAction(MODULE.SYSTEM_ROLE_ROUTE, ACTIONS.CREATE_ITEM, {
              roleUuid: this.viewInfo.uuid,
              routeUuid
            }).then(() => {
              this.updateRole();
            });
          });
          break;
        case 'left':
          this.viewInfo.roleRoutes
            .filter((rr) => routeUuids.indexOf(rr.routeUuid) > -1)
            .forEach((rr) => {
              this.doAction(
                MODULE.SYSTEM_ROLE_ROUTE,
                ACTIONS.DELETE_ITEM,
                rr.uuid
              ).then(() => {
                this.updateRole();
              });
            });
          break;
        default:
          break;
      }
    }
  }
};
</script>
