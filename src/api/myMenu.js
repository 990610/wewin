export default [{
  name: 'System',
  path: '/system',
  redirect: 'noRedirect',
  component: 'Layout',
  alwaysShow: true,
  meta: {
    title: '系统设置',
    icon: 'el-icon-mobile',
    noCache: false
  },
  children: [{
    name: 'ManagerList',
    path: 'managerlist',
    component: 'system/managerList',
    meta: {
      title: '管理员列表',
      icon: 'el-icon-star-off',
      noCache: false
    }
  },
  {
    name: 'SystemRole',
    path: 'systemRole',
    component: 'system/systemRole',
    meta: {
      title: '角色管理',
      icon: 'el-icon-remove-outline'
    }
  },
  {
    name: 'SystemMenu',
    path: 'systemMenu',
    component: 'system/systemMenu',
    meta: {
      title: '菜单管理',
      icon: 'el-icon-remove-outline'
    }
  },
  {
    name: 'SystemTimer',
    path: 'systemTimer',
    component: 'system/systemTimer',
    meta: {
      title: '定时任务',
      icon: 'el-icon-remove-outline'
    }
  },
  {
    name: 'SystemParameter',
    path: 'systemParameter',
    component: 'system/systemParameter',
    meta: {
      title: '参数管理',
      icon: 'el-icon-remove-outline'
    }
  },
  {
    name: 'SystemLog',
    path: 'systemLog',
    component: 'system/systemLog',
    meta: {
      title: '系统日志',
      icon: 'el-icon-remove-outline'
    }
  }
  ]
}]
