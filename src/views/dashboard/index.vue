<template>
  <div class="dashboard-container app-container">
    <h3>2020/11/19更新：</h3>
    <p>1、vux添加deptId字段
      <br>2、优化数据字典新增提示
    </p>
    <h3>2020/11/23更新</h3>
    <p>1、新增开发模板页面，可自行复制粘贴<br>2、优化表格多选居中</p>
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
.mycharts{
  width: 300px;
  height: 300px;
  border: 1px solid skyblue;
  // background: skyblue;
}
</style>
