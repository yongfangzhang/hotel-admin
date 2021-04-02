<template>
  <div class="h-100 hotel-report">
    <el-tabs v-model="activeName"
             class="px-3 h-100 d-flex flex-column">
      <el-tab-pane label="公寓"
                   name="apartment">
        <apartment-report :apartment-map="apartmentMap"
                          :operator-map="operatorMap"
                          :visible="activeName==='apartment'" />
      </el-tab-pane>
      <el-tab-pane label="房间"
                   name="room">
        <room-report :apartment-map="apartmentMap"
                     :operator-map="operatorMap"
                     :visible="activeName==='room'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ApartmentReport from './components/ApartmentReport';
import RoomReport from './components/RoomReport';

import { ACTIONS, MODULE } from '@/store/constant';
import { deepClone, list2Map } from '@/utils';
export default {
  name: 'StatisticsReport',
  components: { ApartmentReport, RoomReport },
  data() {
    return {
      activeName: 'apartment',
      apartmentMap: {},
      operatorMap: {}
    };
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.doAction(MODULE.APARTMENT, ACTIONS.FETCH_LIST).then((d) => {
        const list = deepClone(d);
        this.apartmentMap = list2Map(list, 'uuid', 'shortName');
      });
      this.doAction(MODULE.USER, ACTIONS.FETCH_LIST, {
        channel: this.CUSTOMER_CHANNEL.BACKEND
      }).then((d) => {
        const list = deepClone(d);
        this.operatorMap = list2Map(list, 'uuid', 'name');
      });
    }
  }
};
</script>
