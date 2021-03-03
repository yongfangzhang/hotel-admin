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
          <el-form-item label="员工"
                        prop="employeeUuid">
            <selector-emp v-model="viewInfo.employeeUuid"
                          :list="allOfficeList"
                          :is-view="!newAdded"
                          :view-name="employeeData.name"
                          :view-uuid="employeeData.uuid"
                          placeholder="请选择账号对应的员工" />
          </el-form-item>
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
                       :entity="viewInfo.info"
                       :disabled="item.disabled" />
        </el-col>
        <el-col :xs="24"
                :sm="12">
          <m-form-item v-for="item in infoFormItems.right"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="viewInfo.info"
                       :disabled="item.disabled" />
          <m-form-item v-for="item in accountFormItems.right"
                       :key="item.key"
                       :label="item.label"
                       :item="item"
                       :entity="viewInfo"
                       :disabled="item.disabled" />
        </el-col>
      </el-row>
      <el-transfer v-model="addedRoles"
                   class="m-transfer"
                   :data="allRoles"
                   filterable
                   :titles="['所有', '已添加']"
                   :button-texts="['删除', '添加']"
                   :format="{ noChecked: '${total}', hasChecked: '${checked}/${total}' }"
                   :props="{ key: 'id', label: 'name' }"
                   @change="handleChange">
        <span slot-scope="{ option }">{{ option.name }}</span>
      </el-transfer>
    </el-form>
    <save-button @save="cusSave" />
  </div>
</template>
<script>
import { MODULE, ACTIONS } from '@/store/constant';
import { formEditMixin } from '@/utils/mixins';
import { emailValidator, mobileValidator } from '@/utils/validate';
import { mapActions } from 'vuex';
import { toastWarning } from '@/utils/message';
import { getQuickEmp } from '@/api/overview/index';
import { getAllOfficeMap } from '@/utils/map/emp';
export default {
  name: 'SystemAccountEdit',
  mixins: [formEditMixin],
  data() {
    return {
      addedRoles: [],
      allRoles: [],
      allOfficeList: [],
      employeeData: {}
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
    newAdded() {
      return !this.viewInfo || !isNaN(+this.viewInfo.uuid);
    },
    accountFormItems() {
      return {
        left: [
          { key: 'account', label: '账号' },
          { key: 'password', prop: 'password', label: '密码' },
          {
            key: 'state',
            label: '状态',
            type: 'selector',
            map: this.USER_STATE_MAP
          }
        ],
        right: [{ key: 'remarkContent', label: '备注', type: 'remark' }]
      };
    },
    infoFormItems() {
      return {
        left: [{ key: 'mobile', prop: 'info.mobile', label: '手机号' }],
        right: [
          { key: 'name', prop: 'info.name', label: '用户名称' },
          {
            key: 'gender',
            prop: 'info.gender',
            label: '用户性别',
            type: 'selector',
            map: this.GENDER_MAP
          },
          { key: 'email', prop: 'info.email', label: '邮箱' }
        ]
      };
    },
    formRules() {
      return {
        employeeUuid: [
          { required: true, message: '员工不能为空', trigger: 'blur' }
        ],
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        'info.name': [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        'info.mobile': [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: mobileValidator, trigger: 'blur' }
        ],
        'info.email': [{ validator: emailValidator, trigger: 'blur' }]
      };
    }
  },
  watch: {
    viewInfo() {
      this.initAddedRoles();
    },
    'viewInfo.employeeUuid'(nv) {
      if (!this.newAdded) return;
      this.$set(
        this.viewInfo.info,
        'name',
        nv ? this.allOfficeList.find((o) => o.uuid == nv).name : ''
      );
    }
  },
  mounted() {
    this.doAction(MODULE.SYSTEM_ROLE, ACTIONS.FETCH_LIST).then((d) => {
      this.allRoles = d;
    });
    if (this.newAdded) {
      // 获取所有没有ERP账号的员工
      getAllOfficeMap({ _ne_accountType: 14 }, true).then((list) => {
        this.allOfficeList = list;
      });
    }
  },
  methods: {
    ...mapActions(MODULE.SYSTEM_ACCOUNT, [
      ACTIONS.BATCH_ADD_ROLES,
      ACTIONS.BATCH_DELETE_ROLES
    ]),
    initAddedRoles() {
      if (!this.viewInfo) {
        this.addedRoles = [];
      } else {
        this.addedRoles = this.viewInfo.roles.map((r) => +r.id);
      }
    },
    fallBackTransfer(keys) {
      this.addedRoles = this.addedRoles.filter((r) => keys.indexOf(r) < 0);
    },
    afterFetch() {
      if (!this.viewInfo.uuid) return;
      getQuickEmp(this.viewInfo.employeeUuid).then((data) => {
        this.employeeData = data;
      });
    },
    handleChange(value, direction, movedKeys) {
      if (this.newAdded) {
        // this.addedRoles = [];
        // this.createOrUpdate(() => {
        //   this.handleChange(value, direction, movedKeys);
        // });
        return toastWarning('请先添加账号');
      }
      switch (direction) {
        case 'right':
          this[ACTIONS.BATCH_ADD_ROLES]({
            uuid: this.viewInfo.uuid,
            roleIds: movedKeys
          }).catch((_) => this.fallBackTransfer(movedKeys));
          break;
        case 'left':
          this[ACTIONS.BATCH_DELETE_ROLES]({
            uuid: this.viewInfo.uuid,
            roleIds: movedKeys
          }).catch((_) => this.fallBackTransfer(movedKeys));
          break;
        default:
          break;
      }
    },
    convertToAccountForm() {
      const v = this.viewInfo;
      if (this.getPrimaryValue()) return v;
      const accountForm = {
        account: v.account,
        password: v.password,
        state: v.state,
        name: v.info.name,
        gender: v.info.gender,
        mobile: v.info.mobile,
        email: v.info.email,
        roleList: v.roles,
        employeeUuid: v.employeeUuid
      };
      return accountForm;
    },
    cusSave() {
      if (this.vDisabled) return;
      this.validateForm().then((v) => {
        if (!v) return;
        const method = this.getPrimaryValue()
          ? ACTIONS.UPDATE_ITEM
          : ACTIONS.CREATE_ITEM;
        this.doAction(
          MODULE.SYSTEM_ACCOUNT,
          method,
          this.convertToAccountForm()
        ).then((d) => {
          this.$router.back();
        });
      });
    }
  }
};
</script>
