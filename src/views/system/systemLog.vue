<!--系统设置-系统日志-->
<template>
  <div id="systemLog" class="app-container">
    <el-form :inline="true" class="f-query queryForm">
      <el-form-item label="操作用户名：">
        <el-input v-model="queryForm.userName" size="small" placeholder="操作人姓名" />
      </el-form-item>
      <el-form-item label="日期：" prop="rangeDate">
        <el-date-picker
          v-model="selecteTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item class="btns">
        <el-button v-hasPermi="['sys:log:list']" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button class="reset-btn" type="primary" icon="el-icon-refresh-left" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
        v-loading="loading"
        v-adaptive
        :data="logList"
        height="100%"
        border
      >
        <el-table-column prop="ip" label="源IP" />
        <el-table-column show-overflow-tooltip prop="method" label="请求方法" />
        <el-table-column show-overflow-tooltip prop="params" label="请求参数" />
        <el-table-column prop="operation" label="用户操作" />
        <el-table-column prop="time" label="执行时间" />
        <el-table-column prop="username" label="操作用户名" />
        <el-table-column prop="createDate" label="创建时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createDate | timeFormate }}
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
  </div>
</template>

<script>
import * as that from '@/api/system/SysLogController'
export default {
  name: 'SystemLog',
  data() {
    return {
      selecteTime: null,
      // 分页管理员列表
      logList: [],
      // 所有的角色
      roleListAll: [],
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: '新增',
      // 是否显示弹出层
      open: false,
      // 是否显示日志弹出层
      dialogOpen: false,
      // 查询参数
      roleName: '',
      // visible: undefined
      labelWidth: '100px',
      queryForm: {
        userName: '',
        beginDate: '',
        endDate: ''
      },
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.deptTree.filter(val)
    }
  },
  created() {
    this.getSysLog()
  },
  methods: {
    // 重置查询
    resetQuery() {
      this.queryForm = this.$options.data().queryForm
      this.selecteTime = null
      this.getSysLog(1)
    },
    // 查询按钮
    handleQuery() {
      this.getSysLog(1)
    },
    // 查询系统日志列表
    getSysLog(pageNo) {
      this.loading = true
      this.pagination.pageNo = pageNo || this.pagination.pageNo
      if (this.selecteTime) {
        this.queryForm.beginDate = this.selecteTime[0]
        this.queryForm.endDate = this.selecteTime[1]
      } else {
        this.queryForm.beginDate = ''
        this.queryForm.endDate = ''
      }
      const item = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        param: this.queryForm
      }
      that.sysLogList(item).then(res => {
        this.loading = false
        this.pagination.total = res.total
        this.pagination.pageNo = res.current
        this.pagination.pageSize = res.size
        this.logList = res.records
      })
        .catch(error => { console.log(error) })
    },
    // 分页大小选择
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getSysLog(1)
    },
    // 分页页面跳转
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.getSysLog(val)
    }
  }
}
</script>
<style lang="scss">
@import './css/system.scss';
#systemLog {
  .el-select{
    width: 100%;
  }

}
</style>
