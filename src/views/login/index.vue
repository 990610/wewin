<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Login xForm</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          maxlength="30"
          type="text"
          tabindex="1"
          auto-complete="new-password"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          maxlength="30"
          tabindex="2"
          auto-complete="new-password"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="captcha">
        <span class="svg-container">
          <svg-icon style="font-size:16px;" icon-class="validCode" />
        </span>
        <el-input
          ref="loginForm.captcha"
          v-model="loginForm.captcha"
          placeholder="验证码"
          type="text"
          tabindex="1"
          auto-complete="off"
          style="width:45%;background-color:#fff;margin-left:10px;"
          maxlength="5"
          @keyup.enter.native="handleLogin"
        />
        <div class="login-code">
          <img :src="codeUrl" @click="getCode">
        </div>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { randomString, encode } from '@/utils/index.js'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin',
        captcha: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      codeUrl: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.getCode()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const ps = encode(this.loginForm.password)
          const item = {
            username: this.loginForm.username,
            password: ps,
            captcha: this.loginForm.captcha,
            uuid: this.loginForm.uuid
          }
          this.$store
            .dispatch('user/login', item)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
              this.loginForm.captcha = ''
              this.getCode()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCode() {
      console.log(1)
      this.loginForm.uuid = randomString(16)
      this.codeUrl =
				process.env.VUE_APP_BASE_API +
				'/captcha.jpg?uuid=' +
				this.loginForm.uuid
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
// 背景颜色
$bg: #f0f2f5;
// 输入框内字体颜色
$light_gray: #242425;
// 光标颜色
$cursor: #000000;
// 图标颜色
$dark_gray: #242425;
// 标题颜色
$light_gray: #242425;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
	.login-container .el-input input {
		color: $cursor;
	}
}

/* reset element-ui css */
.login-container {
	.el-input {
		display: inline-block;
		height: 47px;
		width: 85%;
		input {
			background: #ffffff;
			border: 0px;
			-webkit-appearance: none;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			color: $light_gray;
			height: 47px;
			caret-color: $cursor;

			&:-webkit-autofill {
				box-shadow: 0 0 0px 1000px $bg inset !important;
				-webkit-text-fill-color: $cursor !important;
			}
		}
	}

	.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
	}
	.login-code {
		width: 200px;
		height: 52px;
		float: right;
		background: #eee;
		img {
			cursor: pointer;
			vertical-align: middle;
			width: 100%;
			height: 100%;
		}
	}
}
.login-container {
	min-height: 100%;
	width: 100%;
	background-color: $bg;
	overflow: hidden;

	.login-form {
		position: relative;
		width: 520px;
		max-width: 100%;
		padding: 160px 35px 0;
		margin: 0 auto;
		overflow: hidden;
		.el-form-item {
			background: #ffffff;
		}
	}

	.svg-container {
		padding: 6px 5px 6px 15px;
		color: $dark_gray;
		vertical-align: middle;
		width: 30px;
		display: inline-block;
		svg-icon {
			font-size: 14px;
		}
	}

	.title-container {
		position: relative;
		.title {
			font-size: 26px;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
	}
	.show-pwd {
		position: absolute;
		right: 10px;
		top: 7px;
		font-size: 16px;
		color: $dark_gray;
		cursor: pointer;
		user-select: none;
	}
}
</style>
