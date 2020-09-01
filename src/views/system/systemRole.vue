<!--系统设置-角色管理-->
<template>
  <div id="systemRole" class="app-container">
    <el-form :inline="true" class="f-query">
      <el-form-item label="角色名称：">
        <el-input
          v-model="roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item class="btns">
        <el-button class="reset-btn" type="primary" icon="el-icon-refresh-left" size="mini" @click="resetQuery">重置</el-button>
        <el-button v-hasPermi="['sys:role:list']" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button v-hasPermi="['sys:role:save']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增角色</el-button>
        <!-- <el-button v-hasPermi="['sys:role:save']" class="add-btn" type="primary" icon="el-icon-download" size="mini" @click="handleAdd">导出角色</el-button> -->
        <el-button v-show="multipleSelection.length > 0" v-hasPermi="['sys:role:delete']" type="danger" icon="el-icon-delete" size="mini" @click="deleteMore">批量删除</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <table-total :selected-num="multipleSelection.length" :clear="clearMul" />
      <el-table
        ref="table"
        v-loading="loading"
        :data="roleList"
        height="100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="index" type="index" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleId" label="角色编码" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.createTime | timeFormate }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="400" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" width="250" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['sys:role:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              v-hasPermi="['sys:role:delete']"
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
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色名称" maxlength="20" />
            </el-form-item>
            <el-form-item label="角色备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 6}" maxlength="200" placeholder="请输入角色备注" />
            </el-form-item>
            <el-form-item label="权限" prop="">
              <el-tree
                ref="menuTree"
                class="menutree"
                :data="menuList"
                show-checkbox
                node-key="menuId"
                :default-expanded-keys="[2, 3]"
                :props="menuListProps"
              />
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
import * as that from '@/api/system/SysRoleController'
import { sysMenuList } from '@/api/system/SysMenuController'
import { dateFormatIE } from '@/utils/index'
import tableTotal from '@/components/tabelTatol/index'
export default {
  name: 'SystemRole',
  filters: {
    timeFormate: function(value) {
      return dateFormatIE(value)
    }
  },
  components: {
    tableTotal
  },
  data() {
    return {
      // 分页角色列表
      roleList: [],
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 下拉树配置
      menuListProps: {
        label: 'title',
        children: 'children'
      },
      // 弹出层标题
      title: '新增',
      // 是否显示弹出层
      open: false,
      // 查询参数
      roleName: '',
      // visible: undefined
      labelWidth: '100px',
      // 表单参数
      form: {
        roleName: '',
        remark: ''
      },
      // 表单校验
      rules: {
        roleId: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '角色备注不能为空', trigger: 'blur' }
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
  created() {
    console.log('角色管理')
    this.getRoleList()
    // 获取菜单下拉树
    sysMenuList().then(res => { this.menuList = res })
  },
  methods: {
    // 重置查询
    resetQuery() {
      this.roleName = ''
      this.getRoleList(1)
    },
    // 查询按钮
    handleQuery() {
      this.getRoleList(1)
    },
    // 查询角色列表
    getRoleList(pageNo) {
      this.loading = true
      let item = {}
      item = {
        pageNo: pageNo || this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        param: this.roleName
      }
      that.sysRoleList(item).then(res => {
        this.loading = false
        this.pagination.total = res.total
        this.pagination.pageNo = res.current
        this.pagination.pageSize = res.size
        this.roleList = res.records
        console.log(res)
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
      this.$refs.menuTree.setCheckedKeys([])
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
      const roleId = row.roleId
      this.form.roleId = roleId
      this.form.roleName = row.roleName
      this.form.remark = row.remark
      that.sysRoleInfoRoleId({ roleId }).then(res => {
        this.$refs.menuTree.setCheckedKeys(res.menuIdList)
      })
        .catch(error => { console.log(error) })
    },
    // 提交按钮
    submitForm(forName) {
      this.$refs[forName].validate((valid) => {
        if (valid) {
          const menuIdList = this.$refs.menuTree.getCheckedKeys()
          const item = {
            remark: this.form.remark,
            roleId: this.form.roleId,
            roleName: this.form.roleName,
            menuIdList
          }
          if (this.title === '新增') {
            that.sysRoleSave(item).then(res => {
              this.open = false
              this.msgSuccess('新增成功')
              this.getRoleList(1)
            })
              .catch(error => { console.log(error) })
          } else if (this.title === '编辑') {
            that.sysRoleUpdate(item).then(res => {
              this.open = false
              this.msgSuccess('编辑成功')
              this.getRoleList()
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
        '是否确认删除名称为"' + row.roleName + '的角色?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          console.log(row.roleName)
          that.sysRoleDelete([row.roleId]).then(res => {
            this.msgSuccess('删除成功')
            this.getRoleList(1)
          })
            .catch(error => { console.log(error) })
        })
        .catch(function() {})
    },
    // 批量删除操作
    deleteMore() {
      this.$confirm(
        '是否确认批量删除角色?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const roleIdList = []
          for (const item of this.multipleSelection) {
            roleIdList.push(item.roleId)
          }
          that.sysRoleDelete(roleIdList).then(res => {
            this.msgSuccess('删除成功')
            this.getRoleList(1)
          })
            .catch(error => { console.log(error) })
        })
        .catch(function() {})
    },
    // 分页大小选择
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getRoleList(1)
    },
    // 分页页面跳转
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.getRoleList(val)
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
    }
  }
}
</script>
<style lang="scss">
@import './css/system.scss';
.el-popover {
    width: 408px !important;
    max-height: 200px;
    overflow: auto;
}
#systemRole {
  height: 100%;
  .table{
    height: calc(100% - 151px);

  }
}
</style>
