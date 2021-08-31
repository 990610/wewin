<template>
    <div class="dashboard-container app-container">
        <h3>首页</h3>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    // eslint-disable-next-line vue/name-property-casing
    name: "Dashboard",
    components: {},
    data() {
        return {};
    },
    computed: {
        ...mapGetters(["name"]),
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.dashboard {
    &-text {
        font-size: 50px;
        line-height: 46px;
    }
}
h3 {
    margin-top: 15px;
}
.mycharts {
    width: 300px;
    height: 300px;
    border: 1px solid skyblue;
    // background: skyblue;
}
</style>
