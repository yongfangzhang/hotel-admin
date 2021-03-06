<template>
  <div class="h-100 py-3 d-flex flex-column">
    <div class="h-100">
      <el-col :span="16"
              class="h-100 d-flex flex-column">
        <el-input v-model.lazy="filterText"
                  class="mb-2"
                  placeholder="搜索(名称, 编码, 值)"
                  @change="doFilter"
                  @keyup.enter="doFilter" />
        <el-tree ref="tree"
                 :data="dictTree"
                 :props="treeProps"
                 node-key="uuid"
                 class="scrollable border flex-fill"
                 :style="{ paddingBottom: '90px' }"
                 :filter-node-method="filterDict"
                 :default-expanded-keys="expandKeys"
                 @node-click="onNodeClicked">
          <span slot-scope="{ node, data }">
            <span class="mr-2 text-primary">{{ node.label }}</span>
            <span class="mr-3">
              [值:
              <span class="text-danger">
                {{ data.value }}
              </span>
            </span>
            <span class="mr-3">
              编码:
              <span class="text-danger">
                {{ data.code }}
              </span>
              ]
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="8"
              class="h-100">
        <dict-info class="p-3"
                   :model="editable"
                   @save="saveDict"
                   @reset="resetDict" />
      </el-col>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { MODULE, ACTIONS } from '@/store/constant';
import DictInfo from './components/DictInfo';
import { deleteDict } from '@/api/pub/dict';
import { tree2List } from '@/utils/index';

export default {
  name: 'SystemDict',
  components: {
    DictInfo
  },
  data() {
    return {
      treeProps: {
        label: 'name'
      },
      editable: null,
      filterText: '',
      expandKeys: ['1000']
    };
  },
  computed: {
    ...mapState(MODULE.DICT, ['dictTree'])
  },
  mounted() {
    this.fetchDictTree();
  },
  methods: {
    ...mapActions(MODULE.DICT, [
      ACTIONS.FETCH_DICT,
      ACTIONS.UPDATE_ITEM,
      ACTIONS.DELETE_ITEM
    ]),
    fetchDictTree() {
      this.expandKeys = this.getExpandKeys();
      this[ACTIONS.FETCH_DICT]();
    },
    onNodeClicked(node) {
      this.editable = node;
    },
    getExpandKeys() {
      const tree = this.$refs.tree;
      const keys = ['1000'];
      if (tree && this.dictTree) {
        const dictList = tree2List(this.dictTree);
        dictList.forEach((dict) => {
          const node = tree.getNode(dict);
          if (node.expanded) {
            keys.push(dict.uuid);
          }
        });
      }
      return keys;
    },
    doFilter() {
      if (!this.dictTree || !this.dictTree.length) return null;
      this.$refs.tree.filter(this.filterText);
    },
    filterDict(value, data) {
      if (!value) return true;
      if (!this.dictTree || !this.dictTree.length) return true;
      return (
        data.name.indexOf(value) !== -1 ||
        data.code.indexOf(value) !== -1 ||
        data.value.indexOf(value) !== -1
      );
    },
    saveDict(dict) {
      this[ACTIONS.UPDATE_ITEM](dict).then((r) => {
        // this.editable = r
        this.fetchDictTree();
      });
    },
    resetDict(dict) {
      this.$confirm('确定重置此字典吗?').then(() => {
        deleteDict(dict.uuid).then((r) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.editable = null;
          this.fetchDictTree();
        });
      });
    }
  }
};
</script>

<style>
</style>
