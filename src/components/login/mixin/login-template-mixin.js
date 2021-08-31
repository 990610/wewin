import { randomString, encode } from "@/utils/index.js";
import { backendIP } from "@/utils/request.js";

export default {
    name: "Login",
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入用户名"));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username: "",
                password: "",
                captcha: "",
                uuid: "",
            },
            loginRules: {
                username: [{ required: true, trigger: "blur", validator: validateUsername }],
                password: [{ required: true, trigger: "blur", validator: validatePassword }],
                captcha: [{ required: true, trigger: "blur", message: "请输入验证码" }],
            },
            loading: false,
            passwordType: "password",
            redirect: undefined,
            codeUrl: "",
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true,
        },
    },
    mounted() {
        this.getCode();
    },
    methods: {
        showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "";
            } else {
                this.passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    const ps = encode(this.loginForm.password);
                    const item = {
                        username: this.loginForm.username,
                        password: ps,
                        captcha: this.loginForm.captcha,
                        uuid: this.loginForm.uuid,
                    };
                    this.$store
                        .dispatch("user/login", item)
                        .then(() => {
                            this.$router.push({ path: "/" });
                            this.loading = false;
                        })
                        .catch(() => {
                            this.loading = false;
                            this.loginForm.captcha = "";
                            this.getCode();
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getCode() {
            this.loginForm.uuid = randomString(16);
            this.codeUrl = backendIP + "/captcha.jpg?uuid=" + this.loginForm.uuid;
        },
    },
};
