import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/my/stats',
    component: () => import('layouts/StatsLayout.vue'),
    redirect: '/my/stats/personal',
    meta: {
      icon: 'las la-house-damage'
    },
    children: [
      {
        path: 'personal',
        name: '个人云主机用量列表',
        meta: {
          icon: 'las la-user',
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
          },
          {
            path: 'server/:serverId',
            name: '个人云主机每月用量明细',
            meta: {
              icon: 'lab la-wpforms',
              roles: ['federal-admin']
            },
            component: () => import('pages/admin/personal/PersonalDetail.vue')
          }
        ]
      },
      {
        path: 'group',
        meta: {
          icon: 'las la-user',
          roles: ['federal-admin', 'ordinary']
        },
        component: () => import('pages/admin/group/GroupIndex.vue')
      },
      {
        path: 'storage',
        meta: {
          icon: 'las la-user',
          roles: ['federal-admin', 'ordinary']
        },
        component: () => import('pages/admin/storage/StorageIndex.vue')
      },
      {
        path: 'recharge',
        meta: {
          icon: 'las la-user',
          roles: ['federal-admin', 'ordinary']
        },
        component: () => import('pages/admin/recharge/RechargeIndex.vue')
      },
      {
        path: 'statistic',
        name: '用量管理统计',
        meta: {
          icon: 'las la-digital-tachograph',
          roles: ['federal-admin', 'ordinary']
        },
        redirect: '/my/stats/statistic/list',
        component: () => import('pages/admin/statistic/Index.vue'),
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
                redirect: '/my/stats/statistic/list/cloud/user',
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
                  icon: 'lab la-wpforms',
                  roles: ['federal-admin']
                },
                component: () => import('pages/admin/statistic/storage/StorageList.vue')
              }
            ]
          },
          {
            path: 'user/:userid',
            name: '用户用量列表',
            meta: {
              icon: 'las la-user',
              roles: ['federal-admin'],
              type: 'user'
            },
            component: () => import('pages/admin/statistic/cloud/DetailList.vue')
          },
          {
            path: 'group/:groupId',
            name: '项目组用量列表',
            meta: {
              icon: 'las la-users',
              roles: ['federal-admin'],
              type: 'group'
            },
            component: () => import('pages/admin/statistic/cloud/DetailList.vue')
          },
          {
            path: 'service/:serviceId',
            name: '服务用量列表',
            meta: {
              icon: 'lab la-ioxhost',
              roles: ['federal-admin'],
              type: 'service'
            },
            component: () => import('pages/admin/statistic/cloud/DetailList.vue')
          },
          {
            path: 'server/:serverId',
            name: '云主机用量明细',
            meta: {
              icon: 'lab la-stack-exchange',
              roles: ['federal-admin']
            },
            component: () => import('pages/admin/statistic/cloud/DetailServer.vue')
          }
        ]
      },
      {
        path: 'account',
        meta: {
          icon: 'las la-user',
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
      icon: 'lab las la-user',
      roles: ['federal-admin', 'ordinary']
    },
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
