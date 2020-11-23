<!--基础表格-->
<!--
  表格都设有全局样式 在element-ui.scss 中
-->
<template>
  <div id="baseTable" class="app-container">
    <h3>基本table与分页</h3>
    <div class="tableOne">
      <table-total :selected-num="multipleSelection.length" :clear="clearMul" :fresh="getTableData" />
      <el-table
        ref="table"
        v-loading="loading"
        v-adaptive
        :data="managerList"
        height="100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="index" type="index" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">{{ scope.row.sex ? '女':'男' }}</template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column
          label="操作"
          align="center"
          width="250"
          fixed="right"
        >
          <template slot-scope="">
            <!-- 权限控制 依页面而定 -->
            <!-- v-hasPermi="['sys::update']" -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
            >编辑</el-button>
            <!-- v-hasPermi="['sys::delete']" -->
            <el-popconfirm
              title="确定删除吗？"
              icon="el-icon-info"
              icon-color="#FAAD14"
              cancel-button-type="default"
              @onConfirm="cosole.log('确认删除')"
            >
              <el-button slot="reference" style="margin-left:10px;" size="mini" type="text" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import tableTotal from '@/components/tabelTatol/index'
export default {
  components: {
    tableTotal
  },
  data() {
    return {
      loading: false,
      managerList: [
        {
          userName: '01',
          realName: '小明',
          sex: '0',
          phone: '123456789'
        },
        {
          userName: '02',
          realName: '小红',
          sex: '0',
          phone: '123456789'
        },
        {
          userName: '03',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '04',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '05',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '06',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '07',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '08',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '09',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '10',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '11',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '12',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '12',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        },
        {
          userName: '12',
          realName: '小明',
          sex: '1',
          phone: '123456789'
        }
      ],
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
  methods: {
    // 获取表格数据
    // 在请求前和请求后 改变loading 为表格添加加载效果
    getTableData(e) {
      console.log(e)
      this.managerList = []
      for (let index = 0; index < 8; index++) {
        this.managerList.push({
          userName: '01' + Math.random() * 100,
          realName: '小明',
          sex: '0',
          phone: '123456789'
        })
      }
      // 分页赋值数据
      this.pagination.total = 13
      this.pagination.pageNo = 1
      this.pagination.pageSize = 10
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
    clearMul() {
      this.$refs.table.clearSelection()
    }
  }
}
</script>
<style lang='scss'>
#baseTable{
height: 100%;
// background-color: $subMenuActiveText;
// 一般table都需要一个高度，使得数据量过多时能够在table内部滚动，
// 高度计算方法 总高度减去顶部元素高度和分页高度和内部padding
// 具体可以调试
  // .tableOne{
      // height: calc(100% - 134px);
  // }
  h3{
    margin: 15px 0;
  }
}

</style>
