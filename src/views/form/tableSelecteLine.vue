<!--可自定义列表格-->
<template>
  <div id="tableSelecteLine" class="app-container">
    <table-selecte :table-line="tableLine" @line="getLine" />
    <div class="table">
      <el-table
        ref="table"
        v-adaptive
        :data="tableData"
        height="100%"
        style="width:100%"
        border
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="index" fixed="left" type="index" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="item in tableLineSelecte" :key="item.prop" :width="item.width" :label="item.label" :prop="item.prop" />
        <el-table-column
          label="操作"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <!-- 权限控制 依页面而定 -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-popconfirm
              title="确定删除吗？"
              icon="el-icon-info"
              icon-color="#FAAD14"
              cancel-button-type="default"
              @onConfirm="confirmDelete(scope.row)"
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
import tableSelecte from '@/components/tabelTatol/tableSelecte'
export default {
  name: 'TableSelecteLine',
  components: {
    tableSelecte
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      /** ****************************************************************************/
      // 引入组件需要使用的变量
      tableLine: [{ label: '日期', prop: 'date' }, { label: '姓名哈哈哈哈哈啊哈哈', prop: 'name' }, { label: '地址', prop: 'address' }],
      tableLineSelecte: [],
      /** ***************************************************************************/
      // 分页
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 12
      },
      // table 选择
      multipleSelection: []
    }
  },
  mounted() {
    this.tableLineSelecte = this.tableLine
  },
  beforeUpdate() {
    this.$nextTick(() => {
      console.log(1)
      this.$refs.table.doLayout()
    })
  },
  methods: {

    /** ***********************************************************/
    // 引入组件需要使用的方法
    // 获取组件返回的line
    getLine(line) {
      this.tableLineSelecte = this.tableLine.filter(value => {
        return line.includes(value.label)
      })
      // console.log(this.tableData)
    },
    // 刷新table
    fresh() {

    },
    // 清空table已选择
    clearMul() {
      this.$refs.table.clearSelection()
    },
    /** **********************************************************/
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

    confirmDelete(row) {
      console.log(row)
    }

  }
}
</script>
<style lang='scss' scoped>
#tableSelecteLine{
  // .table{
  //   height: 800px;
  // }
}
</style>
