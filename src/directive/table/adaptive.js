/* eslint-disable semi */
import { addResizeListener, removeResizeListener } from "@/directive/table/resize-event";

// 设置表格高度
const doResize = async (el, binding, vnode) => {
    // 获取表格Dom对象
    const { componentInstance: $table } = await vnode;
    // 获取调用传递过来的数据
    const { value } = binding;

    if (!$table.height) {
        throw new Error(`el-$table must set the height. Such as height='100px'`);
    }
    // 获取距底部距离（用于展示页码等信息）
    const bottomOffset = (value && value.bottomOffset) || 75;

    if (!$table) return;

    // 计算列表高度并设置
    let height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset;
    // 控制表格最低高度
    if (height < 300) {
        height = 300;
    }
    $table.layout.setHeight(height);
    $table.doLayout();
};

const doLayoutTable = async (el, binding, vnode) => {
    const { componentInstance: $table } = await vnode;
    setTimeout(() => {
        $table.doLayout();
    }, 0);
};

const bindAndUpdate = (el, binding, vnode) => {
    var type = binding.value.type ? binding.value.type : "table";
    switch (type) {
        // 表格自适应
        case "table":
            // 获取header的DOM对象
            const subEl = el.getElementsByClassName("el-table__header")[0];
            // 设置resize监听方法
            el.resizeListener = async () => {
                await doResize(el, binding, vnode);
            };
            // 绑定监听方法到addResizeListener
            addResizeListener(window.document.body, el.resizeListener);
            // 发现头部点击后重新刷新table 用于头部拖拽后造成错位
            subEl.addEventListener("mouseup", async () => {
                await doLayoutTable(el, binding, vnode);
            });
            break;

        // 表格弹窗自适应
        case "dialog":
            setTimeout(() => {
                var elDialog = el.getElementsByClassName("el-dialog");
                var dialogHeight = elDialog[0].offsetHeight;
                if (dialogHeight >= Math.floor(window.innerHeight * 0.9)) {
                    elDialog[0].style.height = "95%";
                }
            }, 0);
            break;
    }
};

export default {
    update(el, binding, vnode) {
        bindAndUpdate(el, binding, vnode);
    },
    componentUpdated(el, binding, vnode) {
        bindAndUpdate(el, binding, vnode);
    },
    // 初始化设置
    bind(el, binding, vnode) {
        bindAndUpdate(el, binding, vnode);
    },
    // 绑定默认高度
    async inserted(el, binding, vnode) {
        switch (binding.value.type) {
            case "table":
                await doResize(el, binding, vnode);
                break;
            case "dialog":
                bindAndUpdate(el, binding, vnode);
                break;
        }
    },
    // 销毁时设置
    unbind(el, binding, vnode) {
        // 移除resize监听
        switch (binding.value.type) {
            case "table":
                removeResizeListener(el, el.resizeListener);
                break;
            case "dialog":
                break;
        }
    },
};
