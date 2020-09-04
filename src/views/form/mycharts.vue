<!--基础图表-->
<template>
  <div id="myecharts" class="app-container">
    <h3>基础饼图 传入参数可选：title:'xxxx', type:'pie/annulus(默认)', data:[{name:xx,value:xx}], colors:['#d8e7fc']</h3>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="echarts-one">
          <pie-chart type="pie" title="基础圆饼图" :data="pieOneData" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="echarts-one">
          <pie-chart title="基础圆环图" :data="pieOneData" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="echarts-one">
          <pie-chart-circle title="带小圆圈的圆环图（自定义lable）" :data="pieOneData" />
        </div>
      </el-col>
    </el-row>
    <h3>基础折线图</h3>
    <el-row>
      <el-col :span="24">
        <div class="echarts-one">
          <line-chart :data="lineData" />
        </div>
      </el-col>
    </el-row>
    <h3>基础柱状图</h3>
    <el-row>
      <el-col :span="12">
        <div class="echarts-one">
          <bar-chart />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="echarts-one">
          <bar-chart-multiple />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PieChart from '@/components/echart/PieChart'
import PieChartCircle from '@/components/echart/PieChart _circle'
import LineChart from '@/components/echart/LineChart'
import BarChart from '@/components/echart/BarChart'
import BarChartMultiple from '@/components/echart/BarChartMultiple'
export default {
  name: 'Myecharts',
  components: {
    PieChart,
    PieChartCircle,
    LineChart,
    BarChart,
    BarChartMultiple
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
      ],
      lineData: {
        lineOne: [5, 10, 5, 25, 32, 28, 40],
        lineTwo: [15, 30, 25, 55, 32, 8, 30]
      },
      BarChart: {
        xdata: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        ydata: [120, 200, 150, 80, 70, 110, 130]
      }
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
       .echarts-one{
           width: 100%;
           height: 400px;
           background: #ffffff;
           border: 1px solid #cccccc;
           padding: 5px;
       }
   }
</style>
