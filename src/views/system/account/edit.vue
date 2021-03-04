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
    <save-button @save="cusSave" />
  </div>
</template>
<script>
import { MODULE, ACTIONS } from '@/store/constant';
import { formEditMixin } from '@/utils/mixins';
import { mobileValidator } from '@/utils/validate';
import { toastWarning } from '@/utils/message';
import { validateId } from '@/utils/index';
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
    newAdded() {
      return !this.viewInfo || !validateId(this.viewInfo.uuid);
    },
    accountFormItems() {
      return {
        left: [
          { key: 'account', label: '账号' },
          { key: 'password', prop: 'password', label: '密码' }
        ],
        right: [{ key: 'remarkContent', label: '备注', type: 'remark' }]
      };
    },
    infoFormItems() {
      return {
        left: [{ key: 'mobile', prop: 'user.mobile', label: '手机号' }],
        right: [
          { key: 'name', prop: 'user.name', label: '用户名称' },
          {
            key: 'gender',
            prop: 'user.gender',
            label: '用户性别',
            type: 'selector',
            map: this.GENDER_MAP
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
    this.doAction(MODULE.SYSTEM_ROLE, ACTIONS.FETCH_LIST).then((d) => {
      this.allRoles = d;
    });
  },
  methods: {
    initAddedRoles() {
      if (!this.viewInfo) {
        this.addedRoles = [];
      } else {
        this.addedRoles = this.viewInfo.roles.map((r) => +r.uuid);
      }
    },
    fallBackTransfer(keys) {
      this.addedRoles = this.addedRoles.filter((r) => keys.indexOf(r) < 0);
    },
    handleChange(value, direction, movedKeys) {
      if (this.newAdded) {
        return toastWarning('请先添加账号');
      }
      switch (direction) {
        case 'right':
          // this[ACTIONS.BATCH_ADD_ROLES]({
          //   uuid: this.viewInfo.uuid,
          //   roleIds: movedKeys
          // }).catch((_) => this.fallBackTransfer(movedKeys));
          break;
        case 'left':
          // this[ACTIONS.BATCH_DELETE_ROLES]({
          //   uuid: this.viewInfo.uuid,
          //   roleIds: movedKeys
          // }).catch((_) => this.fallBackTransfer(movedKeys));
          break;
        default:
          break;
      }
    },
    cusSave() {
      if (this.vDisabled) return;
      this.validateForm().then((v) => {
        if (!v) return;
        const method = this.getPrimaryValue()
          ? ACTIONS.UPDATE_ITEM
          : ACTIONS.CREATE_ITEM;
        this.doAction(MODULE.SYSTEM_ACCOUNT, method, {
          account: this.viewInfo,
          user: this.viewInfo.user
        }).then((d) => {
          // this.$router.back();
        });
      });
    }
  }
};
</script>
