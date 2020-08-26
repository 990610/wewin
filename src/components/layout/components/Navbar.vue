<template>
  <div class="navbar">
    <!-- 折叠侧面导航显示 -->
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- tab路径显示 -->
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="imgUrl" class="user-avatar">
          <span class="user-name">
            {{ name }}
            <i class="el-icon-caret-bottom" />
          </span>

        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="changePassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="f-dialog">
      <el-dialog
        destroy-on-close
        title="修改密码"
        width="600px"
        :visible.sync="dialog.show"
        :append-to-body="true"
        custom-class="f-dialog"
      >
        <el-form
          ref="dialog.form"
          :model="dialog.form"
          label-width="100px"
          :rules="dialog.rules"
          size="small"
        >
          <el-row>
            <el-col :span="20">
              <el-form-item label="旧密码：" prop="password">
                <el-input
                  v-model="dialog.form.password"
                  placeholder="请输入旧密码"
                  autocomplete="off"
                  type="password"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="新密码：" prop="newPassword">
                <el-input
                  v-model="dialog.form.newPassword"
                  placeholder="请输入新密码"
                  autocomplete="off"
                  type="password"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="确认密码：" prop="rePassword">
                <el-input
                  v-model="dialog.form.rePassword"
                  placeholder="请输入确认密码"
                  autocomplete="off"
                  type="password"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" class="sure-edit-password" @click="dialog.show = false">取 消</el-button>
          <el-button
            size="small"
            class="sure-edit-password"
            type="primary"
            @click="sureAddData('dialog.form')"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { sysUserPassword } from '@/api/system/SysUserController'
import { encode } from '@/utils/index'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      imgUrl:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM1NzlGQTQ5NkY0NjExRUFCOUI0QzJDNEE4N0I5REZDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM1NzlGQTRBNkY0NjExRUFCOUI0QzJDNEE4N0I5REZDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzU3OUZBNDc2RjQ2MTFFQUI5QjRDMkM0QTg3QjlERkMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzU3OUZBNDg2RjQ2MTFFQUI5QjRDMkM0QTg3QjlERkMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ebtqlAAAFBUlEQVR42rxZzW/jVBB/dtLUdZLGTkLbZNtuPqjEXjgg4AYsSEhIHOC+QtxW/A+AWAT8EXBDCM5wQEJCQgvcFsRhr7vdJi20zXadJt3YcZqvnXHnVW5w7Gen6ZNG+fKb+b35fhNpPB6ziCsOtAyUAlKAFoFiREOiHpAN1AE6ARpEESRFAKkB5QmgFGLfmIA+AWrNCySCu0Zac9bu7t6btm2/MhqNKkAbgEMFdmlJYk+BtSXL8h7QI0VR/t7c3PjNxQu1+58oWBGQaNbrBJLt7++/ZJrWG/3+6fuwNSmsDYmZCwuJH5NJ9fdisfgPfY0g60FuEAQSQVSBFtrtdv7x46MPTk9Pb7EZVyKR+H5l5bnvMpkMmr4PtA1kRgGZAaoAyWDW1zudzsfwbI5d0pIkyUilUl+BG/wBH0cE9CQMyDTQFv5eq9XfNU3zczanlUwmPyuVrv9MgfUA6OnkM7LHPoVMLO3s1N6bJ0BcyB/lUKaougNzGkj8XMZcBxp8x7KsT9kVLJSD8ijHlidxTZq7AFQ8ODh4sdk8/hoDJjD043GmaRmWTqcZpBr0NQbBxVqtFjOMJguR4gbZrH67UCjcxyQCdOClyQTQGr5pt08+EgG4tLTEtraeZ6urq0xVVQY50QG5uLjofHfjxgtsbW1VuIKRXEY4El4g8QcZ1T4cDl8V4YoAEJhPBLNcLsdisZgQSpRLZpe5wtwgkYuTXrrd7oeiR0dNBtZCMDdUI2H/dMnPEa5zkDq+39v79zVguCXKEE4e+Az6Z5j+AOUjDsKmu0FqZ6ew3g4Tlf1+X0Ro6Gh34dA4SImSNxsMBjdFGWEkK8qS0HPxeCwUSBcOxCXJlDxlqMsVsIoqyugskoXKH5AcCiTiQDykRIWDRIcthWFk2108scBzPSG38AggjscBGacgCNU8jEZj9vDhNms2m77+WK/XI1UhwJOntwsyD3OIwGQERgzMMjU4oO8U0vaU1KWee9asdReBNhoNz9+mfR92yXRhQgc3IzawTgn0Whsb607gROw3Le41Mm/doXQZYRlhxVlfv3ahNLrNizW8WCw4Bwm7AM8Tno7jdClCgTXovgVSj8R0PcugY/mfcMMw2OFhA+p1Fur6WenVNM0hiFanK4JriKgCajxByARyBHeOR2AZy3+jwqrVqtNYeGlneXn5wquX1iuVcqBmEQfioWuFA3LMW3boDe/6mbZUKvkK4LXcrxQiHwSKruDTo3IciGssu66WwED9NWpbhqvTManT7gb5GysU1nwOco6j5W4wjlEBEI1/ApAHUdsyuK/wahG5zUP5iINMfewGiXYyaPO33lrqBPaNliUOkh/IAzyXb/D06LbfIaKH6+UvYI57k5uhx8OxinN3QRCYatx9Yq/Xc0rlmU8OoV4PLhwAn8d9uB/5ID8PN7iH8kmLhyIXsW94Xb+iNdB1/Tbk1ft0CdufdqXFOmbhjQ0u7XeuECAOCe4QwK5bi14gUc076AuodrgBfnEVAFEOmRl9kOdH3wmGTXOZcblc+mneGkX+KIfy9TavgFEHVp/As9lLHFg1U6nUl66BFWqwPdPor9VqrxwdHd26rNFfPp//Qde1xqyjP78h6k0aoqrimmMWDVHvuoaoqLnarEPUoHH0W7Ztv0zj6E0aR6cAUIfG0btAO3Bj/Gve4+jJpdN0Iepg3+DlTtgKl/gXiULZgv9FMiKNzfwXyTMBBgAMPWU3YZkdlwAAAABJRU5ErkJggg==',
      dialog: {
        show: false,
        form: {
          password: '',
          newPassword: '',
          rePassword: ''
        },
        rules: {
          password: [
            {
              required: true,
              message: '请输入旧密码',
              trigger: 'blur'
            }
          ],
          newPassword: [
            {
              required: true,
              message: '请输入新密码',
              trigger: 'blur'
            }
          ],
          rePassword: [
            {
              required: true,
              message: '请输入确认密码',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changePassword() {
      this.dialog.show = true
    },
    sureAddData() {
      console.log(this.dialog.form.newPassword, this.dialog.form.rePassword)
      if (this.dialog.form.newPassword === this.dialog.form.rePassword) {
        const item = {
          password: encode(this.dialog.form.password),
          newPassword: encode(this.dialog.form.newPassword)
        }
        sysUserPassword(item).then((res) => {
          this.msgSuccess('修改成功,即将重新登录')
          this.dialog.show = false
          setTimeout(() => {
            this.logout()
          }, 2000)
        })
      } else {
        this.$message({
          message: '确认密码与新密码输入不一致',
          type: 'warning'
        })
        this.dialog.form.rePassword = ' '
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
.user-dropdown{
  top:43px !important;
}
.navbar {
	height: 50px;
	overflow: hidden;
	position: relative;
	background: $navBackgroudColor;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	.hamburger-container {
		line-height: 46px;
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.breadcrumb-container {
		float: left;
	}

	.right-menu {
		float: right;
		height: 100%;
		line-height: 50px;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 30px;

			.avatar-wrapper {
				margin-top: 5px;
				position: relative;

				.user-avatar {
					cursor: pointer;
					width: 40px;
					height: 40px;
					border-radius: 10px;
				}
        .user-name{
          vertical-align: top;
          height: 40px;
          font-size: 16px;
          color: #ffffff;
          padding: 0 5px;
          display: inline-block;
          line-height: 40px;
          cursor: pointer;
        }
			}
		}
	}
}
</style>
