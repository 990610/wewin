<!--可自定义列表格-->
<template>
  <div id="tableSelecteLine">
    <table-selecte :table-line="tableLine" @line="getLine" />
    <div class="table">
      <el-table
        ref="table"
        :data="tableData"
        height="100%"
        border
      >
        <el-table-column v-for="item in tableLineSelecte" :key="item.prop" :label="item.label" :prop="item.prop" />
      </el-table>
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
      tableLine: [{ label: '日期', prop: 'date' }, { label: '姓名哈哈哈哈哈啊哈哈', prop: 'name' }, { label: '地址', prop: 'address' }],
      tableLineSelecte: []

    }
  },
  mounted() {
    this.tableLineSelecte = this.tableLine
  },
  methods: {
    getLine(line) {
      console.log(line)
      this.tableLineSelecte = this.tableLine.filter(value => {
        console.log(line.includes(value.label))
        return line.includes(value.label)
      })
      console.log(this.tableData)
    }

  }
}
</script>
<style lang='scss' scoped>
#tableSelecteLine{
  .table{
    height: 800px;
  }
}
</style>
