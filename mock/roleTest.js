export const data = [
  {
    'name': 'Goods',
    'path': '/goods',
    'redirect': 'noRedirect',
    'component': 'Layout',
    'alwaysShow': true,
    'meta': {
      'title': '物资管理',
      'icon': 'dict'
    },
    'children': [
      {
        'name': 'Info',
        'path': 'info',
        'component': 'goods/info/index',
        'meta': {
          'title': '库存管理',
          'icon': 'table'
        }
      },
      {
        'name': 'Parameter',
        'path': 'parameter',
        'component': 'goods/parameter/index',
        'meta': {
          'title': '物资信息管理',
          'icon': 'cascader'
        }
      }
    ]
  },
  {
    'name': 'Business',
    'path': '/business',
    'redirect': 'noRedirect',
    'component': 'Layout',
    'alwaysShow': true,
    'meta': {
      'title': '业务管理',
      'icon': 'slider'
    },
    'children': [
      {
        'name': 'Laidin',
        'path': 'laidin',
        'component': 'business/laidin/index',
        'meta': {
          'title': '物资入库',
          'icon': 'nested'
        }
      },
      {
        'name': 'Laidout',
        'path': 'laidout',
        'component': 'business/laidout/index',
        'meta': {
          'title': '物资出库',
          'icon': 'list'
        }
      },
      {
        'name': 'Back',
        'path': 'back',
        'component': 'business/back/index',
        'meta': {
          'title': '物资退库',
          'icon': 'form'
        }
      }
    ]
  },
  {
    'name': 'Storagemonitor',
    'path': '/storagemonitor',
    'redirect': 'noRedirect',
    'component': 'Layout',
    'alwaysShow': true,
    'meta': {
      'title': '库房监控',
      'icon': 'example'
    },
    'children': [
      {
        'name': 'Environment',
        'path': 'environment',
        'component': 'storagemonitor/environment/index',
        'meta': {
          'title': '环境监控',
          'icon': 'dashboard'
        }
      },
      {
        'name': 'Video',
        'path': 'video',
        'component': 'storagemonitor/video/index',
        'meta': {
          'title': '视频监控',
          'icon': 'server'
        }
      }
    ]
  },
  {
    'name': 'Report',
    'path': '/report',
    'redirect': 'noRedirect',
    'component': 'Layout',
    'alwaysShow': true,
    'meta': {
      'title': '报表管理',
      'icon': 'excel'
    },
    'children': [
      {
        'name': 'Stock',
        'path': 'stock',
        'component': 'report/stock/index',
        'meta': {
          'title': '物资库存统计',
          'icon': 'chart'
        }
      },
      {
        'name': 'Laidin',
        'path': 'laidin',
        'component': 'report/laidin/index',
        'meta': {
          'title': '物资入库统计',
          'icon': 'nested'
        }
      },
      {
        'name': 'Laidout',
        'path': 'laidout',
        'component': 'report/laidout/index',
        'meta': {
          'title': '物资出库统计',
          'icon': 'list'
        }
      },
      {
        'name': 'Back',
        'path': 'back',
        'component': 'report/back/index',
        'meta': {
          'title': '物资退库统计',
          'icon': 'form'
        }
      }
    ]
  },
  {
    'name': 'Storagemanager',
    'path': '/storagemanager',
    'redirect': 'noRedirect',
    'component': 'Layout',
    'alwaysShow': true,
    'meta': {
      'title': '库房管理',
      'icon': 'textarea'
    },
    'children': [
      {
        'name': 'Info',
        'path': 'info',
        'component': 'storagemanager/info/index',
        'meta': {
          'title': '库房信息管理',
          'icon': 'row'
        }
      },
      {
        'name': 'Location',
        'path': 'location',
        'component': 'storagemanager/location/index',
        'meta': {
          'title': '库房货位管理',
          'icon': 'eye-open'
        }
      },
      {
        'name': 'Device',
        'path': 'device',
        'component': 'storagemanager/device/index',
        'meta': {
          'title': '库房设备管理',
          'icon': 'druid'
        }
      }
    ]
  },
  {
    'name': 'System',
    'path': '/system',
    'redirect': 'noRedirect',
    'component': 'Layout',
    'alwaysShow': true,
    'meta': {
      'title': '系统管理',
      'icon': 'system'
    },
    'children': [
      {
        'name': 'Category',
        'path': 'category',
        'component': 'system/category/index',
        'meta': {
          'title': '物资分类管理',
          'icon': 'date'
        }
      },
      {
        'name': 'User',
        'path': 'user',
        'component': 'system/user/index',
        'meta': {
          'title': '用户管理',
          'icon': 'user'
        }
      },
      {
        'name': 'Role',
        'path': 'role',
        'component': 'system/role/index',
        'meta': {
          'title': '角色管理',
          'icon': 'peoples'
        }
      },
      {
        'name': 'Menu',
        'path': 'menu',
        'component': 'system/menu/index',
        'meta': {
          'title': '菜单管理',
          'icon': 'tree-table'
        }
      },
      {
        'name': 'Dept',
        'path': 'dept',
        'component': 'system/dept/index',
        'meta': {
          'title': '机构管理',
          'icon': 'tree'
        }
      },
      {
        'name': 'Post',
        'path': 'post',
        'component': 'system/post/index',
        'meta': {
          'title': '岗位管理',
          'icon': 'post'
        }
      },
      {
        'name': 'Dict',
        'path': 'dict',
        'component': 'system/dict/index',
        'meta': {
          'title': '字典管理',
          'icon': 'dict'
        }
      },
      {
        'name': 'Config',
        'path': 'config',
        'component': 'system/config/index',
        'meta': {
          'title': '参数设置',
          'icon': 'edit'
        }
      },
      {
        'name': 'Log',
        'path': 'log',
        'redirect': 'noRedirect',
        'component': 'system/log/index',
        'alwaysShow': true,
        'meta': {
          'title': '日志管理',
          'icon': 'log'
        },
        'children': [
          {
            'name': 'Operlog',
            'path': 'operlog',
            'component': 'monitor/operlog/index',
            'meta': {
              'title': '操作日志',
              'icon': 'form'
            }
          },
          {
            'name': 'Logininfor',
            'path': 'logininfor',
            'component': 'monitor/logininfor/index',
            'meta': {
              'title': '登录日志',
              'icon': 'logininfor'
            }
          }
        ]
      }
    ]
  },
  {
    'name': 'Monitor',
    'path': '/monitor',
    'redirect': 'noRedirect',
    'component': 'Layout',
    'alwaysShow': true,
    'meta': {
      'title': '系统监控',
      'icon': 'monitor'
    },
    'children': [
      {
        'name': 'Online',
        'path': 'online',
        'component': 'monitor/online/index',
        'meta': {
          'title': '在线用户',
          'icon': 'online'
        }
      },
      {
        'name': 'Job',
        'path': 'job',
        'component': 'monitor/job/index',
        'meta': {
          'title': '定时任务',
          'icon': 'job'
        }
      },
      {
        'name': 'Druid',
        'path': 'druid',
        'component': 'monitor/druid/index',
        'meta': {
          'title': '数据监控',
          'icon': 'druid'
        }
      },
      {
        'name': 'Server',
        'path': 'server',
        'component': 'monitor/server/index',
        'meta': {
          'title': '服务监控',
          'icon': 'server'
        }
      },
      {
        'name': 'Swagger',
        'path': 'swagger',
        'component': 'monitor/swagger/index',
        'meta': {
          'title': '系统接口',
          'icon': 'swagger'
        }
      }
    ]
  }
]
