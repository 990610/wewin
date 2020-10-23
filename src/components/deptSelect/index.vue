<!--
  name：部门下拉树选择插件（默认部门数据）
  input：{
    deptid：默认部门id（可不传），
    deptdata：默认数据（可不传），
    multiple：是否多选
  }
  outPut：{
    deptid：选中的部门id 单选为数值多选为数组
    result：返回选择对象信息 需要通过函数接收@result=“getResult(result)”接收，单选是获取对象，多选是获取选择的部门id数组同上
  }
  author：pxt
  time：2020-10-23
-->
<template>
  <div>
    <treeselect
      v-model="value"
      :flat="multiple"
      :auto-select-ancestors="multiple"
      :multiple="multiple"
      :options="treeOptions"
      :normalizer="normalizer"
      placeholder="请选择"
      @input="inputChange"
      @select="treeSelect"
      @close="closeTreeSelect"
    />
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
        this.$emit('result', e)
      }
    },
    inputChange(value) {
      // console.log(value)
      if (value === undefined || value.length === 0) {
        this.$emit('update:deptid', value)
        this.$emit('result', value)
      }
    },
    // 下拉树关闭函数
    closeTreeSelect(value, instanceId) {
      if (this.multiple) {
        this.$emit('update:deptid', value)
        this.$emit('result', value)
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
