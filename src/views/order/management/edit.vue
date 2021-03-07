<template>
  <div v-if="viewInfo"
       class="h-100 d-flex flex-column ">
    <page-title back
                redirect-parent />
    <el-collapse v-model="activeNames"
                 class="flex-fill scrollable-y">
      <!-- 基本信息 -->
      <el-collapse-item title="基本信息"
                        name="basic">
        <el-form ref="form"
                 :model="viewInfo"
                 :rules="formRules"
                 :label-width="formLabelWidth.w6"
                 label-position="left"
                 class="p-3">
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
      </el-collapse-item>
      <!-- 入住人信息 -->
      <el-collapse-item title="入住人信息"
                        name="item">
        <div v-for="(vItem,idx) in viewInfo.items"
             :key="idx">
          <div class="border-bottom ml-3 py-2">
            <span class="font-weight-bold mr-3">入住人 {{ idx + 1 }}</span>
            <el-button v-if="!vItem.uuid"
                       type="text"
                       class="text-danger"
                       @click="removeItem(idx)">删除</el-button>
          </div>
          <el-form ref="userForm"
                   :model="vItem"
                   :rules="itemFormRules"
                   :label-width="formLabelWidth.w6"
                   label-position="left"
                   class="p-3">
            <el-row>
              <el-col :xs="24"
                      :sm="12">
                <m-form-item v-for="item in userFormItems.left"
                             :key="item.key"
                             :label="item.label"
                             :item="item"
                             :entity="vItem"
                             :disabled="item.disabled"
                             @change="()=>item.change&&item.change(vItem)" />
              </el-col>
              <el-col :xs="24"
                      :sm="12">
                <m-form-item v-for="item in userFormItems.right"
                             :key="item.key"
                             :label="item.label"
                             :item="item"
                             :entity="vItem"
                             :disabled="item.disabled"
                             @change="()=>item.change&&item.change(vItem)" />
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>
    <save-button @save="createOrUpdate">
      <el-button slot="before"
                 type="success"
                 class="mr-2"
                 @click="addItem">
        添加入住人
      </el-button>
    </save-button>
  </div>
</template>
<script>
/* eslint-disable object-curly-spacing */

import { ACTIONS, MODULE } from '@/store/constant';
import { formEditMixin } from '@/utils/mixins';
import { toastWarning } from '@/utils/message';
import { list2Map } from '@/utils/index';
export default {
  name: 'OrderManagementEdit',
  mixins: [formEditMixin],
  data() {
    return {
      activeNames: ['basic', 'item'],
      roomMap: null,
      roomFullMap: null,
      apartmentList: [],
      userList: []
    };
  },
  computed: {
    mParam() {
      return {
        paramMode: true,
        autoBack: true,
        primaryKey: 'uuid',
        module: MODULE.ORDER
      };
    },
    baseFormItems() {
      return {
        left: [
          // prettier-ignore
          { key: 'apartmentUuid', label: '公寓', type: 'selector', list: this.apartmentList, kmap: { label: 'name', value: 'uuid' } },
          // prettier-ignore
          { key: 'userType', label: '客户来源', type: 'selector', map: this.ORDER_USER_TYPE_MAP },
          {
            key: 'userUuid',
            label: '客户',
            type: 'selector',
            list: this.userList,
            disabled:
              !this.viewInfo ||
              !this.viewInfo.userType ||
              this.viewInfo.userType === this.ORDER_USER_TYPE.SOCIAL,
            kmap: { label: 'name', value: 'uuid' }
          },
          // prettier-ignore
          { key: 'paidAt', label: '支付时间', type: 'datetime', placeholder: '请选择' },
          { key: 'remarkContent', label: '备注', type: 'remark' }
        ],
        right: [
          {
            key: 'state',
            label: '状态',
            type: 'selector',
            map: this.ORDER_STATE_MAP
          },
          { key: 'number', label: '订单号', isView: true },
          { key: 'channel', label: '渠道', isView: true },
          { key: 'canceledAt', label: '取消时间', isView: true },
          { key: 'finishedAt', label: '完成时间', isView: true },
          { key: 'commentedAt', label: '评价时间', isView: true }
        ]
      };
    },
    userFormItems() {
      return {
        left: [
          // prettier-ignore
          { key: 'roomUuid', label: '房间', type: 'selector', map: this.roomMap, change: this.onRoomChange },
          // prettier-ignore
          { key: 'name', label: '客户姓名' },
          { key: 'mobile', label: '手机号', type: 'number' },
          { key: 'liveAt', label: '入住时间', type: 'datetime' },
          { key: 'leaveAt', label: '退房时间', type: 'datetime' }
        ],
        right: [
          // prettier-ignore
          { key: 'priceType', label: '价格类型', type: 'selector', map: this.ROOM_PRICE_TYPE_MAP, change: this.onPriceTypeChange },
          { key: 'originalPrice', label: '价格', isView: true },
          { key: 'paidPrice', label: '实付价格', type: 'number' }
          // { key: 'state', label: '状态', type: 'selector', map: this.ORDER_STATE_MAP }
        ]
      };
    },
    formRules() {
      return {
        apartmentUuid: [
          { required: true, message: '公寓不能为空', trigger: 'change' }
        ],
        userType: [
          { required: true, message: '客户来源不能为空', trigger: 'change' }
        ],
        state: [
          { required: true, message: '订单状态不能为空', trigger: 'change' }
        ]
      };
    },
    itemFormRules() {
      return {
        roomUuid: [
          { required: true, message: '房间不能为空', trigger: 'change' }
        ],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }]
      };
    }
  },
  watch: {
    'viewInfo.userType'() {
      this.viewInfo.userUuid = null;
    },
    'viewInfo.apartmentUuid'() {
      this.fetchRoomMap();
    },
    'viewInfo.priceType'() {}
  },
  mounted() {
    this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST, {
      state: this.APARTMENT_STATE.NORMAL
    }).then((list) => {
      this.apartmentList = list;
    });
    this.doAction(MODULE.USER, ACTIONS.FETCH_LIST).then((list) => {
      this.userList = list;
    });
    this.fetchRoomMap();
  },
  methods: {
    onRoomChange(item) {
      this.$set(item, 'room', this.roomFullMap[item.roomUuid]);
      this.onPriceTypeChange(item);
    },
    onPriceTypeChange(item) {
      if (!item.room) return;
      item.originalPrice = item.room.priceTypeMap[item.priceType];
    },
    fetchRoomMap() {
      if (!this.viewInfo || !this.viewInfo.apartmentUuid) return;
      this.doAction(MODULE.ROOM, ACTIONS.FETCH_LIST, {
        apartmentUuid: this.viewInfo.apartmentUuid,
        state: this.ROOM_STATE.NORMAL
      }).then((list) => {
        this.roomMap = list2Map(list, 'uuid', 'name');
        this.roomFullMap = list2Map(list, 'uuid');
      });
    },
    addItem() {
      const items = this.viewInfo.items || [];
      items.push({
        uuid: null,
        roomUuid: null,
        name: null,
        mobile: null,
        priceType: null,
        originalPrice: null,
        paidPrice: null,
        state: null,
        liveAt: null,
        leaveAt: null,
        room: null
      });
    },
    removeItem(idx) {
      const items = this.viewInfo.items || [];
      items.splice(idx, 1);
    },
    customerValidateForm() {
      if (!this.viewInfo.items || !this.viewInfo.items.length) {
        toastWarning('请添加入住人');
        return Promise.resolve(false);
      }
      this.viewInfo.channel = this.ORDER_CHANNEL.ADMIN;
      const promiseArr = [this.$refs.form]
        .concat(this.$refs.userForm)
        .map((f) => new Promise((resolve) => f.validate(resolve)));
      return Promise.all(promiseArr).then((args) =>
        Promise.resolve(args.filter((a) => !a).length === 0)
      );
    }
  }
};
</script>
