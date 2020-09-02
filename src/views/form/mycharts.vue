<!--基础图表-->
<template>
  <div id="myecharts" class="app-container">
    <h3>基础饼图 传入参数可选：title:'xxxx', type:'pie/annulus(默认)', data:[{name:xx,value:xx}], colors:['#d8e7fc']</h3>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="echrats-one">
          <pie-chart type="pie" title="基础圆饼图" :data="pieOneData" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="echrats-one">
          <pie-chart title="基础圆环图" :data="pieOneData" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="echrats-one">
          <pie-chart-circle title="带小圆圈的圆环图（自定义lable）" :data="pieOneData" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PieChart from '@/components/echart/PieChart'
import PieChartCircle from '@/components/echart/PieChart _circle'
export default {
  name: 'Myecharts',
  components: {
    PieChart,
    PieChartCircle
  },
  data() {
    return {
      pieOneData: [
        {
          name: '第一',
          value: 20
        },
        {
          name: '第二',
          value: 20
        },
        {
          name: '第三',
          value: 20
        },
        {
          name: '第四',
          value: 20
        },
        {
          name: '第五',
          value: 30
        }
      ]
    }
  },
  methods: {}
}
</script>
<style lang='scss' scoped>
   #myecharts{
       h3{
           margin: 20px;
       }
       .echrats-one{
           width: 100%;
           height: 400px;
           background: #ffffff;
           border: 1px solid #cccccc;
           padding: 5px;
       }
   }
</style>
