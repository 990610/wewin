<!--系统设置-定时任务-->
<template>
  <div id="systemTimer" class="app-container">
    <el-form :inline="true" class="f-query">
      <el-form-item label="任务名称：">
        <el-input
          v-model="queryForm.param"
          placeholder="请输入任务名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item class="btns">
        <el-button class="reset-btn" type="primary" icon="el-icon-refresh-left" size="mini" @click="resetQuery">重置</el-button>
        <el-button v-hasPermi="['sys:schedule:list']" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button v-hasPermi="['sys:schedule:save']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增定时任务</el-button>
        <el-button v-hasPermi="['sys:log:list']" class="add-btn" type="primary" icon="el-icon-date" size="mini" @click="openLog">日志列表</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
        ref="table"
        v-loading="loading"
        :data="jobList"
        height="100%"
        border
        class="table-fixed"
      >
        <el-table-column prop="beanName" label="bean的名称" />
        <el-table-column prop="params" label="参数" />
        <el-table-column prop="cronExpression" label="cron表达式" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status ? '暂停':'正常' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="350">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['sys:schedule:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              v-hasPermi="['sys:schedule:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleStart(scope.row)"
            >启动</el-button>
            <el-button
              v-hasPermi="['sys:schedule:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleStop(scope.row)"
            >停止</el-button>
            <el-button
              v-hasPermi="['sys:schedule:delete']"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
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
    <div class="drawer">
      <el-drawer custom-class="drawer" :append-to-body="true" :title="title" :visible.sync="open" direction="rtl" size="700px" :before-close="drawerClose">
        <div class="drawer-content">
          <el-form ref="drawerForm" :model="form" size="small" :rules="rules" label-width="100px" label-position="right">
            <el-form-item label="任务Id" prop="jobId">
              <el-input v-model="form.jobId" disabled />
            </el-form-item>
            <el-form-item label="bean的名称" prop="beanName">
              <el-input v-model="form.beanName" placeholder="请输入bean的名称" maxlength="20" />
            </el-form-item>
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron表达式" maxlength="20" />
            </el-form-item>
            <el-form-item label="参数" prop="params">
              <el-input v-model="form.params" placeholder="请输入参数" maxlength="20" />
            </el-form-item>
            <el-form-item label="任务备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入任务备注" maxlength="20" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio v-model="form.status" label="0">正常</el-radio>
              <el-radio v-model="form.status" label="1">暂停</el-radio>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer" style="text-align:right;">
            <el-button size="medium" type="default" @click="cancel">取 消</el-button>
            <el-button size="medium" type="primary" @click="submitForm('drawerForm')">确 认</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
    <div class="dialog f-dialog">
      <el-dialog
        title="日志列表"
        :visible.sync="dialog.open"
        width="1000px"
      >
        <div class="search">
          <el-form :inline="true" class="f-query">
            <el-form-item label="bean名称：">
              <el-input v-model="dialog.beanName" size="small" placeholder="操作人姓名" />
            </el-form-item>
            <el-form-item class="btns">
              <el-button class="reset-btn" type="primary" icon="el-icon-refresh-left" size="mini" @click="logRest">重置</el-button>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="logQuery">查询</el-button>
            </el-form-item>
          </el-form>
          <div class="table">
            <el-table
              v-loading="dialog.loading"
              :data="dialog.logList"
              height="404px"
              border
            >
              <el-table-column prop="logId" label="日志ID" />
              <el-table-column prop="beanName" label="bean名称" />
              <el-table-column prop="error" label="失败信息" />
              <el-table-column prop="times" label="耗时" />
              <el-table-column prop="status" label="执行结果">
                <template slot-scope="scope">
                  {{ scope.row.status ? '失败':'成功' }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="200">
                <template slot-scope="scope">
                  {{ scope.row.createTime | timeFormate }}
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                background
                :current-page="dialog.pagination.pageNo"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="dialog.pagination.pageSize"
                layout="total, prev, pager, next, sizes"
                :total="dialog.pagination.total"
                @size-change="dialogHandleSizeChange"
                @current-change="dialogHandleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as that from '@/api/system/JobController'
import { dateFormatIE } from '@/utils/index'
export default {
  name: 'SystemTimer',
  filters: {
    timeFormate: function(value) {
      return dateFormatIE(value)
    }
  },
  data() {
    return {
      // 分页管理员列表
      jobList: [],
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
        param: ''
      },
      // 表单参数
      form: {
        jobId: '',
        beanName: '',
        cronExpression: '',
        params: '',
        remark: '',
        status: '0'
      },
      // 表单校验
      rules: {
        beanName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: 'cronExpression表达式不能为空', trigger: 'blur' }
        ]

      },
      dialog: {
        open: false,
        beanName: '',
        logList: [],
        loading: false,
        pagination: {
          pageNo: 1,
          pageSize: 5,
          total: 0
        }
      },
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // table 选择
      multipleSelection: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.deptTree.filter(val)
    }
  },
  created() {
    this.getJobList()
  },
  methods: {
    // 重置查询
    resetQuery() {
      this.queryForm = this.$options.data().queryForm
      this.getJobList(1)
    },
    // 查询按钮
    handleQuery() {
      this.getJobList(1)
    },
    // 查询角色列表
    getJobList(pageNo) {
      this.loading = true
      let item = {}
      item = {
        pageNo: pageNo || this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        param: this.queryForm.param
      }
      that.jobList(item).then(res => {
        this.loading = false
        this.pagination.total = res.total
        this.pagination.pageNo = res.current
        this.pagination.pageSize = res.size
        this.jobList = res.records
        this.$nextTick(() => {
          this.$refs.table.doLayout()
          console.log(1)
        })
      })
        .catch(error => { console.log(error) })
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    // 表单重置
    reset() {
      this.form = this.$options.data().form
      setTimeout(() => {
        this.$refs.drawerForm.clearValidate()
      }, 0)
    },
    // 新增按钮操作
    handleAdd(row) {
      this.open = true
      this.title = '新增'
      this.reset()
    },
    // 修改按钮操作
    handleUpdate(row) {
      this.title = '编辑'
      this.open = true
      this.reset()
      this.form = row
      this.form.status = this.form.status + ''
      console.log(this.form)
    },
    // 提交按钮
    submitForm(forName) {
      this.$refs[forName].validate((valid) => {
        if (valid) {
          if (this.title === '新增') {
            that.jobSave(this.form).then(res => {
              this.open = false
              this.msgSuccess('新增成功')
              this.getJobList(1)
            })
              .catch(error => { console.log(error) })
          } else if (this.title === '编辑') {
            that.jobUpdate(this.form).then(res => {
              this.open = false
              this.msgSuccess('编辑成功')
              this.getJobList()
            })
              .catch(error => { console.log(error) })
          }
        } else {
          console.log('error')
        }
      })
    },
    // 删除按钮操作
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.beanName + '的定时任务?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          that.jobDeleteJobId({ jobId: row.jobId }).then(res => {
            this.msgSuccess('删除成功')
            this.getJobList(1)
          })
            .catch(error => { console.log(error) })
        })
        .catch(function() {})
    },
    handleStart(row) {
      that.jobStart({ jobId: row.jobId }).then(res => {
        this.getJobList()
        this.msgSuccess('启动成功')
      })
        .catch(error => { console.log(error) })
    },
    handleStop(row) {
      that.jobStop({ jobId: row.jobId }).then(res => {
        this.getJobList()
        this.msgSuccess('停止成功')
      })
        .catch(error => { console.log(error) })
    },
    // 分页大小选择
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getJobList(1)
    },
    // 分页页面跳转
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.getJobList(val)
    },
    // 关闭侧面弹出框
    drawerClose() {
      this.open = false
      this.reset()
    },
    // 弹出框下拉树节点选择
    deptListTreeCurrentChangeHandle(event) {
      this.form.deptId = event.deptId
      this.form.deptName = event.name
      this.filterText = ''
    },
    deptListTreeQueryChange(event) {
      this.queryForm.deptId = event.deptId
      this.queryForm.deptName = event.name
      this.filterText = ''
    },
    // 下拉树节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /** ************************日志列表*********************************************** */
    // 打开日志列表
    openLog() {
      this.dialog.open = true
      this.getLoglist(1)
    },
    logQuery() {
      this.getLoglist(1)
    },
    // 日志列表分页查询
    getLoglist(pageNo) {
      this.dialog.loading = true
      let item = {}
      item = {
        pageNo: pageNo || this.dialog.pagination.pageNo,
        pageSize: this.dialog.pagination.pageSize,
        param: this.dialog.beanName
      }
      console.log(item)
      that.sysScheduleLogList(item).then(res => {
        this.dialog.loading = false
        this.dialog.pagination.total = res.total
        this.dialog.pagination.pageNo = res.current
        this.dialog.pagination.pageSize = res.size
        this.dialog.logList = res.records
      })
        .catch(error => { this.dialog.loading = false; console.log(error) })
    },
    // 日志重置查询
    logRest() {
      this.dialog.beanName = ''
      this.getLoglist(1)
    },
    // 分页大小选择
    dialogHandleSizeChange(val) {
      this.dialog.pagination.pageSize = val
      this.getLoglist(1)
    },
    // 分页页面跳转
    dialogHandleCurrentChange(val) {
      this.dialog.pagination.pageNo = val
      this.getLoglist(val)
    }
  }
}
</script>
<style lang="scss">
@import './css/system.scss';
.el-popover {
    max-height: 400px;
    overflow: auto;
    .el-tree{
      max-height: 320px;
      overflow: auto;
    }
}
#systemTimer {
  height: 100%;
  .table{
    height: calc(100% - 96px);

  }
  .el-select{
    width: 100%;
  }
  .dialog{
    .search{
      .el-input__inner{
        height: 32px;
        line-height: 32px;
      }
    }
  }
}
</style>
