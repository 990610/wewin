<!--b-->
<template>
  <div>
    <treeselect v-model="value" :flat="multiple" :auto-select-ancestors="multiple" :multiple="multiple" :options="treeOptions" :normalizer="normalizer" placeholder="请选择" @input="inputChange" @select="treeSelect" @close="closeTreeSelect" />
  </div>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { sysDeptList } from '@/api/system/SysDeptController'
export default {
  components: {
    Treeselect
  },
  props: {
    deptid: {
      type: [Number, Array],
      default: null
    },
    deptdata: {
      type: Array,
      default: () => { return [] }
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: null,
      treeOptions: []
    }
  },
  watch: {
    deptid(newValue, oldValue) {
      this.value = newValue
    }
  },
  created() {
    if (this.deptdata.length) {
      this.treeOptions = this.deptdata
      this.value = this.deptid
    } else {
      sysDeptList().then((res) => {
        this.treeOptions = res
        this.value = this.deptid
      })
    }
  },
  methods: {
    // 下拉树数选择函数
    treeSelect(e) {
      // console.log(e)
      if (!this.multiple) {
        this.$emit('update:deptid', e.deptId)
        this.$emit('resutl', e)
      }
    },
    inputChange(value) {
      // console.log(value)
      if (value === undefined || value.length === 0) {
        this.$emit('update:deptid', value)
        this.$emit('resutl', value)
      }
    },
    // 下拉树关闭函数
    closeTreeSelect(value, instanceId) {
      if (this.multiple) {
        this.$emit('update:deptid', value)
        this.$emit('resutl', value)
      }
    },
    normalizer(node) {
      if (node.childDepts && !node.childDepts.length) {
        node.childDepts = undefined
      }
      //   console.log(node)
      return {
        id: node.deptId,
        label: node.name,
        children: node.childDepts
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
