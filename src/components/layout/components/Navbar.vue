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
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      imgUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM1NzlGQTQ5NkY0NjExRUFCOUI0QzJDNEE4N0I5REZDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM1NzlGQTRBNkY0NjExRUFCOUI0QzJDNEE4N0I5REZDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzU3OUZBNDc2RjQ2MTFFQUI5QjRDMkM0QTg3QjlERkMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzU3OUZBNDg2RjQ2MTFFQUI5QjRDMkM0QTg3QjlERkMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ebtqlAAAFBUlEQVR42rxZzW/jVBB/dtLUdZLGTkLbZNtuPqjEXjgg4AYsSEhIHOC+QtxW/A+AWAT8EXBDCM5wQEJCQgvcFsRhr7vdJi20zXadJt3YcZqvnXHnVW5w7Gen6ZNG+fKb+b35fhNpPB6ziCsOtAyUAlKAFoFiREOiHpAN1AE6ARpEESRFAKkB5QmgFGLfmIA+AWrNCySCu0Zac9bu7t6btm2/MhqNKkAbgEMFdmlJYk+BtSXL8h7QI0VR/t7c3PjNxQu1+58oWBGQaNbrBJLt7++/ZJrWG/3+6fuwNSmsDYmZCwuJH5NJ9fdisfgPfY0g60FuEAQSQVSBFtrtdv7x46MPTk9Pb7EZVyKR+H5l5bnvMpkMmr4PtA1kRgGZAaoAyWDW1zudzsfwbI5d0pIkyUilUl+BG/wBH0cE9CQMyDTQFv5eq9XfNU3zczanlUwmPyuVrv9MgfUA6OnkM7LHPoVMLO3s1N6bJ0BcyB/lUKaougNzGkj8XMZcBxp8x7KsT9kVLJSD8ijHlidxTZq7AFQ8ODh4sdk8/hoDJjD043GmaRmWTqcZpBr0NQbBxVqtFjOMJguR4gbZrH67UCjcxyQCdOClyQTQGr5pt08+EgG4tLTEtraeZ6urq0xVVQY50QG5uLjofHfjxgtsbW1VuIKRXEY4El4g8QcZ1T4cDl8V4YoAEJhPBLNcLsdisZgQSpRLZpe5wtwgkYuTXrrd7oeiR0dNBtZCMDdUI2H/dMnPEa5zkDq+39v79zVguCXKEE4e+Az6Z5j+AOUjDsKmu0FqZ6ew3g4Tlf1+X0Ro6Gh34dA4SImSNxsMBjdFGWEkK8qS0HPxeCwUSBcOxCXJlDxlqMsVsIoqyugskoXKH5AcCiTiQDykRIWDRIcthWFk2108scBzPSG38AggjscBGacgCNU8jEZj9vDhNms2m77+WK/XI1UhwJOntwsyD3OIwGQERgzMMjU4oO8U0vaU1KWee9asdReBNhoNz9+mfR92yXRhQgc3IzawTgn0Whsb607gROw3Le41Mm/doXQZYRlhxVlfv3ahNLrNizW8WCw4Bwm7AM8Tno7jdClCgTXovgVSj8R0PcugY/mfcMMw2OFhA+p1Fur6WenVNM0hiFanK4JriKgCajxByARyBHeOR2AZy3+jwqrVqtNYeGlneXn5wquX1iuVcqBmEQfioWuFA3LMW3boDe/6mbZUKvkK4LXcrxQiHwSKruDTo3IciGssu66WwED9NWpbhqvTManT7gb5GysU1nwOco6j5W4wjlEBEI1/ApAHUdsyuK/wahG5zUP5iINMfewGiXYyaPO33lrqBPaNliUOkh/IAzyXb/D06LbfIaKH6+UvYI57k5uhx8OxinN3QRCYatx9Yq/Xc0rlmU8OoV4PLhwAn8d9uB/5ID8PN7iH8kmLhyIXsW94Xb+iNdB1/Tbk1ft0CdufdqXFOmbhjQ0u7XeuECAOCe4QwK5bi14gUc076AuodrgBfnEVAFEOmRl9kOdH3wmGTXOZcblc+mneGkX+KIfy9TavgFEHVp/As9lLHFg1U6nUl66BFWqwPdPor9VqrxwdHd26rNFfPp//Qde1xqyjP78h6k0aoqrimmMWDVHvuoaoqLnarEPUoHH0W7Ztv0zj6E0aR6cAUIfG0btAO3Bj/Gve4+jJpdN0Iepg3+DlTtgKl/gXiULZgv9FMiKNzfwXyTMBBgAMPWU3YZkdlwAAAABJRU5ErkJggg=='
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background:$navBackgroudColor;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
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
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
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

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
