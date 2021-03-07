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
          <m-form-item key="price"
                       label="基础价格"
                       :item="{ key: 'price', label: '基础价格' }"
                       :entity="viewInfo" />
          <el-form-item v-for="(priceName, priceType) in ROOM_PRICE_TYPE_MAP"
                        :key="priceType"
                        :label="priceName"
                        class="m-form-item">
            <m-edit v-model="priceTypeMap[priceType]"
                    placeholder="请输入" />
          </el-form-item>
          <m-form-item key="remarkContent"
                       label="备注"
                       :item="{ key: 'remarkContent', label: '备注', type: 'remark' }"
                       :entity="viewInfo" />
        </el-col>
      </el-row>
    </el-form>
    <save-button @save="cusSave" />
  </div>
</template>
<script>
import { ACTIONS, MODULE, MUTATIONS } from '@/store/constant';
import { formEditMixin } from '@/utils/mixins';
import { mapGetters } from 'vuex';
import { list2Map } from '@/utils';
export default {
  name: 'RoomManagementEdit',
  mixins: [formEditMixin],
  data() {
    return {
      apartmentList: [],
      priceTypeMap: {}
    };
  },
  computed: {
    ...mapGetters(MODULE.DICT, ['ROOM_TYPE_MAP']),
    mParam() {
      return {
        paramMode: true,
        autoBack: true,
        primaryKey: 'uuid',
        module: MODULE.ROOM
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
            kmap: { label: 'name', value: 'uuid' }
          },
          {
            key: 'typeUuid',
            label: '房间类型',
            type: 'selector',
            map: this.ROOM_TYPE_MAP
          },
          { key: 'floorNumber', label: '楼号' },
          { key: 'unitNumber', label: '单元号' },
          { key: 'number', label: '房间号' },
          {
            key: 'state',
            label: '房间状态',
            type: 'selector',
            map: this.ROOM_STATE_MAP
          }
        ]
      };
    },
    formRules() {
      return {
        apartmentUuid: [
          { required: true, message: '公寓不能为空', trigger: 'change' }
        ],
        typeUuid: [
          { required: true, message: '房间类型不能为空', trigger: 'change' }
        ],
        floorNumber: [
          { required: true, message: '楼号不能为空', trigger: 'blur' }
        ],
        unitNumber: [
          { required: true, message: '单元号不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '房间号不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '基础价格不能为空', trigger: 'blur' }
        ]
      };
    }
  },
  watch: {
    'viewInfo.prices'() {
      this.initPriceMap();
    }
  },
  mounted() {
    this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST, {
      state: this.APARTMENT_STATE.NORMAL
    }).then((list) => {
      this.apartmentList = list;
    });
    this.initPriceMap();
  },
  methods: {
    initPriceMap() {
      if (!this.viewInfo) return;
      const prices = this.viewInfo.prices || [];
      const oriPriceMap = list2Map(prices, 'type', 'price');
      const priceMap = {};
      for (const type in this.ROOM_PRICE_TYPE_MAP) {
        priceMap[type] = +oriPriceMap[type] || 0;
      }
      this.priceTypeMap = priceMap;
    },
    cusSave() {
      this.validateForm().then(() => {
        const prices = [];
        for (const type in this.priceTypeMap) {
          prices.push({
            type: +type,
            price: +this.priceTypeMap[type] || +this.viewInfo.price
          });
        }
        this.doMutation(MODULE.ROOM, MUTATIONS.SET_VIEW_INFO, {
          keys: ['prices'],
          values: [prices]
        });
        this.createOrUpdate();
      });
    }
  }
};
</script>
