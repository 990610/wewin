<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
        <sidebar class="sidebar-container" />
        <div :class="{ hasTagsView: needTagsView }" class="main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
                <navbar />
                <tags-view v-if="needTagsView" />
            </div>
            <app-main />
        </div>
    </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/resize-handler";

export default {
    name: "Layout",
    components: {
        Navbar,
        Sidebar,
        AppMain,
        TagsView,
    },
    mixins: [ResizeMixin],
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar;
        },
        device() {
            return this.$store.state.app.device;
        },
        fixedHeader() {
            return this.$store.state.settings.fixedHeader;
        },
        needTagsView() {
            return this.$store.state.settings.tagsView;
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === "mobile",
            };
        },
    },
    created() {},
    methods: {
        handleClickOutside() {
            this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    min-width: 1000px;
    // min-height: 800px;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$menuWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
.el-header,
.el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    // line-height: 200px;
}

// .el-main {
//   background-color: #E9EEF3;
//   color: #333;
//   text-align: center;
//   line-height: 160px;
// }

// body > .el-container {
//   margin-bottom: 40px;
// }

// .el-container:nth-child(5) .el-aside,
// .el-container:nth-child(6) .el-aside {
//   line-height: 260px;
// }

// .el-container:nth-child(7) .el-aside {
//   line-height: 320px;
// }
</style>
