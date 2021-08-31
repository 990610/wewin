<template>
    <div>
        <div class="table-query" :style="{ height: queryHeight }">
            <div class="query-title">
                <div class="txt">条件筛选</div>
                <div v-if="moreShow" class="more" @click="moreQuery">{{ queryMoreTxt }} <i :class="queryMoreIcon"></i></div>
            </div>
            <div class="query-content" :style="{ width: queryContentWidth }">
                <el-form :inline="true">
                    <slot />
                </el-form>
            </div>
            <div class="query-btn" :class="isExpand">
                <el-button type="primary" icon="el-icon-search" @click="handleQuery" size="medium">查询</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetQuery" size="medium">重置</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "TableQuery",
    props: {
        handleQuery: {
            type: Function,
            default: function () {},
        },
        resetQuery: {
            type: Function,
            default: function () {},
        },
    },
    data() {
        return {
            queryHeight: "94px",
            queryMoreTxt: "展开",
            queryMoreIcon: "el-icon-arrow-down",
            moreShow: false,
            queryContentWidth: "calc(100% - 210px)",
            isExpand: "",
        };
    },
    mounted() {
        this.$nextTick(() => {
            var elForm = document.querySelector(".table-query .query-content .el-form");
            if (elForm.offsetHeight < 60) {
                this.moreShow = false;
            } else {
                this.moreShow = true;
            }
        });
    },
    methods: {
        moreQuery() {
            if (this.queryHeight == "94px") {
                this.queryHeight = "100%";
                this.queryMoreTxt = "收起";
                this.queryMoreIcon = "el-icon-arrow-up";
                this.queryContentWidth = "100%";
                this.$nextTick(() => {
                    setTimeout(() => {
                        var items = document.querySelectorAll(".table-query .query-content .el-form .el-form-item");
                        var elForm = document.querySelector(".table-query .query-content .el-form");
                        var width = 0;
                        var arr = [];
                        for (let i = 0; i < items.length; i++) {
                            const element = items[i];
                            width += element.offsetWidth + 10;
                            if (width > elForm.offsetWidth) {
                                arr.push(i);
                                width = 0;
                                i--;
                            }
                        }
                        width = 0;
                        if (arr.length == 0) {
                            arr.push(0);
                        }
                        for (let i = arr[arr.length - 1]; i < items.length; i++) {
                            const element = items[i];
                            width += element.offsetWidth + 10;
                        }
                        if (width < elForm.offsetWidth - 195) {
                            this.isExpand = "";
                        } else {
                            this.isExpand = "active";
                        }
                    }, 100);
                });
            } else {
                this.queryHeight = "94px";
                this.queryMoreTxt = "展开";
                this.queryMoreIcon = "el-icon-arrow-down";
                setTimeout(() => {
                    this.queryContentWidth = "calc(100% - 210px)";
                    this.isExpand = "";
                }, 230);
            }
        },
    },
};
</script>
