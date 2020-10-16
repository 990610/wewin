<!--系统设置-菜单管理-->
<template>
  <div id="systemMenu" class="app-container">
    <el-form :inline="true" class="f-query">
      <el-form-item>
        <el-button
          v-hasPermi="['sys:menu:save']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          style="border-radius:100px;"
          @click="handleAdd(0)"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="menuId"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        height="100%"
      >
        <el-table-column prop="title" label="菜单名称" :show-overflow-tooltip="true" width="160" />
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon || ''" />
          </template>
        </el-table-column>
        <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
        <el-table-column prop="component" label="组件" :show-overflow-tooltip="true" />
        <el-table-column prop="path" label="路径" :show-overflow-tooltip="true" />
        <el-table-column prop="orderNum" label="排序" width="100" />
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['sys:menu:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
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
      <el-drawer custom-class="drawer" :append-to-body="true" :title="title" :visible.sync="open" direction="rtl" size="700px">
        <div class="drawer-content">
          <el-form
            ref="drawerForm"
            :model="form"
            size="small"
            :rules="rules"
            label-width="140px"
            label-position="right"
          >
            <el-form-item label="菜单类型" prop>
              <el-radio-group v-model="form.type" @change="typeChange">
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
                <el-popover ref="menuListPopover" width="361" placement="bottom-start" trigger="click">
                  <el-tree
                    ref="menuListTree"
                    :data="menuList"
                    :props="menuListProps"
                    node-key="menuId"
                    :default-expanded-keys="[0]"
                    :default-expand-all="false"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    @current-change="menuListTreeCurrentChangeHandle"
                  />
                </el-popover>
                <el-input
                  v-model="form.parentTitle"
                  v-popover:menuListPopover
                  :readonly="true"
                  placeholder="请选择父级菜单"
                />
              </el-form-item>
              <el-form-item label="菜单路径" prop="path">
                <el-input v-model="form.path" placeholder="请输入菜单路径" />
              </el-form-item>
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="form.component" placeholder="请输入前端组件：Layout" />
              </el-form-item>
              <el-form-item label="组件名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入前端组件名称" />
              </el-form-item>
              <el-form-item v-show="form.type === 0" label="默认跳转地址" prop="redirect">
                <el-input v-model="form.redirect" placeholder="请输入路由参数redirect" />
              </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
                <el-popover
                  placement="bottom-start"
                  width="361"
                  trigger="click"
                  @show="$refs['iconSelect'].reset()"
                >
                  <IconSelect ref="iconSelect" @selected="selected" />
                  <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标（可输入element图标）">
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
              <el-form-item label="权限标识" prop="perms">
                <el-input v-model="form.perms" placeholder="多个用逗号隔开，如: sys:menu:save,sys:menu:delete" />
              </el-form-item>
              <el-form-item label="排序" prop="orderNum">
                <el-input-number v-model="form.orderNum" :min="0" :max="100" />
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="是否切换刷新" prop="noCache">
                    <el-switch v-model="form.noCache" active-color="#409EFF" inactive-color="#BFBFBF" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否显示根路由" prop="noCache">
                    <el-switch v-model="form.alwaysShow" active-color="#409EFF" inactive-color="#BFBFBF" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否显示到面包屑" prop="noCache">
                    <el-switch v-model="form.breadcrumb" active-color="#409EFF" inactive-color="#BFBFBF" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否固定顶部导航栏" prop="noCache">
                    <el-switch v-model="form.affix" active-color="#409EFF" inactive-color="#BFBFBF" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-show="form.type == 2">
              <el-form-item label="按钮/权限" prop="title">
                <el-input v-model="form.title" placeholder="请选择菜单名称" />
              </el-form-item>
              <el-form-item label="上级菜单" :prop="form.type == 0 ? '': 'parentId'">
                <el-popover ref="menuListPopover2" placement="bottom-start" trigger="click">
                  <el-tree
                    ref="menuListTree"
                    :data="menuList"
                    :props="menuListProps"
                    node-key="menuId"
                    :default-expanded-keys="[0]"
                    :default-expand-all="false"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    @current-change="menuListTreeCurrentChangeHandle"
                  />
                </el-popover>
                <el-input
                  v-model="form.parentTitle"
                  v-popover:menuListPopover2
                  :readonly="true"
                  placeholder="请选择父级菜单"
                />
              </el-form-item>
              <el-form-item label="菜单路径" prop>
                <el-input v-model="form.path" placeholder="请选择菜单名称" />
              </el-form-item>
              <el-form-item label="权限标识" prop>
                <el-input v-model="form.perms" placeholder="多个用逗号隔开，如: sys:menu:save,sys:menu:delete" />
              </el-form-item>
            </div>
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
import { sysMenuList, sysMenuInfoMenuId, sysMenuSave, sysMenuDeleteMenuId, sysMenuUpdate } from '@/api/system/SysMenuController'
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
      // visible: undefined
      labelWidth: '100px',
      // 表单参数
      form: {
        title: '',
        type: 0,
        parentId: 0,
        path: '',
        name: '',
        component: '',
        redirect: '',
        icon: '',
        orderNum: '',
        noCache: true,
        alwaysShow: false,
        breadcrumb: true,
        affix: false,
        parentTitle: ''
      },
      // 表单校验
      rules: {
        title: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        parentId: [
          {
            required: true,
            message: '父级菜单不能为空',
            trigger: 'current-change'
          }
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
    // 表单重置
    reset() {
      this.form = this.$options.data().form
      setTimeout(() => {
        this.$refs.drawerForm.clearValidate()
      }, 0)
    },
    /** 查询菜单列表 */
    getMenuList() {
      this.loading = true
      sysMenuList()
        .then((response) => {
          this.loading = false
          this.menuList = response
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 菜单下拉列表选择
    menuListTreeCurrentChangeHandle(event) {
      this.form.parentId = event.menuId
      this.form.parentTitle = event.title
      console.log(event)
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.open = true
      this.title = '新增'
      this.reset()
      console.log(row)
      if (!row) {
        this.form.type = 0
        this.form.component = 'Layout'
        this.form.redirect = 'noRedirect'
      } else {
        this.form.type = (row.menuId && row.parentId === 0 ? 1 : 2)
        this.form.parentTitle = row.title
        this.form.parentId = row.menuId
        // this.open = true
        setTimeout(() => {
          this.menuListTreeSetCurrentNode()
        }, 0)
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = '编辑'
      this.reset()
      sysMenuInfoMenuId({ menuId: row.menuId }).then((res) => {
        this.open = true
        this.form = res
        this.form.noCache = !!this.form.noCache
        this.form.alwaysShow = !!this.form.alwaysShow
        this.form.breadcrumb = !!this.form.breadcrumb
        this.form.affix = !!this.form.affix
        console.log(this.form)
        setTimeout(() => {
          if (this.form.parentId !== 0) {
            this.menuListTreeSetCurrentNode()
          }
        }, 0)
      })
    },
    // 部门树设置当前选中节点
    menuListTreeSetCurrentNode() {
      console.log(this.form.parentId)
      this.$refs.menuListTree.setCurrentKey(this.form.parentId)
      this.form.parentTitle = (this.$refs.menuListTree.getCurrentNode() || {})['title']
    },
    // 提交按钮
    submitForm(forName) {
      this.$refs[forName].validate((valid) => {
        if (valid) {
          this.form.noCache = this.form.noCache ? 1 : 0
          this.form.alwaysShow = this.form.alwaysShow ? 1 : 0
          this.form.breadcrumb = this.form.breadcrumb ? 1 : 0
          this.form.affix = this.form.affix ? 1 : 0
          if (this.title === '新增') {
            console.log('新增')
            console.log(this.form)
            sysMenuSave(this.form).then((res) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getMenuList()
            })
          } else if (this.title === '编辑') {
            console.log('编辑')
            console.log(this.form)
            sysMenuUpdate(this.form).then((res) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.freshRouter()
            })
          }
        } else {
          console.log('error')
        }
      })
    },
    // 删除按钮操作
    handleDelete(row) {
      console.log(row)
      this.$confirm('是否确认删除名称为"' + row.title + '"的菜单项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sysMenuDeleteMenuId({ menuId: row.menuId }).then(() => {
            this.freshRouter()
          })
        })
        .catch(function() {})
    },
    // 修改菜单后刷新路由
    freshRouter() {
      this.getMenuList()
      store.dispatch('GenerateRoutes').then((accessRoutes) => {
        router.addRoutes(accessRoutes) // 动态添加可访问路由表
      })
    },
    typeChange(e) {
      if (e === 2) {
        this.form.parentId = this.form.menuId
        this.form.parentTitle = this.form.title
        this.form.redirect = undefined
      }
      if (e === 1) {
        this.form.redirect = undefined
      }
    }
  }
}
</script>
<style lang="scss">
@import "./css/system.scss";
.el-popover {
	max-height: 200px;
	overflow: auto;
}
#systemMenu {
	height: 100%;
	.table {
		height: calc(100% - 70px);
	}
}
</style>
