<template>
    <div class="f-dialog">
        <el-dialog v-adaptive="{ type: 'dialog' }" :title="!dataForm.id ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible" custom-class="table-dialog">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="110px">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="dataForm.userName" placeholder="请输入用户名" maxlength="40" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="真实姓名" prop="realName">
                            <el-input v-model="dataForm.realName" placeholder="请输入真实姓名" maxlength="40" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="sex">
                            <el-radio v-model="dataForm.sex" :label="0">男</el-radio>
                            <el-radio v-model="dataForm.sex" :label="1">女</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="dataForm.phone" maxlength="11" placeholder="请输入手机号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="dataForm.email" placeholder="请输入邮箱" maxlength="20" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="visible = false">取消</el-button>
                <el-button type="primary" size="medium" @click="dataFormSubmit()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as that from "@/api/system/system-user-api";
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                userName: "",
                realName: "",
                sex: "0",
                email: "",
                phone: "",
            },
            dataRule: {
                userName: [
                    {
                        required: true,
                        message: "用户名不能为空",
                        trigger: "blur",
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
                        required: true,
                        pattern: /^\w+@\w+(\.)\w+$/,
                        message: "请输入正确的邮箱",
                        trigger: "blur",
                    },
                ],
                phone: [
                    {
                        required: true,
                        pattern: /^1[0-9]\d{9}$/,
                        message: "请输入正确的手机号",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        // 初始化
        init(id) {
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].resetFields();
                if (this.dataForm.id) {
                    // 调用获取详情函数
                    that.sysUserQueryByIdUserId({ userId: this.dataForm.id })
                        .then((res) => {
                            Object.assign(this.dataForm, res);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    if (!this.dataForm.id) {
                        // 新增功能
                        // that.func(this.dataForm)
                        //     .then((res) => {
                        //         this.msgSuccess("新增成功");
                        //         this.visible = false;
                        //         this.$emit("refreshDataList", 1);
                        //     })
                        //     .catch((error) => {
                        //         console.log(error);
                        //     });
                    } else {
                        // 编辑功能
                        // that.func(this.dataForm)
                        //     .then((res) => {
                        //         this.msgSuccess("编辑成功");
                        //         this.visible = false;
                        //         this.$emit("refreshDataList");
                        //     })
                        //     .catch((error) => {
                        //         console.log(error);
                        //     });
                    }
                }
            });
        },
    },
};
</script>
<style lang="scss"></style>
