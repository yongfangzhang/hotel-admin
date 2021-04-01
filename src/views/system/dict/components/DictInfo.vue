<template>
  <el-form v-if="model != null"
           label-position="left"
           :label-width="formWidth.w3"
           inline
           class="h-100 d-flex flex-column">
    <h4>字典信息</h4>
    <div class="flex-fill scrollable-y">
      <el-row>
        <el-col>
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="model.name"
                      type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="值"
                        prop="value">
            <el-input v-model="model.value"
                      type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="编码"
                        prop="code">
            <span>
              {{ model.code }}
            </span>
          </el-form-item>
          <el-col />
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="顺序"
                        prop="sequence">
            <span>
              {{ model.sequence }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="描述"
                        placeholder="请输入描述"
                        prop="description" />
        </el-col>
        <el-col>
          <el-input v-model="model.description"
                    type="textarea"
                    :rows="4" />
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col>
          <el-form-item label="扩展字段"
                        prop="extendField" />
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-input v-model="model.extendField"
                    type="textarea"
                    :rows="4" />
        </el-col>
      </el-row> -->
    </div>
    <el-row class="pt-2">
      <el-col class="text-right">
        <el-button type="primary"
                   @click="save">
          保存
        </el-button>
        <el-button @click="reset">
          重置为默认数据
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: 'DictInfoDialog',
  props: {
    model: {
      type: Object,
      default: null
    }
  },
  methods: {
    save() {
      this.$emit('save', this.model);
    },
    reset() {
      this.$emit('reset', this.model);
    }
  }
};
</script>

<style>
</style>
