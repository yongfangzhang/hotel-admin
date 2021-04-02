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
                           :allow-create="item.allowCreate"
                           :disabled="!item.alwaysEnable && (vDisabled || item.disabled)" />
              <el-form-item v-if="viewInfo"
                            label="押金状态"
                            prop="depositState"
                            class="m-form-item">
                <div class="d-flex">
                  <m-selector v-model="viewInfo.depositState"
                              :map="DEPOSIT_STATE_MAP"
                              placeholder="请选择"
                              filterable />
                  <el-input v-if="viewInfo.depositState===DEPOSIT_STATE.PAID||viewInfo.depositState===DEPOSIT_STATE.UNPAID"
                            v-model="viewInfo.deposit"
                            class="ml-2"
                            type="number"
                            placeholder="收押金额" />
                  <el-input v-else-if="viewInfo.depositState===DEPOSIT_STATE.REFUNDED"
                            v-model="viewInfo.depositRefunded"
                            class="ml-2"
                            type="number"
                            placeholder="退押金额" />
                  <el-input v-else
                            class="ml-2"
                            disabled
                            placeholder="无押金" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24"
                    :sm="12">
              <m-form-item v-for="item in baseFormItems.right"
                           :key="item.key"
                           :label="item.label"
                           :item="item"
                           :entity="viewInfo"
                           :allow-create="item.allowCreate"
                           :disabled="!item.alwaysEnable && (vDisabled || item.disabled)" />
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
            <span :id="'order-item-'+idx"
                  class="font-weight-bold mr-3">入住人 {{ idx + 1 }}</span>
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
                             :disabled="!item.alwaysEnable && (vDisabled || item.disabled)"
                             :allow-create="item.allowCreate"
                             @change="()=>item.change&&item.change(vItem)" />
              </el-col>
              <el-col :xs="24"
                      :sm="12">
                <m-form-item v-for="item in userFormItems.right"
                             :key="item.key"
                             :label="item.label"
                             :item="item"
                             :entity="vItem"
                             :disabled="!item.alwaysEnable && (vDisabled || item.disabled)"
                             :allow-create="item.allowCreate"
                             @change="()=>item.change&&item.change(vItem)" />
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>
    <save-button v-if="canUpdate"
                 @save="createOrUpdate">
      <el-button v-show="newAdded"
                 slot="before"
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

import { ACTIONS, MODULE, MUTATIONS } from '@/store/constant';
import { formEditMixin } from '@/utils/mixins';
import { alertMessage, toastWarning } from '@/utils/message';
import { deepClone, list2Map, parseTime, validateId } from '@/utils/index';
export default {
  name: 'OrderManagementEdit',
  mixins: [formEditMixin],
  data() {
    return {
      activeNames: ['basic', 'item'],
      roomMap: null,
      roomFullMap: null,
      apartmentList: [],
      userMap: null,
      userFullMap: null
    };
  },
  computed: {
    canUpdate() {
      return this.hasPermission('order:update');
    },
    vDisabled() {
      // return !this.viewInfo || this.viewInfo.state >= this.ORDER_STATE.USED;
      return false;
    },
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
          {
            key: 'apartmentUuid',
            label: '公寓',
            type: 'selector',
            list: this.apartmentList,
            kmap: { label: 'name', value: 'uuid' },
            disabled: !this.newAdded
          },
          {
            key: 'userType',
            label: '客户渠道',
            type: 'selector',
            map: this.ORDER_USER_TYPE_MAP,
            disabled: !this.newAdded
          },
          {
            key: 'userUuid',
            label: '客户',
            type: 'selector',
            map: this.userMap,
            disabled:
              !this.newAdded ||
              !this.viewInfo ||
              !this.viewInfo.userType ||
              this.viewInfo.userType === this.ORDER_USER_TYPE.SOCIAL
          },
          {
            key: 'state',
            label: '状态',
            type: 'selector',
            map: this.ORDER_STATE_MAP
          },
          {
            key: 'paidAt',
            label: '支付时间',
            type: 'datetime',
            placeholder: '请选择',
            disabled: !this.newAdded
          },
          {
            key: 'deposit',
            label: '押金',
            isView: true
          }
        ],
        right: [
          {
            key: 'channel',
            label: '渠道',
            type: 'selector',
            map: this.ORDER_CHANNEL_MAP,
            disabled: !this.newAdded
          },
          { key: 'bizNumber', label: '渠道订单号', disabled: !this.newAdded },
          { key: 'number', label: '订单号', isView: true },
          { key: 'canceledAt', label: '取消时间', isView: true },
          { key: 'finishedAt', label: '完成时间', isView: true },
          {
            key: 'remarkContent',
            label: '备注',
            type: 'remark',
            alwaysEnable: true
          }
          // { key: 'commentedAt', label: '评价时间', isView: true }
        ]
      };
    },
    userFormItems() {
      return {
        left: [
          {
            key: 'roomUuid',
            label: '房间',
            type: 'selector',
            map: this.roomMap,
            change: this.onRoomChange,
            disabled: !this.newAdded,
            extral: {
              disabledFunction: this.roomDisabledFunc
            }
          },
          {
            key: 'mobile',
            label: '手机号',
            type: 'selector',
            map: this.mobileMap,
            allowCreate: true,
            change: this.onMobileChange,
            disabled: !this.newAdded,
            placeholder: '请输入或选择'
          },
          { key: 'name', label: '客户姓名', disabled: !this.newAdded },
          {
            key: 'lodgingType',
            label: '入住类型',
            type: 'selector',
            map: this.LODGING_TYPE_MAP,
            disabled: !this.newAdded
          },
          {
            key: 'liveAt',
            label: '入住时间',
            type: 'datetime',
            disabled: !this.newAdded
          },
          {
            key: 'leaveAt',
            label: '退房时间',
            type: 'datetime',
            disabled: !this.newAdded
          }
        ],
        right: [
          {
            key: 'priceType',
            label: '价格类型',
            type: 'selector',
            map: this.ROOM_PRICE_TYPE_MAP,
            change: this.onPriceTypeChange,
            disabled: !this.newAdded
          },
          { key: 'originalPrice', label: '原始价格', isView: true },
          {
            key: 'paidPrice',
            label: '实付价格',
            type: 'number',
            disabled: !this.newAdded
          },
          {
            key: 'saveUser',
            label: '存为会员',
            type: 'switch',
            extral: { activeText: '打开后将会自动保存当前入住人为会员' },
            disabled: !this.newAdded
          }
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
          { required: true, message: '客户渠道不能为空', trigger: 'change' }
        ],
        state: [
          { required: true, message: '订单状态不能为空', trigger: 'change' }
        ],
        channel: [
          { required: true, message: '渠道不能为空', trigger: 'change' }
        ]
      };
    },
    itemFormRules() {
      return {
        roomUuid: [
          { required: true, message: '房间不能为空', trigger: 'change' }
        ],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        paidPrice: [
          { required: true, message: '实付价格不能为空', trigger: 'blur' }
        ],
        lodgingType: [
          { required: true, message: '入住类型不能为空', trigger: 'change' }
        ],
        liveAt: [
          { required: true, message: '入住时间不能为空', trigger: 'change' }
        ],
        leaveAt: [
          { required: true, message: '退房时间不能为空', trigger: 'change' }
        ],
        priceType: [
          { required: true, message: '价格类型不能为空', trigger: 'change' }
        ]
      };
    }
  },
  watch: {
    'viewInfo.userUuid'(v) {
      if (!this.viewInfo) return;
      if (!v || !this.userFullMap) return;
      const user = this.userFullMap[v];
      if (!user) return;
      const items = this.viewInfo.items || [];
      items.forEach((item) => {
        item.name = user.name;
        item.mobile = user.mobile;
      });
    },
    'viewInfo.userType'() {
      if (!this.viewInfo) return;
      this.viewInfo.userUuid = null;
    },
    'viewInfo.apartmentUuid'(v) {
      if (!this.viewInfo) return;
      this.fetchRoomMap(v);
    },
    'viewInfo.priceType'() {},
    'viewInfo.depositRefunded'() {
      this.updateDepositDeduction();
    },
    'viewInfo.deposit'() {
      this.updateDepositDeduction();
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    updateDepositDeduction() {
      const viewInfo = this.viewInfo;
      if (!viewInfo) return;

      viewInfo.depositDeduction =
        Number(viewInfo.deposit) - Number(viewInfo.depositRefunded);
    },
    init() {
      this.parseQuery();
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST, {
        state: this.APARTMENT_STATE.NORMAL
      }).then((d) => {
        this.apartmentList = deepClone(d);
      });
      this.doAction(MODULE.USER, ACTIONS.FETCH_LIST).then((d) => {
        const list = deepClone(d);
        this.userMap = list2Map(list, 'uuid', 'name');
        this.mobileMap = list2Map(list, 'mobile', 'mobile');
        this.userFullMap = list2Map(list, 'uuid');
        this.mobileFullMap = list2Map(list, 'mobile');
      });
    },
    parseQuery() {
      const { uuid, apartmentUuid, roomUuid } = this.$route.query || {};
      if (validateId(uuid)) return;
      this.fetchRoomMap(apartmentUuid).then((data) => {
        this.doMutation(MODULE.ORDER, MUTATIONS.SET_VIEW_INFO, {
          keys: ['apartmentUuid', 'items'],
          values: [
            apartmentUuid,
            [
              {
                uuid: null,
                roomUuid,
                name: null,
                mobile: null,
                priceType: null,
                originalPrice: null,
                paidPrice: null,
                state: null,
                lodgingType: this.LODGING_TYPE.SHORT,
                room: roomUuid && data ? data[roomUuid] : null,
                saveUser: true,
                ...this.presetLiveAndLeave()
              }
            ]
          ]
        });
      });
    },
    presetLiveAndLeave() {
      const today = new Date();
      today.setHours(today.getHours() + 1);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      const liveAt = parseTime(today);
      today.setDate(today.getDate() + 1);
      today.setHours(12);
      const leaveAt = parseTime(today);
      return {
        liveAt,
        leaveAt
      };
    },
    onRoomChange(item) {
      this.$set(item, 'room', this.roomFullMap[item.roomUuid]);
      this.onPriceTypeChange(item);
    },
    onPriceTypeChange(item) {
      if (!item.room) return;
      item.originalPrice = item.room.priceTypeMap[item.priceType];
      item.paidPrice = item.originalPrice;
    },
    onMobileChange(item) {
      const user = this.mobileFullMap[item.mobile];
      if (!user) return;
      this.$set(item, 'name', user.name);
    },
    fetchRoomMap(apartmentUuid) {
      if (!apartmentUuid && (!this.viewInfo || !this.viewInfo.apartmentUuid)) {
        return Promise.resolve();
      }
      return this.doAction(MODULE.ROOM, ACTIONS.FETCH_LIST, {
        apartmentUuid: this.viewInfo.apartmentUuid,
        state: this.ROOM_STATE.NORMAL
      }).then((d) => {
        const list = deepClone(d);
        this.roomMap = list2Map(list, 'uuid', 'name');
        this.roomFullMap = list2Map(list, 'uuid');
        return Promise.resolve(this.roomFullMap);
      });
    },
    roomDisabledFunc(uuid) {
      if (!this.roomFullMap || !this.roomFullMap[uuid]) return true;
      return this.roomFullMap[uuid].state !== this.ROOM_STATE.EMPTY_CLEAN;
    },
    addItem() {
      if (!this.newAdded) return;
      const items = this.viewInfo.items || [];
      const userUuid = this.viewInfo.userUuid;
      const user =
        userUuid && this.userFullMap ? this.userFullMap[userUuid] : null;
      items.push({
        uuid: null,
        roomUuid: null,
        name: user ? user.name : null,
        mobile: user ? user.mobile : null,
        priceType: null,
        originalPrice: null,
        paidPrice: null,
        state: null,
        lodgingType: this.LODGING_TYPE.SHORT,
        room: null,
        saveUser: true,
        ...this.presetLiveAndLeave()
      });
      this.activeNames = ['item'];
      this.$nextTick(() => {
        const el = this.$el.querySelector(`#order-item-${items.length - 1}`);
        if (el && el.scrollIntoView) el.scrollIntoView();
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

      const errEl = [];
      const h = this.$createElement;
      if (this.newAdded) {
        this.viewInfo.items.forEach((item) => {
          const room = this.roomFullMap[item.roomUuid];
          const state = room.state;
          if (state !== this.ROOM_STATE.EMPTY_CLEAN) {
            errEl.push(
              h(
                'div',
                null,
                `房间${room.name}状态为【${room.stateName}】, 不允许创建订单`
              )
            );
          }
        });
      }

      if (errEl.length > 0) {
        alertMessage(h('div', null, errEl));
        return Promise.resolve(false);
      }

      // this.viewInfo.channel = this.ORDER_CHANNEL.ADMIN;
      const promiseArr = [this.$refs.form]
        .concat(this.$refs.userForm)
        .map((f) => new Promise((resolve) => f.validate(resolve)));
      return Promise.all(promiseArr).then((args) => {
        const success = args.filter((a) => !a).length === 0;
        if (!success) this.activeNames = ['basic', 'item'];
        return Promise.resolve(success);
      });
    }
  }
};
</script>
