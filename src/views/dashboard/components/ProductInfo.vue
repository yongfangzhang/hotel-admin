<template>
  <div class="py-2">
    <el-button type="primary"
               class="mb-2"
               @click="addProduct">新增消费</el-button>
    <el-table v-if="order"
              :data="order.products"
              border
              stripe>
      <el-table-column label="序号"
                       :resizable="false"
                       align="center"
                       :width="colWidth.xxs">
        <template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称"
                       align="center"
                       prop="productName"
                       :min-width="colWidth.xs">
        <template slot-scope="{ row }">
          <m-edit v-model="row.productName"
                  placeholder="请输入或选择" />
        </template>
      </el-table-column>
      <el-table-column label="单价"
                       align="center"
                       prop="productPrice"
                       :min-width="colWidth.xs">
        <template slot-scope="{ row }">
          <m-edit v-model="row.productPrice"
                  type="number"
                  @change="updateTotalPrice(row)" />
        </template>
      </el-table-column>
      <el-table-column label="商品数量"
                       align="center"
                       prop="productCount"
                       :min-width="colWidth.xs">
        <template slot-scope="{ row }">
          <m-edit v-model="row.productCount"
                  type="number"
                  @change="updateTotalPrice(row)" />
        </template>
      </el-table-column>
      <el-table-column label="总价"
                       align="center"
                       prop="totalPrice"
                       :min-width="colWidth.xs">
        <template slot-scope="{ row }">
          <m-view :value="row.totalPrice"
                  type="currency" />
        </template>
      </el-table-column>
      <el-table-column label="押金支付"
                       align="center"
                       prop="paidByDeposit"
                       :min-width="colWidth.xs">
        <template slot-scope="{ row }">
          <m-edit v-model="row.paidByDeposit"
                  :disabled="order.deposit<=0"
                  type="switch" />
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       :min-width="colWidth.xs">
        <template slot-scope="{ $index }">
          <el-button type="text"
                     class="mr-2"
                     @click="saveProduct($index)">保存</el-button>
          <el-button type="text"
                     class="text-danger"
                     @click="removeProduct($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { ACTIONS, MODULE } from '@/store/constant';
import { mapActions, mapState } from 'vuex';
export default {
  name: 'ProductInfo',
  props: {
    order: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    ...mapState(MODULE.ROOM, ['roomSetting'])
  },
  methods: {
    ...mapActions(MODULE.ORDER_PRODUCT, [
      ACTIONS.CREATE_ITEM,
      ACTIONS.UPDATE_ITEM,
      ACTIONS.DELETE_ITEM
    ]),
    updateTotalPrice(product) {
      product.totalPrice = product.productCount * product.productPrice;
    },
    removeProduct(index) {
      const product = this.order.products[index];
      if (!product) return;
      if (product.uuid) {
        // 后台删除
        this[ACTIONS.DELETE_ITEM](product.uuid).then(() => {
          this.order.products.splice(index, 1);
          this.$emit('refresh');
        });
      } else {
        this.order.products.splice(index, 1);
        this.$emit('refresh');
      }
    },
    saveProduct(index) {
      const product = this.order.products[index];
      if (!product) return;
      const method = product.uuid ? ACTIONS.UPDATE_ITEM : ACTIONS.CREATE_ITEM;
      this[method](product).then((d) => {
        this.order.products.splice(index, 1, d);
        this.$emit('refresh');
      });
    },
    addProduct() {
      if (!this.order.products) this.order.products = [];
      this.order.products.push({
        uuid: null,
        orderUuid: this.order.uuid,
        productUuid: null,
        productName: null,
        productPrice: null,
        productCount: 1,
        paidByDeposit: Number(this.order.deposit) > 0,
        totalPrice: null
      });
    }
  }
};
</script>
