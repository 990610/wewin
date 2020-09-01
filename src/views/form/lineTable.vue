<!--行内编辑表格-->
<template>
  <div id="lineTable" class="app-container">
    <h3>行内可编辑表格</h3>
    <div class="table">
      <el-table :data="tabledatas" border height="100%">
        <el-table-column type="selection" />
        <el-table-column label="tab1">
          <template slot-scope="scope">
            <el-input v-show="scope.row.show" v-model="scope.row.tab1" placeholder="请输入内容" />
            <span v-show="!scope.row.show">{{ scope.row.tab1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="tab2">
          <template slot-scope="scope">
            <el-input v-show="scope.row.show" v-model="scope.row.tab2" placeholder="请输入内容" />
            <span v-show="!scope.row.show">{{ scope.row.tab2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="tab2">
          <template slot-scope="scope">
            <el-select v-show="scope.row.show" v-model="scope.row.selectId" clearable placeholder="请选择" @change="selectLable">
              <!-- 当option使用v-for时 设置初值时注意格式，如果设置无效 请改变格式 String -> Number 或者反之 -->
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-show="!scope.row.show">{{ scope.row.select }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="250"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-show="!scope.row.show"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="scope.row.show =true"
            >编辑</el-button>
            <el-button v-show="scope.row.show" type="text" @click="saveData(scope.row)">保存</el-button>
            <el-button v-show="scope.row.show" type="text" @click="scope.row.show =false">取消</el-button>
            <el-popconfirm
              title="确定删除吗？"
              icon="el-icon-info"
              icon-color="#FAAD14"
              cancel-button-type="default"
              @onConfirm="deleteConfirm(scope.row)"
            >
              <el-button slot="reference" style="margin-left:10px;" size="mini" type="text" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :current-page="pagination.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, sizes"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'LineTable',
  data() {
    return {
      tabledatas: [],
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
      //   选中对象
      isSelecte: {},
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 12
      },
      // table 选择
      multipleSelection: [],
      baseForm: {},
      rules: {}
    }
  },
  created() {
    // 发请求去后台拿数据,如果有api，就正常请求，
    // 我这里是demo，就简单给list赋值了，原理一样。
    // getlistApi().then(res => {
    // let list = res.data.list
    const list = [
      { id: 0, tab1: 'tast2', tab2: 'tast333', select: '黄金糕', selectId: '选项1' },
      { id: 1, tab1: 'aaa', tab2: 'bbb', select: '龙须面', selectId: '选项4' }
    ]
    // 在list里面给每个对象添加show字段
    this.tabledatas = list.map((value) => {
      value['show'] = false
      return value
    })
    // })
    console.log(this.tabledatas)
  },
  methods: {
    // 在select Change中只能获取对象的id 如果想得到label还需要自己去删选
    selectLable(e) {
      this.isSelecte = this.options.filter(element => {
        if (element.value === e) {
          return true
        }
      })[0]
    },
    saveData(row) {
      console.log(row)
      this.tabledatas.forEach(element => {
        if (element.id === row.id) {
          row.show = false
          element = row
          element.select = this.isSelecte.label
        }
      })
    },
    // 分页大小选择
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getManagerList(1)
    },
    // 分页页面跳转
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.getManagerList(val)
    },
    // table 批量选择获取
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteConfirm(row) {
      console.log('确定删除')
    }
  }
}
</script>
<style lang="scss">
#lineTable{
    h3{
        margin: 10px 0;
    }
    .table{
        position: relative;
        height: calc(100vh - 320px);
    }
}
</style>
<style lang='scss' scoped>

</style>
