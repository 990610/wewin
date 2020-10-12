<template>
  <div class="app-container">
    <div class="f-query">
      <el-form :inline="true" :model="queryForm">
        <el-form-item label="参数名：">
          <el-input v-model="queryForm.key" placeholder="请输入" size="small" clearable />
        </el-form-item>
        <el-form-item class="btns-l">
          <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
          <el-button class="reset-btn" size="mini" type="primary" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-show="dataListSelections.length > 0" v-hasPermi="['sys:sysdict:delete']" type="danger" size="mini" @click="deleteHandle()">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        height="100%"
        @selection-change="selectionChangeHandle"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="" />
        <el-table-column prop="name" label="字典名称" />
        <el-table-column prop="type" label="字典类型" />
        <el-table-column prop="code" label="字典码" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="orderNum" label="排序" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="delFlag" label="删除标记  -1：已删除  0：正常" />
        <el-table-column
          fixed="right"
          width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :current-page="pagination.pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next, sizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import AddOrUpdate from './sysdict-add-or-update'
// 引入对饮的api JS 文件
// import * as that from '@/api/******.js'
export default {
  name: '',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      queryForm: {
        key: ''
      },
      dataList: [],
      loading: false,
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  activated() {
    this.getDataList(1)
  },
  methods: {
    // 查询
    handleQuery() {
      this.getDataList(1)
    },
    // 重置查询
    resetQuery() {
      this.queryForm = this.$options.data().queryForm
      this.getDataList(1)
    },
    // 获取数据列表
    getDataList(pageNo) {
      this.loading = true
      const item = {
        pageNo: pageNo || this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        param: {
          key: this.queryForm.key
        }
      }
      console.log(item)
      // that.*******(item).then(res =>{
      //   this.loading = false
      //   this.pagination.total = res.total
      //   this.pagination.pageNo = res.current
      //   this.pagination.pageSize = res.size
      //   this.dataList = res.records
      // })
      //   .catch(error => { this.loading = false; console.log(error) })
    },
    // 分页大小选择
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getDataList(1)
    },
    // 分页页面跳转
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.getDataList(val)
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.error('请自行编写删除函数')
        // that.*****().then(res =>{
        //   this.msgSuccess('删除成功')
        //   this.getDataList(1)
        // })
        //   .catch(error => { console.log(error) }
      })
        .catch(function() {})
    }
  }
}
</script>
<style lang="scss" scoped>
  /* table 高度调整 */
  .table{
    height: calc(100vh - 255px);
  }
</style>
