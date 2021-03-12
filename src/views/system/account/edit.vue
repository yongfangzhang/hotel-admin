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
          <m-form-item v-for="item in accountFormItems.left"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="viewInfo"
                       :disabled="item.disabled" />
          <m-form-item v-for="item in infoFormItems.left"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="viewInfo.user"
                       :disabled="item.disabled" />
        </el-col>
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in infoFormItems.right"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="viewInfo.user"
                       :disabled="item.disabled" />
          <m-form-item v-for="item in accountFormItems.right"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="viewInfo"
                       :disabled="item.disabled" />
        </el-col>
      </el-row>
      <el-transfer v-show="!newAdded"
                   v-model="addedRoles"
                   class="m-transfer"
                   :data="allRoles"
                   filterable
                   :titles="['所有', '已添加']"
                   :button-texts="['删除', '添加']"
                   :format="{ noChecked: '${total}', hasChecked: '${checked}/${total}' }"
                   :props="{ key: 'uuid', label: 'name' }"
                   @change="handleChange">
        <span slot-scope="{ option }">{{ option.name }}</span>
      </el-transfer>
    </el-form>
    <save-button v-if="canUpdate"
                 @save="cusSave" />
  </div>
</template>
<script>
import { MODULE, ACTIONS, MUTATIONS } from '@/store/constant';
import { formEditMixin } from '@/utils/mixins';
import { mobileValidator } from '@/utils/validate';
import { toastWarning } from '@/utils/message';
export default {
  name: 'SystemAccountEdit',
  mixins: [formEditMixin],
  data() {
    return {
      addedRoles: [],
      allRoles: []
    };
  },
  computed: {
    mParam() {
      return {
        paramMode: true,
        autoBack: true,
        primaryKey: 'uuid',
        module: MODULE.SYSTEM_ACCOUNT
      };
    },
    canUpdate() {
      return this.hasPermission('account:update');
    },
    accountFormItems() {
      return {
        left: [
          { key: 'account', label: '账号', disabled: !this.newAdded },
          { key: 'password', prop: 'password', label: '密码' }
        ],
        right: [{ key: 'remarkContent', label: '备注', type: 'remark' }]
      };
    },
    infoFormItems() {
      return {
        left: [
          {
            key: 'mobile',
            prop: 'user.mobile',
            label: '手机号',
            disabled: !this.newAdded
          }
        ],
        right: [
          {
            key: 'name',
            prop: 'user.name',
            label: '用户名称',
            disabled: !this.newAdded
          },
          {
            key: 'gender',
            prop: 'user.gender',
            label: '用户性别',
            type: 'selector',
            map: this.GENDER_MAP,
            disabled: !this.newAdded
          }
        ]
      };
    },
    formRules() {
      return {
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        'user.name': [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        'user.mobile': [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: mobileValidator, trigger: 'blur' }
        ]
      };
    }
  },
  watch: {
    viewInfo() {
      this.initAddedRoles();
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
      this.doAction(MODULE.SYSTEM_ROLE, ACTIONS.FETCH_LIST).then((d) => {
        this.allRoles = d;
      });
    },
    initAddedRoles() {
      if (!this.viewInfo) {
        this.addedRoles = [];
      } else {
        this.addedRoles = this.viewInfo.roles.map((r) => r.uuid);
      }
    },
    updateAccount() {
      this.doAction(
        MODULE.SYSTEM_ACCOUNT,
        ACTIONS.FETCH_VIEW_INFO,
        this.viewInfo.uuid
      ).then((data) => {
        this.doMutation(MODULE.SYSTEM_ACCOUNT, MUTATIONS.SET_VIEW_INFO, data);
      });
    },
    handleChange(value, direction, roleUuids) {
      if (this.newAdded) {
        return toastWarning('请先添加账号');
      }
      switch (direction) {
        case 'right':
          roleUuids.forEach((roleUuid) => {
            this.doAction(MODULE.SYSTEM_ACCOUNT_ROLE, ACTIONS.CREATE_ITEM, {
              accountUuid: this.viewInfo.uuid,
              roleUuid
            }).then(() => {
              this.updateAccount();
            });
          });
          break;
        case 'left':
          this.viewInfo.accountRoles
            .filter((ar) => roleUuids.indexOf(ar.roleUuid) > -1)
            .forEach((ar) => {
              this.doAction(
                MODULE.SYSTEM_ACCOUNT_ROLE,
                ACTIONS.DELETE_ITEM,
                ar.uuid
              ).then(() => {
                this.updateAccount();
              });
            });
          break;
        default:
          break;
      }
    },
    cusSave() {
      if (this.vDisabled) return;
      this.validateForm().then((v) => {
        if (!v) return;
        const create = this.newAdded;
        const method = create ? ACTIONS.CREATE_ITEM : ACTIONS.UPDATE_ITEM;
        this.doAction(
          MODULE.SYSTEM_ACCOUNT,
          method,
          // prettier-inore
          this.newAdded
            ? { account: this.viewInfo, user: this.viewInfo.user }
            : this.viewInfo
        ).then((d) => {
          if (!create) this.$router.back();
        });
      });
    }
  }
};
</script>
