<!--基础表单页面-->
<!--
  顶部查询表单：样式主要由 f-query控制 位于assets/styles/index.scss 文件中编写的全局样式
-->

<template>
  <div class="app-container">
    <h3>常规页面顶部查询Form表单</h3>
    <div class="form f-query">
      <el-form ref="roleForm" :model="baseForm" :inline="true" :rules="rules">
        <el-form-item label="普通输入框：" prop="userName">
          <el-input
            v-model="baseForm.userName"
            placeholder="请输入用户名"
            clearable
            size="small"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="普通输入框(正则邮箱验证)：" prop="userNameEmail">
          <el-input
            v-model="baseForm.userNameEmail"
            placeholder="请输入用户名"
            clearable
            size="small"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="普通输入框(函数验证)：" prop="userAge">
          <el-input
            v-model.number="baseForm.userAge"
            placeholder="请输入用户名"
            clearable
            size="small"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="下拉选择(可多选)框：" prop="selected">
          <el-select v-model="baseForm.selected" clearable placeholder="请选择">
            <!-- 当option使用v-for时 设置初值时注意格式，如果设置无效 请改变格式 String -> Number 或者反之 -->
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 在使用日期选择的时候需要进行时间格式化 如 value-format="yyyy-MM-dd hh:mm:ss"  -->
        <el-form-item label="日期选择框：" prop="beginDate">
          <el-date-picker
            v-model="baseForm.beginDate"
            type="datetime"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item label="日期范围选择框：" prop="rangeDate">
          <el-date-picker
            v-model="baseForm.rangeDate"
            type="datetimerange"
            range-separator="至"
            value-format="yyyy-MM-dd hh:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTime"
          />
        </el-form-item>
        <!-- 使用tree-select 下拉树选择框：自定义了CSS  文档地址：https://www.vue-treeselect.cn/#basic-features -->
        <el-form-item label="下拉树选择框：" class="treeSelect">
          <treeselect v-model="baseForm.treeSelect" :multiple="true" :options="treeOptions" @select="treeSelect" @close="closeTreeSelect" />
        </el-form-item>
        <!-- 单项选择 在设置初值时无效过客可能是初值的格式不对number 或者 String 调试 -->
        <el-form-item label="单项选择框：" prop="radio">
          <el-radio-group v-model="baseForm.radio">
            <el-radio :label="3">备选项</el-radio>
            <el-radio :label="6">备选项</el-radio>
            <el-radio :label="9">备选项</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="reset-btn" type="primary" icon="el-icon-refresh-left" size="mini" @click="resetForm('roleForm')">重置</el-button>
          <el-button v-hasPermi="['sys:manage:save']" type="primary" icon="el-icon-plus" size="mini" @click="submitForm('roleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <h3>常规多字段编辑2*n表单</h3>
    <div class="form f-edite">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="editRules" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="editForm.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码：" prop="password">
              <el-input v-model="editForm.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input v-model="editForm.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="choose" label="性别：">
              <template>
                <el-radio v-model="editForm.gender" label="1">男</el-radio>
                <el-radio v-model="editForm.gender" label="0">女</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号：">
              <el-input v-model="editForm.mobile" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：">
              <el-input v-model="editForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="choose" label="状态：">
              <template>
                <el-radio v-model="editForm.status" label="1">正常</el-radio>
                <el-radio v-model="editForm.status" label="0">禁用</el-radio>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="choose" label="弹窗演示：">
              <el-button type="primary" @click="dialogShow = true">dialog显示</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="addDialog">
      <!-- 同el-row 与 el-col 设置分行 以及自适应 -->
      <el-dialog destroy-on-close title="新增" :visible.sync="dialogShow">
        <el-form ref="editForm" :model="editForm" label-width="100px" :rules="editRules" size="small">
          <el-row>
            <el-col :span="24" :xs="24" :lg="12">
              <el-form-item label="用户名：" prop="username">
                <el-input v-model="editForm.username" placeholder="请输入用户名" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24" :lg="12">
              <el-form-item label="密码：" prop="password">
                <el-input v-model="editForm.password" placeholder="请输入密码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :xs="24" :lg="12">
              <el-form-item label="姓名：">
                <el-input v-model="editForm.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24" :lg="12">
              <el-form-item class="choose" label="性别：">
                <template>
                  <el-radio v-model="editForm.gender" label="1">男</el-radio>
                  <el-radio v-model="editForm.gender" label="0">女</el-radio>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :xs="24" :lg="12">
              <el-form-item label="手机号：">
                <el-input v-model="editForm.mobile" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24" :lg="12">
              <el-form-item label="邮箱：">
                <el-input v-model="editForm.email" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :xs="24" :lg="12">
              <el-form-item class="choose" label="状态：">
                <template>
                  <el-radio v-model="editForm.status" label="1">正常</el-radio>
                  <el-radio v-model="editForm.status" label="0">禁用</el-radio>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogShow = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'BaseForm',
  components: {
    Treeselect
  },
  data() {
    // 表单验证函数
    var checkAge = (rule, value, callback) => {
      if (!value) {
        console.log(value)
        return callback(new Error('年龄不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          console.log(value)
          callback(new Error('请输入数字值'))
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'))
          } else {
            callback()
          }
        }
      }, 50)
    }
    return {
      baseForm: {
        userName: '',
        userNameEmail: '',
        userAge: '',
        beginDate: '',
        rangeDate: '',
        treeSelect: null,
        radio: 6
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭哈哈哈哈哈哈哈哈哈嗝'
      }],
      treeOptions: [{
        id: 'a',
        label: 'a',
        children: [{
          id: 'aa',
          label: 'aa'
        }, {
          id: 'ab',
          label: 'ab'
        }, {
          id: 'ac',
          label: 'ac'
        }, {
          id: 'ad',
          label: 'ad'
        }, {
          id: 'ae',
          label: 'ae'
        }]
      }, {
        id: 'b',
        label: 'b'
      }, {
        id: 'c',
        label: 'c'
      }],
      rules: {
        // 常规必选验证方法
        userName: [
          { required: true, message: '必须输入', trigger: 'blur' }
        ],
        // 使用正则表达式
        userNameEmail: [
          { pattern: /^\w+@\w+(\.)\w+$/, message: '请输入正确的邮箱', trigger: 'blur', required: true }
        ],
        // 使用函数验证
        userAge: [
          { validator: checkAge, trigger: 'blur' }
        ]
      },
      /* editForm */
      editForm: {

      },
      editRules: {},
      dialogShow: false
    }
  },
  methods: {
    // 时间获取函数
    async getTime(e) {
      console.log(e)
    },
    // 下拉树数选择函数
    treeSelect(e) {
      console.log(e)
    },
    // 下拉树关闭函数
    closeTreeSelect(value, instanceId) {
      console.log(value, instanceId)
    },
    // 提交
    submitForm(formName) {
      // this.msgSuccess('提交')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.baseForm.treeSelect = null

      // this.msgSuccess('成功')
      // 也是重置data数据的方法 但是不会移除检验 如果没用treeSelecte 推荐使用上面
      // this.baseForm = this.$options.data().baseForm
    }
  }
  /** *************************************常用编辑弹出框2*n排版*********************************************************/

}
</script>
<style lang='scss' scoped>
.form{
  border: 1px solid #efefef;
  box-sizing: border-box;
  padding: 20px;
  margin-bottom: 20px;
}
h3{
  margin: 15px 0;
}
</style>
