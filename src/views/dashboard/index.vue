<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="mycharts">
      <pie-chart />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import pieChart from '@/components/echart/PieChart'
export default {
  name: 'Dashboard',
  components: {
    pieChart
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
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
