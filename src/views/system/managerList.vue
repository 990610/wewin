<!--系统设置-管理员列表-->
<template>
  <div id="systemManagerList" class="app-container">
    <el-form :inline="true" class="f-query clearfix">
      <el-form-item label="用户名：">
        <el-input
          v-model="queryForm.userName"
          placeholder="请输入用户名"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input
          v-model="queryForm.realName"
          placeholder="请输入姓名"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="部门：">
        <el-popover ref="deptListPopoverW" width="150px" class="search-popover" placement="bottom-start" trigger="click">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            style="margin-bottom:10px;"
          />
          <el-tree
            ref="deptTree"
            class="depttree"
            :data="deptList"
            :props="deptListProps"
            node-key="deptId"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @current-change="deptListTreeQueryChange"
          />
        </el-popover>
        <el-input
          v-model="queryForm.deptName"
          v-popover:deptListPopoverW
          :readonly="true"
          placeholder="请选择部门"
          size="small"
          clearable
        /></el-form-item>
      <el-form-item class="btns">
        <el-button class="reset-btn" type="primary" icon="el-icon-refresh-left" size="mini" @click="resetQuery">重置</el-button>
        <el-button v-hasPermi="['sys:manage:list']" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button v-hasPermi="['sys:manage:save']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增用户</el-button>
        <el-button v-show="multipleSelection.length > 0" v-hasPermi="['sys:manage:delete']" type="danger" icon="el-icon-delete" size="mini" @click="deleteMore">批量删除</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <table-total :selected-num="multipleSelection.length" :clear="clearMul" />
      <el-table
        ref="table"
        v-loading="loading"
        :data="managerList"
        height="100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="index" type="index" label="序号" width="50">
          <template scope="scope">
            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex ? '女':'男' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status ? '正常':'禁用' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createTime | timeFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['sys:manage:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              v-hasPermi="['sys:manage:delete']"
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
          <el-form ref="roleForm" :model="form" size="small" :rules="rules" label-width="100px" label-position="right">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名" maxlength="20" />
            </el-form-item>
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入真实姓名" maxlength="20" />
            </el-form-item>
            <el-form-item v-if="title === '新增'" label="密码" prop="password">
              <el-input v-model="form.password" type="password" auto-complete="new-password" placeholder="请输入密码" maxlength="20" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio v-model="form.sex" label="0">男</el-radio>
              <el-radio v-model="form.sex" label="1">女</el-radio>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="20" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="20" />
            </el-form-item>
            <el-form-item label="部门" prop="dept">
              <el-popover ref="deptListPopover" width="408" placement="bottom-start" trigger="click">
                <el-input
                  v-model="filterText"
                  placeholder="输入关键字进行过滤"
                  style="margin-bottom:10px;"
                />
                <el-tree
                  ref="deptTree"
                  class="depttree"
                  :data="deptList"
                  :props="deptListProps"
                  node-key="deptId"
                  :default-expand-all="false"
                  :highlight-current="true"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  @current-change="deptListTreeCurrentChangeHandle"
                />
              </el-popover>
              <el-input
                v-model="form.deptName"
                v-popover:deptListPopover
                :readonly="true"
                placeholder="请选择部门"
              />
            </el-form-item>
            <el-form-item label="角色" prop="roleIdList">
              <el-select v-model="form.roleIdList" multiple clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in roleListAll"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio v-model="form.status" label="1">正常</el-radio>
              <el-radio v-model="form.status" label="0">禁用</el-radio>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer" style="text-align:right;">
            <el-button size="medium" type="default" @click="cancel">取 消</el-button>
            <el-button size="medium" type="primary" @click="submitForm('roleForm')">确 认</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import * as that from '@/api/system/SysUserController'
import { sysDeptList } from '@/api/system/SysDeptController'
import { sysRoleListAll } from '@/api/system/SysRoleController'
import { encode, dateFormatIE } from '@/utils/index'
import tableTotal from '@/components/tabelTatol/index'
export default {
  name: 'ManagerList',
  filters: {
    timeFormate: (value) => {
      return dateFormatIE(value)
    }
  },
  components: {
    tableTotal
  },
  data() {
    return {
      // 分页管理员列表
      managerList: [],
      // 所有的角色
      roleListAll: [],
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      deptList: [],
      // 下拉树配置
      deptListProps: {
        label: 'name',
        children: 'childDepts'
      },
      // 下拉树过滤文字
      filterText: '',
      // 弹出层标题
      title: '新增',
      // 是否显示弹出层
      open: false,
      // 查询参数
      roleName: '',
      // visible: undefined
      labelWidth: '100px',
      queryForm: {
        userName: '',
        realName: '',
        deptId: '',
        deptName: ''
      },
      // 表单参数
      form: {
        userName: '',
        realName: '',
        password: '',
        sex: '0',
        email: '',
        mobile: '',
        roleIdList: [],
        deptName: '',
        status: '1'
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        roleIdList: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        email: [
          { pattern: /^\w+@\w+(\.)\w+$/, message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[0-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
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
    this.getManagerList()
    this.getRoleList()
    this.getDeptList()
  },
  methods: {
    getRoleList() {
      sysRoleListAll().then(res => {
        this.roleListAll = res
      })
        .catch(error => { console.log(error) })
    },
    getDeptList() {
      sysDeptList().then(res => {
        this.deptList = res
      })
        .catch(error => { console.log(error) })
    },
    // 重置查询
    resetQuery() {
      this.queryForm = this.$options.data().queryForm
      this.getManagerList(1)
    },
    // 查询按钮
    handleQuery() {
      this.getManagerList(1)
    },
    // 查询角色列表
    getManagerList(pageNo) {
      this.loading = true
      let item = {}
      item = {
        pageNo: pageNo || this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        param: {
          deptId: this.queryForm.deptId,
          realName: this.queryForm.realName,
          userName: this.queryForm.userName
        }
      }
      that.sysUserPagelist(item).then(res => {
        this.loading = false
        this.pagination.total = res.total
        this.pagination.pageNo = res.current
        this.pagination.pageSize = res.size
        this.managerList = res.records
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
      // this.$refs.menuTree.setCheckedKeys([])
    },
    // 新增按钮操作
    handleAdd(row) {
      this.open = true
      this.title = '新增'
      setTimeout(() => {
        this.reset()
      }, 0)
    },
    // 修改按钮操作
    handleUpdate(row) {
      this.title = '编辑'
      this.open = true
      this.reset()
      delete (this.form['password'])
      this.form.userName = row.userName
      this.form.realName = row.realName
      this.form.sex = row.sex + ''
      this.form.email = row.email
      this.form.status = row.status + ''
      this.form.mobile = row.phone
      this.form.userId = row.userId
      this.form.deptId = row.deptId
      this.form.deptName = row.deptName
      for (const item of row.roles) {
        this.form.roleIdList.push(item.roleId)
      }
    },
    // 提交按钮
    submitForm(forName) {
      this.$refs[forName].validate((valid) => {
        if (valid) {
          delete (this.form['deptName'])
          if (this.title === '新增') {
            this.form.password = encode(this.form.password)
            that.sysUserAdd(this.form).then(res => {
              this.open = false
              this.msgSuccess('新增成功')
              this.getManagerList(1)
            })
              .catch(error => { console.log(error) })
          } else if (this.title === '编辑') {
            that.sysUserEdit(this.form).then(res => {
              this.open = false
              this.msgSuccess('编辑成功')
              this.getManagerList()
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
        '是否确认删除名称为"' + row.userName + '的用户?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          that.sysUserDelete([row.userId]).then(res => {
            this.msgSuccess('删除成功')
            this.getManagerList(1)
          })
            .catch(error => { console.log(error) })
        })
        .catch(function() {})
    },
    // 批量删除操作
    deleteMore() {
      this.$confirm(
        '是否确认批量删除用户?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const userIdList = []
          for (const item of this.multipleSelection) {
            userIdList.push(item.userId)
          }
          that.sysUserDelete(userIdList).then(res => {
            this.msgSuccess('删除成功')
            this.getManagerList(1)
          })
            .catch(error => { console.log(error) })
        })
        .catch(function() {})
    },
    // 分页大小选择
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getManagerList(1)
    },
    // 分页页面跳转
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.getManagerList(val)
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
    clearMul() {
      this.$refs.table.clearSelection()
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
#systemManagerList {
  height: 100%;
  .table{
    height: calc(100% - 141px);

  }
  .el-select{
    width: 100%;
  }
}
</style>
