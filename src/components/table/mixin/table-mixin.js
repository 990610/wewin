export default {
    data() {
        return {
            // 分页
            pagination: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
                pageRange: [10, 20, 30, 50, 100],
            },
            // 表格加载
            loading: true,
            // 表格list
            dataList: [],
            // 弹窗
            addOrUpdateVisible: false,
            //多选数组
            dataListSelections: [],
        };
    },
    mounted() {
        this.getDataList(1);
    },
    methods: {
        // 查询
        handleQuery() {
            this.getDataList(1);
        },
        // 重置查询
        resetQuery() {
            this.queryForm = this.$options.data().queryForm;
            this.getDataList(1);
        },
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val;
        },
        // 分页大小选择
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.getDataList(1);
        },
        // 分页页面跳转
        handleCurrentChange(val) {
            this.pagination.pageNo = val;
            this.getDataList(val);
        },
        // 编辑
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        // 删除
        deleteHandle(func, msg) {
            this.$confirm(msg ? msg : `是否确定删除?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    func ? func() : "";
                })
                .catch(function () {});
        },
    },
};
