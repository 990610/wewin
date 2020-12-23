<template>
  <div class="dashboard-container app-container">
    <h3>2020/11/19更新：</h3>
    <p>1、vux添加deptId字段
      <br>2、优化数据字典新增提示
    </p>
    <h3>2020/11/23更新</h3>
    <p>1、新增开发模板页面，可自行复制粘贴<br>2、优化表格多选居中</p>
    <h3>2020/12/1更新</h3>
    <p>1、修复系统设置头部拖动BUG 优化系统设置部分页面切换刷新 <br>2、新增导航高度设置 $navHeight <br> <span style="color:red;">3、优化子菜单创建方式：建议通过表格里面创建子菜单,文件名与菜单路径相同！！</span> </p>
    <h3>2020/12/14日更新</h3>
    <p>1、修复头部拖动造成的错位BUG，之前的@headerDragen方法可以不再是使用，v-adptive指令内已做了优化
      旧项目更新可直接替换 adaptive.js 文件
      <br> 2、优化的下载方式的方法，详情看函数注释
      <br>3、优化防抖节流函数封装，详情看注释
      <br>4、生产环境不再弹出console.log()
      <br>5、优化全局提示：添加错误提示this.msgError(msg,duration)并支持时间传参，默认2000ms
      <br>6、优化错误拦截：如超时，网络错误提示
    </p>
    <h3>2020/12/23日更新</h3>
    <p>1、修复侧面菜单栏颜色配置BUG，优化侧面菜单颜色配置方式</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'Dashboard',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    console.log('首页')
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-text {
    font-size: 50px;
    line-height: 46px;
  }
}
h3{
  margin-top: 15px;
}
.mycharts{
  width: 300px;
  height: 300px;
  border: 1px solid skyblue;
  // background: skyblue;
}
</style>
