<template>
  <div id="systemMenu" class="app-container">
    <el-form :inline="true">
      <el-form-item label="菜单名称">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.visible" placeholder="菜单状态" clearable size="small">
          <el-option
            v-for="dict in visibleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-hasPermi="['sys:menu:save']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="menuId"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="title" label="菜单名称" :show-overflow-tooltip="true" width="160" />
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template slot-scope="scope">
            <svg-icon icon-class="dashboard" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="60" />
        <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
        <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
        <!-- <el-table-column prop="visible" label="可见" :formatter="visibleFormat" width="80" /> -->
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <!-- <span>{{ parseTime(scope.row.createTime) }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['sys:menu:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-hasPermi="['sys:menu:save']"
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
            >新增</el-button>
            <el-button
              v-hasPermi="['sys:menu:delete']"
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
      <el-drawer :title="title" :visible.sync="open" direction="rtl" size="700px">
        <div class="drawer-content">
          <el-form ref="menuForm" :model="form" size="small" :rules="rules" label-width="100px" label-position="right">
            <el-form-item label="菜单类型" prop="">
              <el-radio-group v-model="form.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">子菜单</el-radio>
                <el-radio :label="2">按钮/权限</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="form.type !== 2">
              <el-form-item label="菜单名称" prop="title">
                <el-input v-model="form.title" placeholder="请输入菜单名称" />
              </el-form-item>
              <el-form-item v-if="form.type === 1" label="上级菜单" prop="parentId">
                <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
                  <el-tree ref="menuListTree" :data="menuList" :props="menuListProps" node-key="menuId" :default-expanded-keys="[0]" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false" @current-change="menuListTreeCurrentChangeHandle" />
                </el-popover>
                <el-input v-model="form.parentTitle" v-popover:menuListPopover :readonly="true" placeholder="请选择父级菜单" />
              </el-form-item>
              <el-form-item label="菜单路径" prop="path">
                <el-input v-model="form.path" placeholder="请输入菜单路径" />
              </el-form-item>
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="form.component" placeholder="请输入前端组件" />
              </el-form-item>
              <el-form-item label="组件路径" prop="name">
                <el-input v-model="form.name" placeholder="请输入前端组件名称" />
              </el-form-item>
              <el-form-item v-show="form.type === 0" label="默认跳转地址" prop="redirect">
                <el-input v-model="form.redirect" placeholder="请输入路由参数redirect" />
              </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
                <el-popover
                  placement="bottom-start"
                  width="460"
                  trigger="click"
                  @show="$refs['iconSelect'].reset()"
                >
                  <IconSelect ref="iconSelect" @selected="selected" />
                  <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                    <svg-icon
                      v-if="form.icon"
                      slot="prefix"
                      :icon-class="form.icon"
                      class="el-input__icon"
                      style="height: 32px;width: 16px;"
                    />
                    <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                  </el-input>
                </el-popover>
              </el-form-item>
              <el-form-item label="排序" prop="orderNum">
                <el-input-number v-model="form.orderNum" :min="0" :max="100" />
              </el-form-item>
              <el-form-item label="是否缓存" prop="noCache">
                <el-switch v-model="form.noCache" active-color="#409EFF" inactive-color="#BFBFBF" />
              </el-form-item>
            </div>
            <div v-show="form.type == 2">
              <el-form-item label="按钮/权限" prop="title">
                <el-input v-model="form.title" placeholder="请选择菜单名称" />
              </el-form-item>
              <el-form-item label="上级菜单" :prop="form.type == 0 ? '': 'parentId'">
                <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
                  <el-tree ref="menuListTree" :data="menuList" :props="menuListProps" node-key="menuId" :default-expanded-keys="[0]" :default-expand-all="false" :highlight-current="true" :expand-on-click-node="false" @current-change="menuListTreeCurrentChangeHandle" />
                </el-popover>
                <el-input v-model="form.parentTitle" v-popover:menuListPopover :readonly="true" placeholder="请选择父级菜单" />
              </el-form-item>
              <el-form-item label="菜单路径" prop="">
                <el-input v-model="form.path" placeholder="请选择菜单名称" />
              </el-form-item>
              <el-form-item label="权限标识" prop="">
                <el-input v-model="form.perms" placeholder="多个用逗号隔开，如: sys:menu:save,sys:menu:delete" />
              </el-form-item>
            </div>
          </el-form>
          <div class="demo-drawer__footer" style="text-align:right;">
            <el-button size="medium" type="default" @click="cancel">取 消</el-button>
            <el-button size="medium" type="primary" @click="submitForm('menuForm')">确 认</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import {
  getMenu,
  getMenuInfo,
  delMenu,
  addMenu,
  updateMenu
} from '@/api/system/menu'
import router from '@/router'
import store from '@/store'
import IconSelect from '@/components/IconSelect'

export default {
  name: 'SystemMenu',
  components: { IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 添加、修改加载状态
      dialogLoading: false,
      // 菜单表格树数据
      menuList: [],
      menuListProps: {
        label: 'title',
        children: 'children'
      },
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '新增',
      // 是否显示弹出层
      open: false,
      // 菜单状态数据字典
      visibleOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      labelWidth: '100px',
      // 表单参数
      form: {
        title: '',
        type: 0,
        parentId: 0,
        path: '',
        component: '',
        redirect: '',
        icon: '',
        orderNum: '',
        noCache: false,
        parentTitle: 'title'
      },
      // 表单校验
      rules: {
        title: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '父级菜单不能为空', trigger: 'current-change' }
        ],
        component: [
          { required: true, message: '组件名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    /** 查询菜单列表 */
    getMenuList() {
      this.loading = true
      getMenu()
        .then((response) => {
          this.loading = false
          this.menuList = response
        })
        .catch(() => {
          this.loading = false
        })
    },
    menuListTreeCurrentChangeHandle(event) {
      this.form.parentId = event.menuId
      this.form.parentTitle = event.title
      console.log(event)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = this.$options.data().form
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getMenuList()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.open = true
      this.title = '新增'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = '编辑'
      this.reset()
      getMenuInfo(row.menuId).then(res => {
        console.log(res)
        this.open = true
        this.form = res
      })
    },
    /** 提交按钮 */
    submitForm(forName) {
      this.$refs[forName].validate((valid) => {
        if (valid) {
          this.form.noCache = this.form.noCache ? 1 : 0
          if (this.title === '新增') {
            console.log('新增')
            console.log(this.form)
            addMenu(this.form).then(res => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.open = false
              this.getMenuList()
            })
          } else if (this.title === '编辑') {
            console.log('编辑')
            // this.form.noCache = this.form.noCache ? 1 : 0
            console.log(this.form)
            updateMenu(this.form).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.open = false
              this.getMenuList()
              // this.$router.go(0)
              store.dispatch('GenerateRoutes').then(accessRoutes => {
                router.addRoutes(accessRoutes) // 动态添加可访问路由表
              })
            })
          }
        } else {
          console.log('error')
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      this.$confirm(
        '是否确认删除名称为"' + row.title + '"的菜单项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          console.log(row.menuId)
          delMenu(row.menuId).then(() => {
            console.log('删除成功')
            this.getMenuList()
          })
        })
        .catch(function() {})
    },
    handleClose() {}
  }
}
</script>
<style lang="scss">
$defalt-color:#e8e8e8;
.el-popover {
    width: 408px !important;
    max-height: 200px;
    overflow: auto;
}
#systemMenu {
  .el-form-item__label{
    color: #333333;
    font-weight: 400;
  }
	.drawer {
		.el-drawer__header {
			padding: 10px 20px;
			border-bottom: 1px solid $defalt-color;
			font-size: 20px;
			color: #333333;
			:focus {
				outline: 0;
			}
		}
		.drawer-content {
      width: 90%;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 20px 15px;
      border: 1px solid $defalt-color;
      .meun-select{
        width: 75%;
        margin: 0 auto;
      }
      .el-form{
        width: 85%;
        margin: 0 auto;
        margin-top: 30px;;
      }
      .el-input{
        // width: 60%;
      }
      .el-input-number{
        .el-input{
          width: 100%;
       }
      }
      .el-form-item--small.el-form-item{
        margin-bottom: 30px;
      }
		}
	}
}
</style>
