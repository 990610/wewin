<template>
    <div class="table-box">
        <div class="box-btn">
            <slot name="btn" />
        </div>
        <div class="box-content">
            <slot name="content" />
        </div>
        <div class="box-pagination" v-if="isPaginationShow">
            <el-pagination
                background
                :current-page="pagination.pageNo"
                :page-sizes="pagination.pageRange"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>
<script>
export default {
    name: "TableBox",
    props: {
        pagination: {
            type: Object,
            default: () => {
                return {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                    pageRange: [10, 20, 30, 50, 100],
                };
            },
        },
        handleSizeChange: {
            type: Function,
            default: function () {},
        },
        handleCurrentChange: {
            type: Function,
            default: function () {},
        },
        isPaginationShow: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {};
    },
    mounted() {
        var boxBtn = document.getElementsByClassName("box-btn")[0];
        if (boxBtn.offsetHeight == 0) {
            boxBtn.style.display = "none";
        }
    },
    computed: {},
    methods: {},
};
</script>
