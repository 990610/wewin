<!--
	备注：普通折线图
	便利修改：根据需求修改series参数做个性化处理
	put: {
		title:'标题',
		className:'样式',
		width:'宽',
		height:'高',
		colors:'',
    每条折线数据
		data:{
       expectedData:[1,4,3,2,5,9,3],
       actualData:[1,10,3,8,5,3,1],
    },
    X轴数据 类型
    xdata:["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
	}
	out:{
		echartsClick(parms):'柱状图点击事件'
	}
	如图：bar-1.png bar-2.png

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
      default: '300px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      required: true,
      default: () => {
        return {
          // 每一个字段就表示一条线的数据
          expectedData: [1, 4, 3, 2, 5, 9, 3],
          actualData: [1, 10, 3, 8, 5, 3, 1]
        }
      }
    },
    xdata: {
      type: Array,
      default: () => {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
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
      this.chart.on('click', (param) => {
        this.$emit('echartsClick', param)
      })
      this.setOptions(this.data)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          text: this.title
        },
        grid: {
          left: 10,
          right: 40,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        xAxis: {
          data: this.xdata,
          // 坐标轴两边是否留白
          boundaryGap: false,
          // 刻度线是否显示
          axisTick: {
            show: true,
            lineStyle: {
              // color: "red",
            }
          }
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [
          {
            name: 'expected',
            // 设置每个点的形状 默认：emptyCircle 空心圆 ；'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            symbol: 'emptyCircle',
            // 设置每个点的大小
            symbolSize: 4,
            // 设置每个点的旋转角度
            symbolRotate: 0,
            // 显示每个点，默认为false 只有放上鼠标才显示
            showSymbol: true,
            // 数据堆叠：同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加
            // stack:'xx',
            // 显示数据
            label: {
              show: true,
              // 绝对的像素值 position: [10, 10],
              // 相对的百分比 // position: ['50%', '50%']
              position: 'top',
              // 文字旋转
              rotate: '0',
              // 文字偏移
              offset: [10, 10]
              // 文字操作
              // formatter:function(parms){}
              // 文字css
              // rich:{}
              // color fontSize fontWeight align fontFamily verticalAlign backgroundColor
            },
            // 线条，点 配置
            itemStyle: {
              normal: {
                // 每个点的颜色
                color: '#FF005A',
                // 线条控制
                lineStyle: {
                  color: '#FF005A',
                  width: 2,
                  // 线条类型
                  type: 'solid',
                  // 图形高亮时的样式
                  emphasis: {
                    // label:{},
                    // itemStyle:{}
                  }
                }
              }
            },
            // 图中的标线，可以绘制平均线 或者指定高度线
            markLine: {
              // 是否不响应鼠标点击事件 默认响应
              silent: false,
              symbol: '',
              precision: 4,
              data: [
                {
                  name: '平均线',
                  // 支持 'average', 'min', 'max'
                  type: 'average'
                }
                // { name: "Y 轴值为 100 的水平线", yAxis: 5, },
                // [ { // 起点和终点的项会共用一个 name name: "最小值到最大值", type: "min", }, { type: "max", }, ],
                // [ { name: "两个坐标之间的标线", coord: [10, 20], }, { coord: [20, 30], }, ],
                // [ { // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线 yAxis: "max", x: "10%", }, { type: "max", }, ],
                // [ { name: "两个屏幕坐标之间的标线", x: 100, y: 100, }, { x: 500, y: 200, }, ],
              ],
              itemStyle: {
                normal: {
                  borderWidth: 1,
                  lineStyle: {
                    type: 'solid',
                    color: '#3383FF',
                    width: 1
                  },
                  label: {
                    formatter: '{a|平均值}',
                    textStyle: {
                      fontSize: 12
                    },
                    rich: {
                      a: {
                        color: 'red'
                      }
                    }
                  }
                }
              }
            },
            // 是否圆滑
            smooth: true,
            type: 'line',
            data: expectedData,
            animationDuration: 2000,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'actual',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                // 包含面积 区域填充样式。
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData,
            animationDuration: 2000,
            animationEasing: 'cubicInOut'
          }
        ]
      })
    }
  }
}
</script>
