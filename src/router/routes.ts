import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/my/stats',
    component: () => import('layouts/StatsLayout.vue'),
    redirect: '/my/stats/personal',
    children: [
      {
        path: 'recharge',
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
        path: 'billing',
        component: () => import('pages/billing/BillingIndex.vue'),
        children: [
          {
            path: 'server',
            component: () => import('pages/billing/ServerPage.vue')
          }
        ]
      },
      {
        path: 'personal',
        redirect: '/my/stats/personal/month',
        component: () => import('pages/personal/PersonalIndex.vue'),
        children: [
          {
            path: 'month',
            meta: {
              isPersonal: true
            },
            component: () => import('pages/personal/CurrentMonthList.vue')
          },
          {
            path: 'last',
            meta: {
              isPersonal: true
            },
            component: () => import('pages/personal/LastMonthList.vue')
          },
          {
            path: 'history',
            meta: {
              isPersonal: true
            },
            component: () => import('pages/personal/HistoryList.vue')
          },
          {
            path: 'detail/:serverId',
            meta: {
              isPersonal: true
            },
            component: () => import('pages/public/ServerUsageDetailList.vue')
          }
        ]
      },
      {
        path: 'group',
        redirect: '/my/stats/group/current',
        component: () => import('pages/group/GroupIndex.vue'),
        children: [
          {
            path: 'current',
            component: () => import('pages/group/CurrentMonthList.vue')
          },
          {
            path: 'last',
            component: () => import('pages/group/LastMonthList.vue')
          },
          {
            path: 'history',
            component: () => import('pages/group/HistoryList.vue')
          },
          {
            path: 'detail/:serverId',
            component: () => import('pages/public/ServerUsageDetailList.vue')
          }
        ]
      },
      {
        path: 'storage',
        component: () => import('pages/storage/StorageIndex.vue')
      },
      {
        path: 'statistic',
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
                component: () => import('pages/statistic/cloud/AggregationIndex.vue'),
                children: [
                  {
                    path: 'group',
                    meta: {
                      requireServiceAdmin: true // 服务管理员权限才能访问
                    },
                    component: () => import('pages/statistic/cloud/GroupAggregationList.vue')
                  },
                  {
                    path: 'user',
                    meta: {
                      requireServiceAdmin: true // 服务管理员权限才能访问
                    },
                    component: () => import('pages/statistic/cloud/UserAggregationList.vue')
                  },
                  {
                    path: 'server',
                    meta: {
                      requireServiceAdmin: true // 服务管理员权限才能访问
                    },
                    component: () => import('pages/statistic/cloud/ServerAggregationList.vue')
                  },
                  {
                    path: 'service',
                    meta: {
                      requireServiceAdmin: true // 服务管理员权限才能访问
                    },
                    component: () => import('pages/statistic/cloud/ServiceAggregationList.vue')
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
                meta: {
                  requireServiceAdmin: true, // 服务管理员权限才能访问
                  isPersonal: true
                },
                component: () => import('pages/statistic/cloud/ServerStatisticsDetailList.vue')
              },
              {
                path: 'service/:serviceId',
                meta: {
                  requireServiceAdmin: true, // 服务管理员权限才能访问
                  type: 'service'
                },
                component: () => import('pages/statistic/cloud/ServerUsageDetailList.vue')
              },
              {
                path: 'group/:groupId',
                meta: {
                  requireServiceAdmin: true, // 服务管理员权限才能访问
                  type: 'group'
                },
                component: () => import('pages/statistic/cloud/ServerUsageDetailList.vue')
              },
              {
                path: 'user/:userid',
                meta: {
                  requireServiceAdmin: true, // 服务管理员权限才能访问
                  type: 'user'
                },
                component: () => import('pages/statistic/cloud/ServerUsageDetailList.vue')
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
