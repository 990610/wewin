<template>
  <div class="f-dialog">
    <el-dialog
      :title="!dataForm.id ? '新增' : '编辑'"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入字典名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典类型" prop="type">
              <el-input v-model="dataForm.type" placeholder="请输入字典类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典码" prop="code">
              <el-input v-model="dataForm.code" placeholder="请输入字典码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典值" prop="value">
              <el-input v-model="dataForm.value" placeholder="请输入字典值" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="orderNum">
              <el-input v-model="dataForm.orderNum" placeholder="请输入排序" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="删除标记  -1：已删除  0：正常" prop="delFlag">
              <el-input v-model="dataForm.delFlag" placeholder="请输入删除标记  -1：已删除  0：正常" />
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
// import * as that from '@/api/******.js'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        type: '',
        code: '',
        value: '',
        orderNum: '',
        remark: '',
        delFlag: ''
      },
      dataRule: {
        name: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '字典码不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '字典值不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: '删除标记  -1：已删除  0：正常不能为空', trigger: 'blur' }
        ]
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
          // that.****(this.dataForm.id).then(res =>{
          // this.dataForm.name = data.sysDict.name
          // this.dataForm.type = data.sysDict.type
          // this.dataForm.code = data.sysDict.code
          // this.dataForm.value = data.sysDict.value
          // this.dataForm.orderNum = data.sysDict.orderNum
          // this.dataForm.remark = data.sysDict.remark
          // this.dataForm.delFlag = data.sysDict.delFlag
          // })
          // .catch( error => { console.log(error) })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.id) {
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
