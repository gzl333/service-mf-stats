import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/my/stats',
    component: () => import('layouts/StatsLayout.vue'),
    redirect: '/my/stats/consumption',
    children: [
      {
        path: 'recharge',
        redirect: '/my/stats/recharge/consumption',
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
        path: 'consumption',
        redirect: '/my/stats/consumption/personal',
        component: () => import('pages/consumption/ConsumptionIndex.vue'),
        children: [
          {
            path: 'personal',
            meta: {
              // 用于判断详情页跳转
              isPersonal: true
            },
            component: () => import('pages/consumption/PersonalConsumptionList.vue')
          },
          {
            path: 'personal/server/:serverId',
            component: () => import('pages/public/ServerStatisticsDetailList.vue')
          },
          {
            path: 'group',
            component: () => import('pages/consumption/GroupList.vue')
          },
          {
            path: 'group/metering/:voId',
            component: () => import('pages/consumption/GroupConsumptionList.vue')
          },
          {
            path: 'group/metering/server/:serverId',
            component: () => import('pages/public/ServerStatisticsDetailList.vue')
          },
          {
            path: 'storage',
            component: () => import('pages/consumption/StorageList.vue')
          }
        ]
      },
      {
        path: 'settlement',
        component: () => import('pages/settlement/SettlementIndex.vue')
      },
      {
        path: 'statistic',
        redirect: '/my/stats/statistic/list',
        component: () => import('pages/statistic/MeteringIndex.vue'),
        children: [
          {
            path: 'list',
            redirect: '/my/stats/statistic/list/cloud',
            component: () => import('pages/statistic/StatisticsIndex.vue'),
            children: [
              {
                path: 'cloud',
                redirect: '/my/stats/statistic/list/cloud/server',
                component: () => import('pages/statistic/server/AggregationIndex.vue'),
                children: [
                  {
                    path: 'group',
                    component: () => import('pages/statistic/server/GroupAggregationList.vue')
                  },
                  {
                    path: 'user',
                    component: () => import('pages/statistic/server/UserAggregationList.vue')
                  },
                  {
                    path: 'server',
                    component: () => import('pages/statistic/server/ServerAggregationList.vue')
                  },
                  {
                    path: 'service',
                    component: () => import('pages/statistic/server/ServiceAggregationList.vue')
                  }
                ]
              },
              {
                path: 'storage',
                component: () => import('pages/statistic/storage/StorageList.vue')
              },
              {
                path: 'server/:serverId',
                meta: {
                  isPersonal: true
                },
                component: () => import('pages/public/ServerStatisticsDetailList.vue')
              },
              {
                path: 'service/:serviceId',
                meta: {
                  type: 'service',
                  isPersonal: false
                },
                component: () => import('pages/statistic/server/ServerUsageDetailList.vue')
              },
              {
                path: 'group/:groupId',
                meta: {
                  type: 'group',
                  isPersonal: false
                },
                component: () => import('pages/statistic/server/ServerUsageDetailList.vue')
              },
              {
                path: 'user/:userid',
                meta: {
                  type: 'user',
                  isPersonal: false
                },
                component: () => import('pages/statistic/server/ServerUsageDetailList.vue')
              },
              {
                path: 'details/:serverId',
                component: () => import('pages/public/ServerStatisticsDetailList.vue')
              },
              {
                path: 'detail/:serverId',
                component: () => import('pages/public/ServerStatisticsDetailList.vue')
              }
            ]
          }
        ]
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
