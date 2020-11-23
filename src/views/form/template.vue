<template>
  <div class="app-container">
    <div class="f-query clearfix">
      <el-form :inline="true">
        <el-form-item label="课程名称：">
          <el-input
            v-model="queryForm.userName"
            placeholder="请输入用户名"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="参与人员：">
          <el-input
            v-model="queryForm.realName"
            placeholder="请输入姓名"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="创建学院：">
          <el-input
            v-model="queryForm.realName"
            placeholder="请输入姓名"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item class="btns-l">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button class="reset-btn" type="primary" icon="el-icon-refresh-left" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-show="dataListSelections.length > 0" type="danger" size="mini" @click="deleteHandle()">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        ref="table"
        v-adaptive
        v-loading="loading"
        :data="dataList"
        height="100%"
        :header-draggend="headerDraggend"
        border
        @selection-change="selectionChangeHandle"
      >
        <el-table-column type="selection" width="46" />
        <el-table-column prop="index" type="index" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="addOrUpdateHandle(scope.row.userId)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteHandle(scope.row.userId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          :current-page="pagination.pageNo"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next, sizes"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import * as that from '@/api/system/SysUserController'
import AddOrUpdate from './template-add-or-update'
export default {
  name: 'Course',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      // f-query
      queryForm: {
        realName: ''
      },
      // table
      loading: false,
      dataList: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      dataListSelections: [],
      // 弹窗
      addOrUpdateVisible: false

    }
  },
  computed: {},
  watch: {},
  mounted() {
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
      this.pagination.pageNo = pageNo || this.pagination.pageNo
      const item = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        param: this.queryForm
      }
      that.sysUserPagelist(item).then(res => {
        this.loading = false
        this.pagination.total = res.total
        this.pagination.pageNo = res.current
        this.pagination.pageSize = res.size
        this.dataList = res.records
        this.$nextTick(() => {
          this.$refs.table.bodyWrapper.scrollTop = 0
        })
      })
        .catch(error => { this.loading = false; console.log(error) })
    },
    // 头部拖动
    headerDraggend() {
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
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
    // 编辑
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
      console.log(ids)
      this.$confirm(`确定进行${id ? '删除' : '批量删除'}操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.error('请自行编写删除函数')
        // that.*****(ids).then(res =>{
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

<style scoped>

</style>
