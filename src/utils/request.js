import axios from "axios";
import store from "@/store";
import { getToken, removeToken } from "@/utils/auth";
import { ToPathStr } from "@/utils/index";
import router from "../router";
import md5 from "js-md5";
import { message } from "@/utils/reset-message";

export var backendIP = window.publicConfig.ip[process.env.NODE_ENV];
export var mockIP = ""; // 模拟IP地址

const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    timeout: 5000, // request timeout
});
service.interceptors.request.use(
    (config) => {
        if (store.getters.token) {
            config.headers["token"] = getToken();
        }
        // 接口请求验签
        config.headers["signature"] = "";
        if (config.data) {
            config.headers["signature"] = md5(md5(JSON.stringify(config.data)));
        } else if (config.hasOwnProperty("params") && config.params) {
            // console.log(ToPathStr(config.params))
            config.headers["signature"] = md5(md5(ToPathStr(config.params)));
        }
        return config;
    },
    (error) => {
        console.log(error); // for debug
        return Promise.reject(error);
    }
);
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res.code === 200) {
            return res.result;
        } else if (res.code === 500) {
            message({
                message: res.message || "Error",
                type: "error",
                duration: 5 * 1000,
            });
            return Promise.reject(new Error(res.message || "Error"));
        } else if (res.code === 401) {
            removeToken();
            router.push("/login");
            store.commit("user/RESET_STATE");
            store.dispatch("tagsView/delAllViews");
            // router.go(0)
            message({
                message: res.message,
                type: "error",
                duration: 5000,
            });
        } else {
            return res;
        }
    },
    (error) => {
        if (error.message.includes("timeout")) {
            error.message = "请求超时";
        } else if (error.message.includes("status code 500")) {
            error.message = "系统维护中！";
        } else if (error.message.includes("Network Error")) {
            error.message = "网络断开！";
        }
        message({
            message: error.message,
            type: "error",
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);

export default service;
