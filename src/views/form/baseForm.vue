<!--基础表单页面-->
<template>
  <div class="app-container">
    <h3>常规页面顶部查询Form表单</h3>
    <div class="form f-query">
      <el-form :inline="true" class="clearfix">
        <el-form-item label="普通输入框：">
          <el-input
            v-model="baseForm.userName"
            placeholder="请输入用户名"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="下拉选择框：">
          <el-select v-model="baseForm.selected" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期选择框：">
          <el-date-picker
            v-model="baseForm.beginDate"
            type="datetime"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="reset-btn" type="primary" icon="el-icon-refresh-left" size="mini" @click="">重置</el-button>
          <el-button v-hasPermi="['sys:manage:list']" type="primary" icon="el-icon-search" size="mini" @click="">查询</el-button>
          <el-button v-hasPermi="['sys:manage:save']" type="primary" icon="el-icon-plus" size="mini" @click="">新增用户</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BaseForm',
  data() {
    return {
      baseForm: {
        userName: ''
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭哈哈哈哈哈哈哈哈哈嗝'
      }]
    }
  },
  methods: {}
}
</script>
<style lang='scss' scoped>
.form{
  border: 1px solid #efefef;
  box-sizing: border-box;
  padding: 20px;
}
</style>
