<!--
	备注：普通柱状图
	便利修改：改柱状图配置描素了很多参数，在使用时可以复制粘贴出来，根据需求重新配置
	put: {
		title:'标题',
		className:'样式',
		width:'宽',
		height:'高',
		colors:'',
		data:{
      xdata: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ,
      ydata: [120, 200, 150, 80, 70, 110, 130]
    }
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
    title: {
      type: String,
      default: '统计'
    },
    color: {
      type: String,
      default: '#3383FF'
    },
    barData: {
      type: Object,
      default: () => {
        const obj = {
          xdata: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          ydata: [120, 200, 150, 80, 70, 110, 130]
        }
        return obj
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    barData(newValue, oldValue) {
      for (let i = 0; i < newValue.length; i++) {
        if (oldValue[i] !== newValue[i]) {
          this.initChart()
        }
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
      this.chart.on('click', param => {
        this.$emit('echartsClick', param)
      })
      this.chart.setOption({
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // 网格位置调整
        grid: {
          top: 40,
          left: '2%',
          right: '2%',
          bottom: '3%',
          // grid 区域是否包含坐标轴的刻度标签。
          containLabel: true
        },
        xAxis: [{
          // 类型选择 category:类型 value：值
          type: 'category',
          data: this.barData.xdata,
          // 第二种data
          // data:[{
          //   value:'周一',
          //   textStyle:{
          //     fontSize:20,
          //     color:'orange'
          //   }
          // },'周二', '周三', '周四', '周五', '周六', '周日'],
          // 坐标刻度控制对象
          axisTick: {
            // 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
            alignWithLabel: true,
            // 坐标轴刻度是否朝内，默认朝外。
            inside: false,
            // 刻度线的样式
            lineStyle: {
              // color:'red'
            }
          },
          // 坐标轴刻度标签的相关设置
          axisLabel: {
            // 是否显示刻度标签
            show: true,
            // 坐标轴刻度标签的显示间隔，在类目轴中有效
            interval: 'auto',
            // 刻度标签是否朝内，默认朝外
            inside: false,
            // 刻度标签旋转的角度，-90 -- 90。
            rotate: 0,
            // 刻度标签文字颜色，支持回调函数
            // color:function (value,index) {
            //     return 'red'
            // },
            fontSize: 12,
            align: 'center',
            // 垂直对齐方式
            verticalAlign: 'top',
            // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
            // 1：简易模板
            // formatter:'{value} kg',
            // 2: 回调函数
            // formatter:function (value,index) {
            //    // 格式化成月/日，只在第一个刻度显示年份
            //     return '{a|' + value  + '}-' + index;
            // },
            // 颜色 可以直接使用 '#123234', 'red', 'rgba(0,23,11,0.3)'
            // backgroundColor:{
            //   image:'xxx/xxx.png',
            //  width:xx,
            //  height:xx
            // }
            // formatter:['{a|haha}'],
            // 文字样式自定义
            rich: {
              a: {
                color: 'blue'
              }
            }

          },
          // 坐标轴在 grid 区域中的分隔线。
          splitLine: {
            // show:true
          },
          // 坐标轴轴线相关设置 横纵坐标。
          axisLine: {
            show: true,
            // 控制箭头
            // 左右箭头
            // symbol:['none','arrow'],
            // symbolSize : [6, 9],
            // symbolOffset : [0,0],
            lineStyle: {
              // color:'orange'
              // { color , width , type , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
            }

          },
          // 坐标轴指示器配置项。
          axisPointer: {
            show: false,
            type: 'shadow'
          }
        }],
        yAxis: [{
          type: 'value',
          // min max interval 用于控制数值刻度
          // min: function (value) {
          //       return 0;
          // },
          // max:function (value) {
          //       return value.max + 20;
          // },
          // 强制设置坐标轴分割间隔。
          // interval:10,
          // 坐标轴的分割段数
          // splitNumber:10,
          axisTick: {
            show: false
          },
          // 坐标轴在 grid 区域中的分隔线。
          splitLine: {
            show: true,
            interval: 'auto',
            lineStyle: {
              color: 'transparent'
            }
          }
        }],
        series: [{
          name: this.title,
          type: 'bar',
          // 柱状图颜色
          // color:this.color,
          itemStyle: {
            normal: {
              // 柱状图颜色
              color: this.color,
              // 是否在柱状图顶部显示数据
              label: {
                show: true, // 开启显示
                position: '', // 在上方显示（top）  ""  top  bottom
                textStyle: {
                  // 数值样式
                  color: '#fff'
                }
              }
            }
          },
          // 数据堆叠
          // stack: 'vistors',
          barWidth: '50%', // barMaxWidth
          data: this.barData.ydata,
          animationEasing: 'cubicInOut',
          animationDuration: 1500
        }
          // 重叠数据 一个柱状图多个数据
          // {
          //   name: 'pageB',
          //   type: 'bar',
          //   stack: 'vistors',
          //   barWidth: '60%',
          //   data: [],
          //   animationDuration
          // }
        ]
      })
    }
  }
}
</script>
