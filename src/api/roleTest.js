export default [
  {
    name: 'Goods',
    path: '/goods',
    redirect: 'noRedirect',
    component: 'Layout',
    alwaysShow: true,
    meta: {
      title: '物资管理',
      icon: 'el-icon-mobile'
    },
    children: [
      {
        name: 'Info',
        path: 'info',
        component: 'goods/info/index',
        meta: {
          title: '库存管理',
          icon: 'el-icon-star-off',
          noCache: false
        }
      },
      {
        name: 'Parameter',
        path: 'parameter',
        component: 'goods/parameter/index',
        meta: {
          title: '物资信息管理',
          icon: 'el-icon-remove-outline'
        }
      }
    ]
  }
]
