<!--系统设置-部门管理-->
<template>
  <div id="departmanet" class="app-container">
    <el-form :inline="true" class="f-query">
      <el-form-item class="btns" style="float:left;">
        <el-button v-hasPermi="['sys:dept:save']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增部门</el-button>
        <el-button v-show="multipleSelection.length > 0" v-hasPermi="['sys:dept:delete']" type="danger" icon="el-icon-delete" size="mini" @click="deleteMore">批量删除</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="deptList"
        height="100%"
        border
        row-key="deptId"
        :default-expand-all="false"
        :tree-props="{children: 'childDepts', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="deptId" label="部门Id" />
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="parentName" label="上级部门" />
        <el-table-column prop="orderNum" label="排序" />
        <el-table-column label="操作" align="center" width="250" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['sys:dept:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              v-hasPermi="['sys:dept:delete']"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="drawer">
      <el-drawer :title="title" :visible.sync="open" direction="rtl" size="700px" :before-close="drawerClose">
        <div class="drawer-content">
          <el-form ref="roleForm" :model="form" size="small" :rules="rules" label-width="100px" label-position="right">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入用户名" maxlength="20" />
            </el-form-item>
            <el-form-item label="上级部门" prop="dept">
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
                  :default-expanded-keys="[form.parentId]"
                  :filter-node-method="filterNode"
                  @current-change="deptListTreeCurrentChangeHandle"
                />
              </el-popover>
              <el-input
                v-model="form.parentName"
                v-popover:deptListPopover
                :readonly="true"
                placeholder="请选择部门"
              />
            </el-form-item>
            <el-form-item label="排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" :min="0" :max="100" />
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
import * as that from '@/api/system/SysDeptController'
export default {
  name: 'Department',
  data() {
    return {
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
      // form表单label宽度
      labelWidth: '100px',
      // 表单参数
      form: {
        deptId: '',
        name: '',
        parentName: '',
        parentId: '',
        orderNum: ''
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],

        orderNum: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
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
    this.getDeptList()
  },
  methods: {
    // 表单重置
    reset() {
      this.form = this.$options.data().form
    },
    getDeptList() {
      that.sysDeptList().then(res => {
        this.loading = false
        this.deptList = res
      })
        .catch(error => {
          this.loading = false
          console.log(error)
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
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
      this.form.deptId = row.deptId
      this.form.parentId = row.parentId
      this.form.name = row.name
      this.form.orderNum = row.orderNum
      setTimeout(() => {
        this.deptTreeSetCurrentNode()
      }, 0)
    },
    // 部门树设置当前选中节点
    deptTreeSetCurrentNode() {
      console.log(this.form.parentId)
      this.$refs.deptTree.setCurrentKey(this.form.parentId)
      this.form.parentName = (this.$refs.deptTree.getCurrentNode() || {})['name']
    },
    // 提交按钮
    submitForm(forName) {
      this.$refs[forName].validate((valid) => {
        if (valid) {
          delete (this.form['deptName'])
          if (this.title === '新增') {
            that.sysDeptSave(this.form).then(res => {
              this.open = false
              this.msgSuccess('新增成功')
              this.getDeptList()
            })
              .catch(error => { console.log(error) })
          } else if (this.title === '编辑') {
            that.sysDeptUpdate(this.form).then(res => {
              this.open = false
              this.msgSuccess('编辑成功')
              this.getDeptList()
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
        '是否确认删除名称为"' + row.name + '的部门?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          that.sysDeptDelete([row.userId]).then(res => {
            this.msgSuccess('删除成功')
            this.getDeptList()
          })
            .catch(error => { console.log(error) })
        })
        .catch(function() {})
    },
    // 批量删除操作
    deleteMore() {
      this.$confirm(
        '是否确认批量删除机构?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const deptIdList = []
          for (const item of this.multipleSelection) {
            deptIdList.push(item.deptId)
          }
          that.sysDeptDelete(deptIdList).then(res => {
            this.msgSuccess('删除成功')
            this.getDeptList()
          })
            .catch(error => { console.log(error) })
        })
        .catch(function() {})
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
      this.form.parentId = event.deptId
      this.form.parentName = event.name
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
#departmanet {
  height: 100%;
  .table{
    height: calc(100% - 96px);

  }
  .el-select{
    width: 100%;
  }
}
</style>
