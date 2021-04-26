<!--系统设置-部门管理-->
<template>
  <div id="departmanet" class="app-container">
    <el-form :inline="true" class="f-query clearfix">
      <el-form-item class="btns" style="float:left;">
        <el-button v-hasPermi="['sys:dept:save']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增部门</el-button>
        <!-- <el-button v-show="multipleSelection.length > 0" v-hasPermi="['sys:dept:delete']" type="danger" icon="el-icon-delete" size="mini" @click="deleteMore">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <div class="content clearfix">
      <div class="content-left">
        <el-input
          v-model="panleFilterText"
          placeholder="输入关键字进行过滤"
          style="margin-bottom:10px;padding:6px"
        />
        <el-tree
          ref="panleDeptTree"
          class="depttree"
          :data="deptList"
          :props="deptListProps"
          node-key="deptId"
          :default-expand-all="true"
          :highlight-current="true"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
        >
          <span slot-scope="{node,data}" class="span-ellipsis">
            <el-tooltip v-if=" node.label.length > 9" popper-class="popperClass" class="item" effect="light" :content="node.label" placement="top-start">
              <span :title="node.label">{{ node.label }}</span>
            </el-tooltip>
            <span v-else :title="node.label">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <!-- <div class="table"> -->
      <el-table
        v-if="shotable"
        ref="table"
        v-loading="loading"
        :data="deptList"
        height="100%"
        border
        row-key="deptId"
        :tree-props="{children: 'childDepts', hasChildren: 'hasChildren'}"
        :expand-row-keys="expandRow"
        highlight-current-row
        @header-dragend="headerDragend"
      >
        <!-- @selection-change="handleSelectionChange" -->
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column prop="deptId" label="部门Id" />
        <el-table-column prop="name" label="部门名称" />
        <!-- <el-table-column prop="parentName" label="上级部门" /> -->
        <el-table-column prop="orderNum" label="排序" />
        <el-table-column label="操作" align="center" width="250">
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
      <!-- </div> -->
    </div>

    <div class="drawer">
      <el-drawer custom-class="drawer" :append-to-body="true" :title="title" :visible.sync="open" direction="rtl" size="700px" :before-close="drawerClose">
        <div class="drawer-content">
          <el-form ref="drawerForm" :model="form" size="small" :rules="rules" label-width="100px" label-position="right">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入部门名称" maxlength="40" />
            </el-form-item>
            <el-form-item ref="parentName" label="上级部门" prop="parentName">
              <el-popover ref="deptListPopover" v-model="showPop" width="408" placement="bottom-start" trigger="click">
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
            <el-button size="medium" type="primary" @click="submitForm('drawerForm')">确 认</el-button>
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
      // 部门表格树数据
      deptList: [],
      // 下拉树配置
      deptListProps: {
        label: 'name',
        children: 'childDepts'
      },
      // 面板机构树选择
      panleFilterText: '',
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
        parentName: [
          { required: true, message: '上级部门不能为空', trigger: 'change' }
        ],
        orderNum: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      },
      showPop: false,
      // table 选择
      multipleSelection: [],
      expandRow: [],
      shotable: true,
      rowMsg: {}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.deptTree.filter(val)
    },
    panleFilterText(val) {
      this.$refs.panleDeptTree.filter(val)
    }
  },
  created() {
    this.getDeptList()
    that.sysDeptList({ deptName: '物联网' }).then(res => {
      console.log(res)
    })
      .catch(error => { console.log(error) })
  },
  methods: {
    // 头部拖动
    headerDragend() {
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    },
    // 表单重置
    reset() {
      this.form = this.$options.data().form
      setTimeout(() => {
        this.$refs.drawerForm.clearValidate()
      }, 0)
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
      this.rules.parentName[0].required = true
      this.reset()
    },
    // 修改按钮操作
    handleUpdate(row) {
      this.title = '编辑'
      this.open = true
      this.reset()
      this.form.deptId = row.deptId
      this.form.parentId = row.parentId
      this.form.name = row.name
      this.form.orderNum = row.orderNum
      if (row.parentId === 0) {
        this.rules.parentName[0].required = false
        this.form.parentName = ''
        this.form.parentId = 0
      } else {
        this.rules.parentName[0].required = true
      }
      setTimeout(() => {
        this.deptTreeSetCurrentNode()
      }, 0)
    },
    // 部门树设置当前选中节点
    deptTreeSetCurrentNode() {
      this.$refs.deptTree.setCurrentKey(this.form.parentId)
      if (this.form.parentId) {
        this.form.parentName = (this.$refs.deptTree.getCurrentNode() || {})['name']
      } else {
        this.$refs.parentName.clearValidate()
      }
    },
    // 提交按钮
    submitForm(forName) {
      this.$refs[forName].validate((valid) => {
        if (valid) {
          if (this.form.deptId === this.form.parentId) {
            this.msgWarning('父级部门不能为本身!')
            return
          }
          const item = {
            deptId: this.form.deptId,
            name: this.form.name,
            parentId: this.form.parentId,
            orderNum: this.form.orderNum
          }
          if (this.title === '新增') {
            that.sysDeptSave(item).then(res => {
              this.open = false
              this.msgSuccess('新增成功')
              this.getDeptList()
            })
              .catch(error => { console.log(error) })
          } else if (this.title === '编辑') {
            that.sysDeptUpdate(item).then(res => {
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
          that.sysDeptDelete([row.deptId]).then(res => {
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
      this.showPop = false
    },
    // 下拉树节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 节点选择
    nodeClick(obj, node, el) {
      this.shotable = false
      this.expandRow = []
      this.getIndex(this.deptList, obj.deptId)
      this.expandRowHandle(node)
    },
    expandRowHandle(item) {
      this.expandRow.push(item.data.deptId.toString())
      if (item.parent.data.deptId) {
        // this.expandRow.push(item.parent.data.deptId.toString())
        this.expandRowHandle(item.parent)
      } else {
        this.$nextTick(() => {
          this.shotable = true
          setTimeout(() => {
            this.$refs.table.setCurrentRow(this.rowMsg)
          }, 0)
        })
      }
    },
    getIndex(item, id) {
      for (const temp of item) {
        if (temp.deptId === id) {
          this.rowMsg = temp
          return
        } else {
          if (temp.childDepts.length > 0) {
            this.getIndex(temp.childDepts, id)
          }
        }
      }
    }

  }
}
</script>
<style lang="scss">
@import './css/system.scss';
.el-popover {
    max-height: 400px;
    overflow-y: hidden;
    .el-tree{
      min-width: 100%;
      max-height: 320px;
      overflow: auto;
      display: inline-block;
    }
}
#departmanet {
  height: 100%;
  .content{
    display: flex;
    position: relative;
    width: 100%;
    height: calc(100% - 62px);
    .content-left{
      min-width: 250px;
      max-width: 350px;
      // width: 20%;
      height: 100%;
      overflow: auto;
      // background: skyblue;
      margin-right: 10px;
      border: 1px solid #EBEEF5;
      border-radius: 5px;
      .span-ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

    }
    // .table{
    //   width: 80%;
    //   height: 100%
    // }
  }

  .el-select{
    width: 100%;
  }
}
</style>
