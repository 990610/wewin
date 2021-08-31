<!--系统设置-角色管理-->
<template>
    <div id="system-role">
        <!-- 表格条件筛选 -->
        <table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="角色名称：">
                <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" clearable size="medium" />
            </el-form-item>
        </table-query>

        <!-- 表格容器 -->
        <table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn">
                <el-button v-hasPermi="['sys:role:save']" type="primary" icon="el-icon-plus" size="medium" @click="handleAdd">新增角色</el-button>
                <el-button v-hasPermi="['sys:role:delete']" type="danger" size="medium" v-show="dataListSelections.length > 0" @click="handleDelete">批量删除</el-button>
            </div>
            <div slot="content">
                <!-- 自定义列 -->
                <table-select :selectedNum="dataListSelections.length" :table-line="tableLine" @refresh="refreshLine" :clear="clearMul"></table-select>

                <!-- 表格内容 -->
                <el-table ref="table" v-adaptive="{ type: 'table' }" v-loading="loading" :data="dataList" height="100%" @selection-change="selectionChangeHandle">
                    <el-table-column type="selection" width="46" />
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column
                        :sortable="item.prop == 'roleName' || item.prop == 'createdTime'"
                        v-for="item in tableLineSelect"
                        :key="JSON.stringify(item)"
                        :width="item.width"
                        :label="item.label"
                        :prop="item.prop"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'createdTime'"> {{ scope.row.createdTime | timeFormate }}</span>
                            <span v-else> {{ scope.row[item.prop] ? scope.row[item.prop] : "—" }}</span>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right" v-if="checkPermissions(['sys:role:update', 'sys:role:delete'])">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button v-hasPermi="['sys:role:update']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                                <el-button v-hasPermi="['sys:role:delete']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </table-box>

        <!-- 新增/修改 角色 -->
        <div class="f-dialog add-role">
            <el-dialog v-adaptive="{ type: 'dialog' }" :title="title" :close-on-click-modal="false" :visible.sync="open" custom-class="table-dialog" width="900px">
                <el-form ref="drawerForm" :model="form" :rules="rules" label-width="130px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="角色名称" prop="roleName">
                                <el-input v-model="form.roleName" placeholder="请输入角色名称" maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="角色备注" prop="remark">
                                <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }" maxlength="99" placeholder="请输入角色备注" resize="none" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="权限" prop="">
                                <el-tree
                                    ref="menuTree"
                                    class="menutree"
                                    :data="menuList"
                                    show-checkbox
                                    node-key="menuId"
                                    :props="menuListProps"
                                    @node-expand="menutreeChange"
                                    @node-collapse="menutreeChange"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span style="display: none">{{ form.resizeTemp }}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="default" @click="cancel">取 消</el-button>
                    <el-button size="medium" type="primary" @click="submitForm('drawerForm')">确 认</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import * as that from "@/api/system/system-role-api";
import { sysMenuList } from "@/api/system/system-menu-api";
import { dateFormatIE } from "@/utils/index";
import tableMixin from "@/components/table/mixin/table-mixin";

export default {
    name: "system-role",
    mixins: [tableMixin],
    components: {},
    data() {
        return {
            // 菜单表格树数据
            menuList: [],
            // 下拉树配置
            menuListProps: {
                label: "title",
                children: "children",
            },
            // 弹出层标题
            title: "新增",
            // 是否显示弹出层
            open: false,
            // visible: undefined
            labelWidth: "100px",
            // 表单参数
            form: {
                roleName: "",
                remark: "",
                resizeTemp: "",
            },
            // 表单校验
            rules: {
                roleId: [
                    {
                        required: true,
                        message: "角色编码不能为空",
                        trigger: "blur",
                    },
                ],
                roleName: [
                    {
                        required: true,
                        message: "角色名称不能为空",
                        trigger: "blur",
                    },
                ],
                remark: [
                    {
                        required: true,
                        message: "角色备注不能为空",
                        trigger: "blur",
                    },
                ],
            },

            queryForm: {},
            tableLine: [
                // { label: "角色编码", prop: "roleId" },
                { label: "角色名称", prop: "roleName" },
                { label: "备注", prop: "remark" },
                { label: "创建时间", prop: "createdTime" },
            ],
            tableLineSelect: [],
        };
    },
    created() {
        sysMenuList().then((res) => {
            this.menuList = res;
        });
    },
    mounted() {
        this.tableLineSelect = this.tableLine;
    },
    methods: {
        //权限树组件展开折叠事件
        menutreeChange() {
            this.form.resizeTemp = Math.random();
        },

        // 删除
        handleDelete(row) {
            this.deleteHandle(() => {
                var id = row ? row.roleId : "";
                var ids = id
                    ? [id]
                    : this.dataListSelections.map((item) => {
                          return item.roleId;
                      });
                that.sysRoleDelete(ids)
                    .then((res) => {
                        this.msgSuccess("删除成功");
                        this.getDataList(1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },

        //刷新表格动态列
        refreshLine(line) {
            this.tableLineSelect = this.tableLine.filter((value) => {
                return line.includes(value.label);
            });
            this.$nextTick(() => {
                this.$refs.table.doLayout();
                var funcBtns = document.getElementsByClassName("func-btns");
                for (let i = 0; i < funcBtns.length; i++) {
                    const element = funcBtns[i];
                    element.parentNode.style.width = "230px";
                }
            });
        },

        //清除表格多选
        clearMul() {
            this.$refs.table.clearSelection();
        },

        // 查询列表
        getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryForm.roleName,
            };
            that.sysRoleList(item)
                .then((res) => {
                    this.loading = false;
                    this.pagination.total = res.total;
                    this.pagination.pageNo = res.current;
                    this.pagination.pageSize = res.size;
                    this.dataList = res.records;
                    this.$nextTick(() => {
                        if (!this.$refs.table) return;
                        this.$refs.table.bodyWrapper.scrollTop = 0;
                        this.$refs.table.doLayout();
                    });
                })
                .catch((error) => {
                    this.loading = false;
                    console.log(error);
                });
        },

        // 取消按钮
        cancel() {
            this.open = false;
        },

        // 表单重置
        reset() {
            this.form = this.$options.data().form;
            setTimeout(() => {
                this.$refs.drawerForm.clearValidate();
                this.$refs.menuTree.setCheckedKeys([]);
            }, 0);
        },

        // 新增按钮操作
        handleAdd(row) {
            this.open = true;
            this.title = "新增";
            this.reset();
        },

        // 修改按钮操作
        handleUpdate(row) {
            this.title = "编辑";
            this.open = true;
            const roleId = row.roleId;
            this.form.roleId = roleId;
            this.form.roleName = row.roleName;
            this.form.remark = row.remark;
            that.sysRoleInfoRoleId({ roleId })
                .then((res) => {
                    var idx = res.menuIdList.indexOf(-99999);
                    if (idx !== -1) {
                        res.menuIdList.splice(idx, res.menuIdList.length - idx);
                    }
                    this.$refs.menuTree.setCheckedKeys(res.menuIdList);
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    const menuIdList = this.$refs.menuTree.getCheckedKeys().concat([-99999], this.$refs.menuTree.getHalfCheckedKeys());
                    const item = {
                        remark: this.form.remark,
                        roleId: this.form.roleId,
                        roleName: this.form.roleName,
                        menuIdList,
                    };
                    if (this.title === "新增") {
                        that.sysRoleSave(item)
                            .then((res) => {
                                this.open = false;
                                this.msgSuccess("新增成功");
                                this.getDataList(1);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else if (this.title === "编辑") {
                        that.sysRoleUpdate(item)
                            .then((res) => {
                                this.open = false;
                                this.msgSuccess("编辑成功");
                                this.getDataList();
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                } else {
                    console.log("error");
                }
            });
        },
    },
};
</script>
<style lang="scss"></style>
