<!--系统设置-管理员列表-->
<template>
    <div id="system-user">
        <!-- 表格条件筛选 -->
        <table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="用户名：">
                <el-input v-model="queryForm.userName" placeholder="请输入用户名" clearable size="medium" />
            </el-form-item>
            <el-form-item label="姓名：">
                <el-input v-model="queryForm.realName" placeholder="请输入姓名" clearable size="medium" />
            </el-form-item>
            <el-form-item label="部门：" class="treeSelect">
                <!-- <dept-select :deptid.sync="queryForm.deptId" /> -->
                <el-popover ref="deptListQueryPopover" v-model="showQueryDept" width="408" placement="bottom-start" trigger="click">
                    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom: 10px" size="medium" />
                    <el-tree
                        ref="deptTree"
                        class="dept-tree"
                        :data="deptList"
                        :props="deptListProps"
                        node-key="deptId"
                        :default-expand-all="false"
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        @current-change="deptListQueryChangeHandle"
                    />
                </el-popover>
                <el-input v-model="queryForm.deptName" v-popover:deptListQueryPopover :readonly="true" placeholder="请选择部门" size="medium" />
            </el-form-item>
        </table-query>

        <!-- 表格容器 -->
        <table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn">
                <el-button v-hasPermi="['sys:user:save']" type="primary" icon="el-icon-plus" size="medium" @click="handleAdd">新增用户</el-button>
                <el-button v-hasPermi="['sys:user:delete']" type="danger" size="medium" v-show="dataListSelections.length > 0" @click="handleDelete">批量删除</el-button>
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
                    <el-table-column sortable v-for="item in tableLineSelect" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop">
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'sex'"> {{ scope.row.sex ? "女" : "男" }}</span>
                            <span v-else-if="item.prop == 'status'">
                                <template v-if="scope.row.status">
                                    <span class="table-status success">正常</span>
                                </template>
                                <template v-else>
                                    <span class="table-status danger">禁用</span>
                                </template>
                            </span>
                            <span v-copy="{ text: scope.row[item.prop] }" v-else-if="item.prop == 'email'"> {{ scope.row[item.prop] }}</span>
                            <span v-else-if="item.prop == 'roles'"> {{ getRoleName(scope.row) }}</span>
                            <span v-else-if="item.prop == 'createdTime'"> {{ scope.row.createdTime | timeFormate }}</span>
                            <span v-else> {{ scope.row[item.prop] ? scope.row[item.prop] : "—" }}</span>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right" v-if="checkPermissions(['sys:user:update', 'sys:user:reset', 'sys:user:delete'])">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button v-hasPermi="['sys:user:update']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                                <el-button v-hasPermi="['sys:user:reset']" size="mini" type="text" icon="el-icon-refresh-right" @click="handleRestPassword(scope.row)">重置密码</el-button>
                                <el-button v-hasPermi="['sys:user:delete']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </table-box>

        <!-- 新增/修改 用户 -->
        <div class="f-dialog add-user">
            <el-dialog v-adaptive="{ type: 'dialog' }" :title="title" :close-on-click-modal="false" :visible.sync="open" custom-class="table-dialog" width="900px">
                <el-form ref="drawerForm" :model="form" :rules="rules" label-width="130px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="用户名" prop="userName">
                                <el-input v-model="form.userName" placeholder="请输入用户名" maxlength="40" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="真实姓名" prop="realName">
                                <el-input v-model="form.realName" placeholder="请输入真实姓名" maxlength="40" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="title === '新增'" label="密码" prop="password">
                                <el-input v-model.trim="form.password" type="password" auto-complete="new-password" placeholder="请输入密码" maxlength="16" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <el-radio v-model="form.sex" label="0">男</el-radio>
                                <el-radio v-model="form.sex" label="1">女</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号" prop="mobile">
                                <el-input v-model="form.mobile" maxlength="11" placeholder="请输入手机号" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item ref="deptName" label="部门" prop="deptName">
                                <el-popover ref="deptListPopover" v-model="showDialogDept" width="408" placement="bottom-start" trigger="click">
                                    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom: 10px" />
                                    <el-tree
                                        ref="deptTree"
                                        class="dept-tree"
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
                                <el-input v-model="form.deptName" v-popover:deptListPopover :readonly="true" placeholder="请选择部门" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="角色" prop="roleIdList">
                                <el-select v-model="form.roleIdList" style="width: 100%" multiple clearable filterable placeholder="请选择">
                                    <el-option v-for="item in roleListAll" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态" prop="status">
                                <el-radio v-model="form.status" label="1">正常</el-radio>
                                <el-radio v-model="form.status" label="0">禁用</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="default" @click="cancel">取 消</el-button>
                    <el-button size="medium" type="primary" @click="submitForm('drawerForm')">确 认</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import * as that from "@/api/system/system-user-api";
import { sysDeptList } from "@/api/system/system-department-api";
import { sysRoleListAll } from "@/api/system/system-role-api";
import { encode, dateFormatIE, decode } from "@/utils/index";

import tableMixin from "@/components/table/mixin/table-mixin";
export default {
    name: "system-user",
    filters: {
        timeFormate: (value) => {
            return dateFormatIE(value);
        },
    },
    mixins: [tableMixin],
    data() {
        return {
            // 所有的角色
            roleListAll: [],
            // 菜单表格树数据
            deptList: [],
            // 下拉树配置
            deptListProps: {
                label: "name",
                children: "childDepts",
            },
            // 下拉树过滤文字
            filterText: "",
            // 弹出层标题
            title: "新增",
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                userName: "",
                realName: "",
                password: "",
                sex: "0",
                email: "",
                mobile: "",
                roleIdList: [],
                deptName: "",
                status: "1",
            },
            // 表单校验
            rules: {
                userName: [
                    {
                        required: true,
                        message: "用户名不能为空",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                ],
                roleIdList: [
                    {
                        required: true,
                        message: "角色不能为空",
                        trigger: "change",
                    },
                ],
                deptName: [
                    {
                        required: true,
                        message: "部门不能为空",
                        trigger: "change",
                    },
                ],
                email: [
                    {
                        pattern: /^\w+@\w+(\.)\w+$/,
                        message: "请输入正确的邮箱",
                        trigger: "blur",
                    },
                ],
                mobile: [
                    {
                        pattern: /^1[0-9]\d{9}$/,
                        message: "请输入正确的手机号",
                        trigger: "blur",
                    },
                ],
            },

            // 弹窗部门选择组件显示
            showDialogDept: false,

            // 查询部门选择组件显示
            showQueryDept: false,

            queryForm: {},
            tableLine: [
                { label: "用户名", prop: "userName", width: 110 },
                { label: "姓名", prop: "realName", width: 110 },
                { label: "性别", prop: "sex" },
                { label: "手机号", prop: "phone", width: 130 },
                { label: "部门名称", prop: "deptName", width: 130 },
                { label: "邮箱", prop: "email", width: 160 },
                { label: "角色名称", prop: "roles", width: 160 },
                { label: "状态", prop: "status", width: 90 },
                { label: "创建时间", prop: "createdTime", width: 170 },
            ],
            tableLineSelect: [],
        };
    },
    watch: {
        filterText(val) {
            this.$refs.deptTree.filter(val);
        },
    },
    created() {
        // this.getDataList(1)
        this.getRoleList();
        this.getDeptList();
    },
    mounted() {
        this.tableLineSelect = this.tableLine;
    },
    methods: {
        // 删除
        handleDelete(row) {
            this.deleteHandle(() => {
                var id = row ? row.userId : "";
                var ids = id
                    ? [id]
                    : this.dataListSelections.map((item) => {
                          return item.userId;
                      });
                that.sysUserDelete(ids)
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

        // 获取角色列表
        getRoleList() {
            sysRoleListAll()
                .then((res) => {
                    this.roleListAll = res;
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 获取部门列表
        getDeptList() {
            sysDeptList()
                .then((res) => {
                    this.deptList = res;
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 查询列表
        getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: {
                    deptId: this.queryForm.deptId,
                    realName: this.queryForm.realName,
                    userName: this.queryForm.userName,
                },
            };
            that.sysUserPagelist(item)
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
            // this.$refs.menuTree.setCheckedKeys([])
            setTimeout(() => {
                this.$refs.drawerForm.clearValidate();
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
            this.reset();
            this.form.password = undefined;
            this.form.userName = row.userName;
            this.form.realName = row.realName;
            this.form.sex = row.sex + "";
            this.form.email = row.email;
            this.form.status = row.status + "";
            this.form.mobile = row.phone;
            this.form.userId = row.userId;
            this.form.deptId = row.deptId;
            this.form.deptName = row.deptName;
            this.form.roleIdList = [];
            for (const item of row.roles) {
                this.form.roleIdList.push(item.roleId);
            }
        },

        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    const item = JSON.parse(JSON.stringify(this.form));
                    item.deptName = undefined;
                    if (this.title === "新增") {
                        item.password = encode(this.form.password);
                        that.sysUserAdd(item)
                            .then((res) => {
                                this.open = false;
                                this.msgSuccess("新增成功");
                                this.getDataList(1);
                            })
                            .catch((error) => {
                                this.form.password = "";
                                console.log(error);
                            });
                    } else if (this.title === "编辑") {
                        that.sysUserEdit(item)
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

        // 重置密码
        handleRestPassword(row) {
            this.$confirm("是否重置密码(默认密码：123456)", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    that.sysUserResetPwd({ userId: row.userId })
                        .then((res) => {
                            this.msgSuccess("重置成功，密码为：123456");
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch(() => {});
        },

        // 查询框下拉树节点选择
        deptListQueryChangeHandle(event) {
            this.queryForm.deptId = event.deptId;
            this.queryForm.deptName = event.name;
            this.filterText = "";
            this.showQueryDept = false;
        },

        // 弹出框下拉树节点选择
        deptListTreeCurrentChangeHandle(event) {
            this.form.deptId = event.deptId;
            this.form.deptName = event.name;
            this.filterText = "";
            this.showDialogDept = false;
        },

        // 下拉树节点过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        // 获取角色名称
        getRoleName(row) {
            var roles = row.roles;
            if (roles) {
                var roleName = [];
                for (const item of roles) {
                    roleName.push(item.roleName);
                }
                return roleName.join("，");
            } else {
                return "";
            }
        },
    },
};
</script>
<style lang="scss">
#system-user {
    #treeSelect {
        width: 200px;
    }
}
.dept-tree {
    max-height: 200px;
    overflow-y: auto;
}
</style>
