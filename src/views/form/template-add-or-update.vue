<template>
  <div class="f-dialog">
    <el-dialog
      :title="!dataForm.id ? '新增' : '编辑'"
      :close-on-click-modal="false"
      :visible.sync="visible"
      custom-class="customClass"
    >
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="用户名" prop="realName">
              <el-input v-model="dataForm.realName" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="realName">
              <el-input v-model="dataForm.realName" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="realName">
              <el-input v-model="dataForm.realName" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="realName">
              <el-input v-model="dataForm.realName" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="close-btn" size="small" @click="visible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入api中对应的js
import * as that from '@/api/system/SysUserController'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        realName: ''
      },
      dataRule: {
      }
    }
  },
  methods: {
    // 父组件在使用init的时候，如果table已经包含了表单里面的数据，可以直接传row进来使用，无需调用函数
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          // 调用获取详情函数
          that.sysUserQueryByIdUserId({ userId: this.dataForm.id }).then(res => {
            this.dataForm.realName = res.realName
          })
            .catch(error => { console.log(error) })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.id) {
            // 新增接口调用
            //  that.*****(this.dataForm).then(res=>{
            //      this.msgSuccess('新增成功')
            //      this.visible = false
            //       this.$emit('refreshDataList',1)
            //  })
            //     .catch( error => { console.log(error) })
          } else {
            // 编辑接口调用
            // that.*****(this.dataForm).then(res=>{
            //     this.msgSuccess('编辑成功')
            //     this.visible = false
            //    this.$emit('refreshDataList')
            // })
            //     .catch( error => { console.log(error) })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
// 自定义样式
.customClass{
}
</style>
