<!--
	备注：带小圆圈的圆环图----主要是rich formmater 的使用
	便利修改：通过修改rich，修改显示标签的样式如圆圈 文字等颜色大小
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
	如图：pieEchartCircle.png

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
      default: '100%'
    },
    colors: {
      type: Array,
      default: () => {
        return ['#d8e7fc', '#3383ff', '#FFCD7E', '#87CEFA', '#4682B4', '#4682B4']
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
      // console.log('进入绘制');
      var trafficWay = this.data
      console.log(trafficWay)
      var seriesOption = [
        {
          name: this.title,
          backgroundColor: '#fff',
          type: 'pie',
          clockWise: false,
          radius: ['45%', '60%'],
          center: ['50%', '50%'],
          // 触碰动画
          hoverAnimation: false,
          color: this.colors,
          animationEasing: 'cubicInOut',
          animationDuration: 1500,
          // 自定义标签
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'outside',
                distanceToLabelLine: 0,
                formatter: function(params) {
                  var percent = 0
                  var total = 0
                  for (var i = 0; i < trafficWay.length; i++) {
                    total += trafficWay[i].value
                  }
                  percent = ((params.value / (total || 1)) * 100).toFixed(0)
                  if (params.name !== '') {
                    return (
                      '{a|' + (percent === 'NaN' ? 0 : percent) +
						'%}\n{c' +
						params.dataIndex +
						'|}\n' +
						'{b|' +
						params.value +
						'个' +
						'}'
                    )
                  } else {
                    return ''
                  }
                },
                rich: {
                  a: {
                    color: '#4e94ff',
                    padding: [0, -20]
                  },
                  b: {
                    padding: [0, -20],
                    color: '#4e94ff'
                  },
                  c0: {
                    borderColor: this.colors[0],
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 12,
                    width: 12,
                    height: 12
                  },
                  c1: {
                    borderColor: this.colors[1],
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 12,
                    width: 12,
                    height: 12
                  },
                  c2: {
                    borderColor: this.colors[2],
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 12,
                    width: 12,
                    height: 12
                  },
                  c3: {
                    borderColor: this.colors[3],
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 12,
                    width: 12,
                    height: 12
                  },
                  c4: {
                    borderColor: this.colors[4],
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 12,
                    width: 12,
                    height: 12
                  }
                }
              },
              labelLine: {
                length: 15,
                length2: 30,
                show: true
              }
            }
          },
          data: trafficWay
        }
      ]
      const option = {
        series: seriesOption,
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
          // 携带标题
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          // icon: "circle",
          bottom: 0,
          // right:0,
          orient: 'horizontal', // horizontal vertical
          // x: "center",
          data: trafficWay,
          // 图例的公用文本样式。
          textStyle: {
            color: '#9ea6ad',
            // 在 rich 里面，可以自定义样式，在formatter里面将样式复制给文字
            rich: {
              b: {
                align: 'center',
                color: '#3383ff'
              }
            }
          },
          formatter: name => {
            const data = trafficWay
            // eslint-disable-next-line no-unused-vars
            let total = 0
            let target
            for (let i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            const arr = ['{a|' + name + '} ' + ('{b|' + target + '}  箱')]
            return arr
          }
        }
      }
      this.chart.on('click', param => {
        console.log(param)
        this.$emit('echartsClick', param)
      })
      // console.log('绘制');
      this.chart.setOption(option)
    }
  }
}
</script>
