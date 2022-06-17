import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/my/stats',
    component: () => import('layouts/StatsLayout.vue'),
    redirect: '/my/stats/recharge',
    children: [
      {
        path: 'recharge',
        name: '账户与充值',
        redirect: '/my/stats/recharge/personal',
        component: () => import('pages/recharge/RechargeIndex.vue'),
        children: [
          {
            path: 'personal',
            component: () => import('pages/recharge/personal/PersonalIndex.vue')
          },
          {
            path: 'group',
            component: () => import('pages/recharge/group/GroupIndex.vue')
          }
        ]
      },
      {
        path: 'personal',
        name: '个人云主机用量列表',
        redirect: '/my/stats/personal/month',
        component: () => import('pages/personal/PersonalIndex.vue'),
        children: [
          {
            path: 'month',
            component: () => import('pages/personal/ThisMonthList.vue')
          },
          {
            path: 'last',
            component: () => import('pages/personal/LastMonthList.vue')
          },
          {
            path: 'history',
            component: () => import('pages/personal/HistoryList.vue')
          }
        ]
      },
      {
        path: 'group',
        name: '项目组云主机用量列表',
        redirect: '/my/stats/group/server',
        component: () => import('pages/group/GroupIndex.vue'),
        children: [
          {
            path: 'server',
            component: () => import('pages/group/GroupList.vue')
          }
        ]
      },
      {
        path: 'storage',
        component: () => import('pages/storage/StorageIndex.vue')
      },
      {
        path: 'statistic',
        name: '用量管理统计',
        meta: {
          requireServiceAdmin: true // 服务管理员权限才能访问
        },
        redirect: '/my/stats/statistic/list',
        component: () => import('pages/statistic/MeteringIndex.vue'),
        children: [
          {
            path: 'list',
            meta: {
              requireServiceAdmin: true // 服务管理员权限才能访问
            },
            redirect: '/my/stats/statistic/list/cloud',
            component: () => import('pages/statistic/StatisticsIndex.vue'),
            children: [
              {
                path: 'cloud',
                meta: {
                  requireServiceAdmin: true // 服务管理员权限才能访问
                },
                redirect: '/my/stats/statistic/list/cloud/server',
                component: () => import('pages/statistic/cloud/CloudList.vue'),
                children: [
                  {
                    path: 'group',
                    meta: {
                      requireServiceAdmin: true // 服务管理员权限才能访问
                    },
                    component: () => import('pages/statistic/cloud/GroupList.vue')
                  },
                  {
                    path: 'user',
                    meta: {
                      requireServiceAdmin: true // 服务管理员权限才能访问
                    },
                    component: () => import('pages/statistic/cloud/UserList.vue')
                  },
                  {
                    path: 'server',
                    meta: {
                      requireServiceAdmin: true // 服务管理员权限才能访问
                    },
                    component: () => import('pages/statistic/cloud/ServerList.vue')
                  },
                  {
                    path: 'service',
                    meta: {
                      requireServiceAdmin: true // 服务管理员权限才能访问
                    },
                    component: () => import('pages/statistic/cloud/ServiceList.vue')
                  }
                ]
              },
              {
                path: 'storage',
                meta: {
                  requireServiceAdmin: true // 服务管理员权限才能访问
                },
                component: () => import('pages/statistic/storage/StorageList.vue')
              },
              {
                path: 'server/:serverId',
                name: '云主机用量明细',
                meta: {
                  requireServiceAdmin: true // 服务管理员权限才能访问
                },
                component: () => import('pages/statistic/cloud/DetailServer.vue')
              },
              {
                path: 'service/:serviceId',
                name: '服务用量列表',
                meta: {
                  requireServiceAdmin: true, // 服务管理员权限才能访问
                  type: 'service'
                },
                component: () => import('pages/statistic/cloud/DetailList.vue')
              },
              {
                path: 'group/:groupId',
                name: '项目组用量列表',
                meta: {
                  requireServiceAdmin: true, // 服务管理员权限才能访问
                  type: 'group'
                },
                component: () => import('pages/statistic/cloud/DetailList.vue')
              },
              {
                path: 'user/:userid',
                name: '用户用量列表',
                meta: {
                  requireServiceAdmin: true, // 服务管理员权限才能访问
                  type: 'user'
                },
                component: () => import('pages/statistic/cloud/DetailList.vue')
              }
            ]
          }
        ]
      },
      {
        path: 'account',
        meta: {
          requireServiceAdmin: true // 服务管理员权限才能访问
        },
        component: () => import('pages/account/AccountIndex.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
