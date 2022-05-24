import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/my/stats',
    component: () => import('layouts/StatsLayout.vue'),
    redirect: '/my/stats/home',
    name: '首页',
    meta: {
      icon: 'las la-house-damage'
    },
    children: [
      {
        path: 'home',
        meta: {
          icon: 'las la-user',
          roles: ['federal-admin', 'ordinary']
        },
        component: () => import('pages/Home.vue')
      },
      {
        path: 'cloud',
        name: '云主机用量列表',
        meta: {
          icon: 'las la-cloud',
          roles: ['federal-admin']
        },
        component: () => import('pages/admin/cloud/ServiceIndex.vue'),
        redirect: '/my/stats/cloud/list',
        children: [
          {
            path: 'list',
            meta: {
              icon: 'las la-user',
              roles: ['federal-admin']
            },
            component: () => import('pages/admin/cloud/ServiceList.vue'),
            redirect: '/my/stats/cloud/list/user',
            children: [
              {
                path: 'user',
                meta: {
                  icon: 'las la-user',
                  roles: ['federal-admin']
                },
                component: () => import('pages/admin/cloud/UserList.vue')
              },
              {
                path: 'group',
                meta: {
                  icon: 'las la-user',
                  roles: ['federal-admin']
                },
                component: () => import('pages/admin/cloud/GroupList.vue')
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
            component: () => import('pages/admin/cloud/DetailList.vue')
          },
          {
            path: 'group/:groupId',
            name: '项目组用量列表',
            meta: {
              icon: 'las la-users',
              roles: ['federal-admin'],
              type: 'group'
            },
            component: () => import('pages/admin/cloud/DetailList.vue')
          },
          {
            path: 'nodeUsage/:nodeId',
            name: '服务用量列表',
            meta: {
              icon: 'lab las la-user',
              roles: ['federal-admin'],
              type: 'service'
            },
            component: () => import('pages/admin/cloud/DetailList.vue')
          },
          {
            path: 'uuUsage/:uuId',
            name: '云主机每月用量明细',
            meta: {
              icon: 'lab la-stack-exchange',
              roles: ['federal-admin']
            },
            component: () => import('pages/admin/cloud/UUUsageList.vue')
          }
        ]
      },
      {
        path: 'service2',
        meta: {
          icon: 'lab las la-user',
          roles: ['federal-admin', 'ordinary']
        },
        component: () => import('pages/admin/service/Service2Page.vue')
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
