import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";

import "@/assets/icons"; // icon
import "@/permission"; // permission control

import "normalize.css/normalize.css"; // 默认重置css样式，统一各个浏览器样式
import "@/assets/styles/index.scss"; // 全局 css

// build后全局配置
const publicConfig = require("../public/config");
Vue.prototype.$publicConfig = publicConfig;

/**
 * 初始化Element-ui
 */
import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// element ui 全局设置 表格内容不换行实现提示
ElementUI.TableColumn.props.showOverflowTooltip = {
    default: true,
    type: Boolean,
};
Vue.use(ElementUI);

import { message } from "@/utils/reset-message";
Vue.prototype.$message = message;

/**
 * 全局挂载
 */
Vue.prototype.msgSuccess = function (msg, duration = 2000) {
    this.$message({ showClose: true, message: msg, type: "success", duration: duration });
};

Vue.prototype.msgWarning = function (msg, duration = 2000) {
    this.$message({ showClose: true, message: msg, type: "warning", duration: duration });
};

Vue.prototype.msgError = function (msg, duration = 2000) {
    this.$message({ showClose: true, message: msg, type: "error", duration: duration });
};

//校验权限标识
Vue.prototype.checkPermissions = function (permissionsArr) {
    var allPermissions = store.getters && store.getters.permissions;
    const all_permission = "*:*:*";
    const hasPermissions = allPermissions.some((permission) => {
        return all_permission === allPermissions || permissionsArr.includes(permission);
    });
    return hasPermissions;
};

// 内容复制
Vue.prototype.copyContent = function (txt) {
    var obj = document.createElement("input");
    obj.value = txt;
    document.body.appendChild(obj);
    obj.select();
    document.execCommand("Copy");
    this.$message.success("复制成功");
    document.body.removeChild(obj);
};

window.inputCheck = function (max) {
    message.error("该数值不能超过 " + max);
};

import fileters from "@/utils/fileters";
Vue.config.productionTip = false;
// 注册过滤器
for (const key in fileters) {
    if (fileters.hasOwnProperty(key)) {
        Vue.filter(key, fileters[key]);
    }
}

// 权限校验
import permission from "./directive/permission";
Vue.use(permission);

// 表格高度及弹窗自适应
import adaptive from "./directive/table";
Vue.use(adaptive);

// 表格复制
import copy from "./directive/copy";
Vue.use(copy);

// 表格页模板组件
import TableQuery from "@/components/table/table-query";
import TableSelect from "@/components/table/table-select";
import TableBox from "@/components/table/table-box";
Vue.component(TableQuery.name, TableQuery);
Vue.component(TableSelect.name, TableSelect);
Vue.component(TableBox.name, TableBox);

// 图标选择
import IconSelect from "@/components/icon-select";
Vue.component(IconSelect.name, IconSelect);

// 图表组件
import VCharts from "v-charts";
Vue.use(VCharts);

import * as util from "@/utils/index";
Vue.use(util);
// 生产环境取消console.log
util.rewirteLog();

new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
});
