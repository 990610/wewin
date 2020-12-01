<!--系统设置-数据字典-->
<template>
  <div id="dataDictionary" class="app-container">
    <el-form :inline="true" class="f-query">
      <el-form-item label="字典名称：">
        <el-input
          v-model="queryForm.param"
          placeholder="请输入字典名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item class="btns-l">
        <el-button v-hasPermi="['sys:dict:list']" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button class="reset-btn" type="primary" icon="el-icon-refresh-left" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item class="btns">
        <el-button v-hasPermi="['sys:dict:save']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增字典</el-button>
        <el-button v-hasPermi="['sys:dict:down']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">模板导出</el-button>
        <el-upload
          class="upload-demo"
          :action="url"
          :headers="headers"
          :file-list="fileList"
          name="file"
          :on-success="uploadSuccess"
        >
          <el-button v-hasPermi="['sys:dict:upload']" type="warning" icon="el-icon-upload2" size="mini" @click="handleUpload">字典上传</el-button>
        </el-upload>
        <!-- <el-button v-show="multipleSelection.length > 0" v-hasPermi="['sys:manage:delete']" type="danger" icon="el-icon-delete" size="mini" @click="deleteMore">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
        ref="table"
        v-adaptive
        v-loading="loading"
        :data="dataList"
        height="100%"
        border
        @header-dragend="headerDragend"
      >
        <!-- @selection-change="handleSelectionChange" -->
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column prop="id" label="字典ID" />
        <el-table-column prop="code" label="字典码" />
        <el-table-column prop="name" label="字典名称" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="type" label="字典类型" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['sys:dict:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              v-hasPermi="['sys:dict:delete']"
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
            <el-form-item label="字典Id" prop="id">
              <el-input v-model="form.id" disabled />
            </el-form-item>
            <el-form-item label="字典码" prop="code">
              <el-input v-model="form.code" placeholder="请输入字典码如：0" maxlength="20" />
            </el-form-item>
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入字典名称如：性别" maxlength="20" />
            </el-form-item>
            <el-form-item label="字典类型" prop="type">
              <el-input v-model="form.type" placeholder="请输入字典类型如：sex" maxlength="20" />
            </el-form-item>
            <el-form-item label="字典值" prop="value">
              <el-input v-model="form.value" placeholder="请输入字典值如：男/女" maxlength="20" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" maxlength="20" />
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer" style="text-align:right;">
            <el-button size="medium" type="default" @click="cancel">取 消</el-button>
            <el-button size="medium" type="primary" @click="submitForm('drawerForm')">确 认</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import * as that from '@/api/system/SysDictController'
import { downloadFile } from '@/utils/index'
import { getToken } from '@/utils/auth'
export default {
  name: 'DataDictionary',
  data() {
    return {
      // 分页管理员列表
      dataList: [],
      // 所有的角色
      roleListAll: [],
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: '新增',
      // 是否显示弹出层
      open: false,
      // 查询参数
      roleName: '',
      // visible: undefined
      labelWidth: '100px',
      queryForm: {
        param: ''
      },
      // 表单参数
      form: {
        id: '',
        code: '',
        name: '',
        type: '',
        value: '',
        remark: ''
      },
      // 表单校验
      rules: {
        code: [
          { required: true, message: '字典码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '字典值不能为空', trigger: 'blur' }
        ]

      },
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // table 选择
      multipleSelection: [],
      url: process.env.VUE_APP_BASE_API + '/sys/dict/upload',
      headers: {
        token: getToken()
      },
      fileList: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.deptTree.filter(val)
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 重置查询
    resetQuery() {
      this.queryForm = this.$options.data().queryForm
      this.getDataList(1)
    },
    // 查询按钮
    handleQuery() {
      this.getDataList(1)
    },
    // 查询角色列表
    getDataList(pageNo) {
      this.loading = true
      this.pagination.pageNo = pageNo || this.pagination.pageNo
      const item = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        param: this.queryForm.param
      }
      that.sysDictList(item).then(res => {
        this.loading = false
        this.pagination.total = res.total
        this.pagination.pageNo = res.current
        this.pagination.pageSize = res.size
        this.dataList = res.records
      })
        .catch(error => { this.loading = false; console.log(error) })
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
            that.sysDictSave(this.form).then(res => {
              this.open = false
              this.msgSuccess('新增成功')
              this.getDataList()
            })
              .catch(error => { console.log(error) })
          } else if (this.title === '编辑') {
            that.sysDictUpdate(this.form).then(res => {
              this.open = false
              this.msgSuccess('编辑成功')
              this.getDataList()
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
        '是否确认删除名称为"' + row.name + '的字典?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          that.sysDictDelete([row.id]).then(res => {
            this.msgSuccess('删除成功')
            this.getDataList(1)
          })
            .catch(error => { console.log(error) })
        })
        .catch(function() {})
    },
    // 批量删除操作
    deleteMore() {
      this.$confirm(
        '是否确认批量删除数据字典?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const dictIdList = []
          for (const item of this.multipleSelection) {
            dictIdList.push(item.id)
          }
          that.sysDictDelete(dictIdList).then(res => {
            this.msgSuccess('删除成功')
            this.getDataList(1)
          })
            .catch(error => { console.log(error) })
        })
        .catch(function() {})
    },
    handleExport() {
      that.sysDictDownload().then(res => {
        console.log(res)
        if (res) {
          downloadFile(res, '数据字典导出模板')
        } else {
          this.msgWarning('数据有误')
        }
      })
        .catch(error => { console.log(error) })
    },
    handleUpload() {},
    uploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.msgSuccess('上传成功')
      } else {
        this.msgWarning(response.message)
      }
      this.fileList = []
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    // 头部拖动
    headerDragend() {
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
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
    // 关闭侧面弹出框
    drawerClose() {
      this.open = false
      this.reset()
    },
    // table 批量选择获取
    handleSelectionChange(val) {
      this.multipleSelection = val
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
#dataDictionary {
  .el-select{
    width: 100%;
  }
  .upload-demo{
    float: right;
    margin-left: 10px;
    .el-upload-list__item:first-child{
      margin-top: -3px;
    }
  }
}
</style>
