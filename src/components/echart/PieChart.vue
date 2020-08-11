<!--
	备注：普通圆环图
	便利修改：将圆环图修改为圆饼图，并各个区域带有百分比显示
	put: {
		title:'标题',
		className:'样式',
		width:'宽',
		height:'高',
		colors:[颜色数组],
		data:[{
			name:'名字',
			value:'数值'
		}]
	}
	out:{
		echartsClick(parms):'饼图点击事件'
	}
	如图：无百分比 peiEchart-1.png
	带百分比 peiEchart-2.png
	date:2020/7/21
	author:pxt
-->

<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
// import func from '../../../vue-temp/vue-editor-bridge'

export default {
  mixins: [resize],
  props: {
    title: {
      type: String,
      default: '标题'
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    colors: {
      type: Array,
      default: () => {
        return ['#d8e7fc', '#3383ff', '#FFCD7E']
      }
    },
    data: {
      type: Array,
      default: () => {
        return [
          {
            name: '无',
            value: '0'
          }
        ]
      }
    }
  },
  data() {
    return {
      chart: null,
      legData: []
    }
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        this.initChart()
      },
      deep: true
      // immediate:true
    }
  },
  mounted() {
    this.initLegData()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'light')
      this.chart.on('click', param => {
        this.$emit('echartsClick', param)
      })
      this.chart.setOption({
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'item',
          // {a}：系列名。
          // {b}：数据名。
          // {c}：数据值。
          // {d}：百分比。
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.legData,
          orient: 'horizontal' // horizontal vertical
        },
        series: [
          {
            name: this.title,
            type: 'pie',
            // 是否展示成南丁格尔图，通过半径区分数据大小。
            // 可选择两种模式：'radius' 扇区圆心角展现数据的百分比，半径展现数据的大小。
            // 'area' 所有扇区圆心角相同，仅通过半径展现数据大小。
            // roseType: 'radius',
            radius: ['45%', '60%'],
            // 圆中心的坐标
            // center: ['50%', '45%'],
            color: this.colors,
            data: this.data,
            // 绘图时的动画
            animationEasing: 'cubicInOut',
            animationDuration: 1500,
            // 是否启用防止标签重叠策略，默认开启，在标签拥挤重叠的情况下会挪动各个标签的位置，防止标签间的重叠。
            avoidLabelOverlap: false,
            // 圆环伸出去的标签
            label: {
              show: true
              // 使用带%效果显示
              // normal: {
              // 	show: true,
              // 	position: "inside",
              // 	formatter: `{d}` + "%"
              // },
              // 鼠标放在圆环上效果
              // emphasis: {
              // 	show: true,
              // 	textStyle: {
              // 		fontSize: "15",
              // 		fontWeight: "bold"
              // 	}
              // }
            },
            // 圆环伸出去的标签的线
            labelLine: {
              normal: {
                // show: false
              }
            }
          }
        ]
      })
    },
    initLegData() {
      this.legData = []
      for (const item of this.data) {
        this.legData.push(item.name)
        console.log(item.name)
      }
    }
  }
}
</script>
