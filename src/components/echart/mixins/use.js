// X轴Y轴的公共配置文档
// eslint-disable-next-line no-unused-vars
const useMethod = {
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
  }]
}
