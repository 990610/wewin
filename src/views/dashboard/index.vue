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
  // eslint-disable-next-line vue/name-property-casing
  name: 'dashboard',
  components: {
    pieChart
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
  &-container {
    height: 100%;
    padding-top: 15px;
    box-sizing: border-box;
    background-color: skyblue;
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
