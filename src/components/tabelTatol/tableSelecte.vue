<!--表格选择统计组件-->
<!--
  input:   selectedNum:Number 选择的数量；
          clear:Functon 清空选择函数
  slot :可自定义插入数据
-->

<template>
  <div id="tableSelecte">
    <div class="table-total">
      <i class="el-icon-info" />
      <span>已选择</span>
      <span class="code">{{ selectedNum }}</span>
      <slot />
      <el-button type="text" @click="clear">清空</el-button>
      <div class="rightBtn">
        <el-button style="margin-right:10px" icon="el-icon-refresh" type="text" @click="fresh">刷新</el-button>
        <el-popover
          placement="bottom"
          title="选择展示列"
          width="200"
          trigger="click"
          @after-leave="lineSelecte"
        >
          <div>
            <el-checkbox-group v-model="defineLine">
              <el-checkbox v-for="item in subTableLine" :key="item.prop" :checked="true" :label="item.label" />
            </el-checkbox-group>
          </div>
          <el-button slot="reference" icon="el-icon-setting" type="text">自定义列</el-button>
        </el-popover>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TableSelecte',
  props: {
    selectedNum: {
      type: Number,
      default: 0
    },
    tableLine: {
      type: Array,
      default: () => { return [] }
    },
    clear: {
      type: Function,
      default: function() {}
    },
    fresh: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      defineLine: [],
      subTableLine: this.tableLine
    }
  },
  computed: {
    tableData() {
      return this.tableList
    }
  },
  methods: {
    show() {
      console.log(this.tableData)
    },
    lineSelecte() {
      if (this.defineLine.length === 0) {
        this.msgWarning('可展示列不能为空')
        return
      }
      this.$emit('line', this.defineLine)
    }
  }
}
</script>
<style lang='scss' scoped>
$color: #409EFF;
.table-total{
    height: 40px;
    width: 100%;
    border-radius: 5px;
    background: #E6F7FF;
    border:  1px solid #91D5FF;
    box-sizing: border-box;
    padding: 0 20px;
    line-height: 40px;
    font-size: 14px;
    margin-bottom: 5px;
    i{
        color: $color;
        margin-right: 10px;
    }
    .code{
        color: $color;
        font-weight: bold;
        margin: 0 10px 0px 5px;
    }
    .rightBtn{
      float: right;

    }
}
</style>
