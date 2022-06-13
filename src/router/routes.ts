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
        meta: {
          roles: ['federal-admin', 'ordinary']
        },
        redirect: '/my/stats/recharge/personal',
        component: () => import('pages/admin/recharge/RechargeIndex.vue'),
        children: [
          {
            path: 'personal',
            meta: {
              roles: ['federal-admin']
            },
            component: () => import('pages/admin/recharge/personal/PersonalIndex.vue')
          },
          {
            path: 'group',
            meta: {
              roles: ['federal-admin']
            },
            component: () => import('pages/admin/recharge/group/GroupIndex.vue')
          }
        ]
      },
      {
        path: 'personal',
        name: '个人云主机用量列表',
        meta: {
          roles: ['federal-admin', 'ordinary']
        },
        redirect: '/my/stats/personal/server',
        component: () => import('pages/admin/personal/PersonalIndex.vue'),
        children: [
          {
            path: 'server',
            meta: {
              roles: ['federal-admin']
            },
            component: () => import('pages/admin/personal/PersonalList.vue')
          }
        ]
      },
      {
        path: 'group',
        name: '项目组云主机用量列表',
        meta: {
          roles: ['federal-admin', 'ordinary']
        },
        redirect: '/my/stats/group/server',
        component: () => import('pages/admin/group/GroupIndex.vue'),
        children: [
          {
            path: 'server',
            meta: {
              roles: ['federal-admin']
            },
            component: () => import('pages/admin/group/GroupList.vue')
          }
        ]
      },
      {
        path: 'storage',
        meta: {
          roles: ['federal-admin', 'ordinary']
        },
        component: () => import('pages/admin/storage/StorageIndex.vue')
      },
      {
        path: 'statistic',
        name: '用量管理统计',
        meta: {
          roles: ['federal-admin', 'ordinary']
        },
        redirect: '/my/stats/statistic/list',
        component: () => import('pages/admin/statistic/MeteringIndex.vue'),
        children: [
          {
            path: 'list',
            meta: {
              roles: ['federal-admin']
            },
            redirect: '/my/stats/statistic/list/cloud',
            component: () => import('pages/admin/statistic/StatisticsIndex.vue'),
            children: [
              {
                path: 'cloud',
                meta: {
                  roles: ['federal-admin']
                },
                redirect: '/my/stats/statistic/list/cloud/server',
                component: () => import('pages/admin/statistic/cloud/CloudList.vue'),
                children: [
                  {
                    path: 'group',
                    meta: {
                      roles: ['federal-admin']
                    },
                    component: () => import('pages/admin/statistic/cloud/GroupList.vue')
                  },
                  {
                    path: 'user',
                    meta: {
                      roles: ['federal-admin']
                    },
                    component: () => import('pages/admin/statistic/cloud/UserList.vue')
                  },
                  {
                    path: 'server',
                    meta: {
                      roles: ['federal-admin']
                    },
                    component: () => import('pages/admin/statistic/cloud/ServerList.vue')
                  },
                  {
                    path: 'service',
                    meta: {
                      roles: ['federal-admin']
                    },
                    component: () => import('pages/admin/statistic/cloud/ServiceList.vue')
                  }
                ]
              },
              {
                path: 'storage',
                meta: {
                  roles: ['federal-admin']
                },
                component: () => import('pages/admin/statistic/storage/StorageList.vue')
              },
              {
                path: 'server/:serverId',
                name: '云主机用量明细',
                meta: {
                  roles: ['federal-admin']
                },
                component: () => import('pages/admin/statistic/cloud/DetailServer.vue')
              },
              {
                path: 'service/:serviceId',
                name: '服务用量列表',
                meta: {
                  roles: ['federal-admin'],
                  type: 'service'
                },
                component: () => import('pages/admin/statistic/cloud/DetailList.vue')
              },
              {
                path: 'group/:groupId',
                name: '项目组用量列表',
                meta: {
                  roles: ['federal-admin'],
                  type: 'group'
                },
                component: () => import('pages/admin/statistic/cloud/DetailList.vue')
              },
              {
                path: 'user/:userid',
                name: '用户用量列表',
                meta: {
                  roles: ['federal-admin'],
                  type: 'user'
                },
                component: () => import('pages/admin/statistic/cloud/DetailList.vue')
              }
            ]
          }
        ]
      },
      {
        path: 'account',
        meta: {
          roles: ['federal-admin', 'ordinary']
        },
        component: () => import('pages/admin/account/AccountIndex.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    meta: {
      roles: ['federal-admin', 'ordinary']
    },
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
