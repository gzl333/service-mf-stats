import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/my/stats',
    component: () => import('layouts/StatsLayout.vue'),
    redirect: '/my/stats/cloud',
    name: '用费计量',
    meta: {
      icon: 'las la-home'
    },
    children: [
      {
        path: 'cloud',
        name: '云主机用量列表',
        meta: {
          icon: 'las la-cloud'
        },
        component: () => import('pages/cloud/ServiceIndex.vue'),
        redirect: '/my/stats/cloud/list',
        children: [
          {
            path: 'list',
            component: () => import('pages/cloud/ServiceList.vue')
          },
          {
            path: 'userUsage/:userId',
            name: '用户用量列表',
            meta: {
              icon: 'las la-user'
            },
            component: () => import('pages/cloud/UserUsageList.vue')
          },
          {
            path: 'groupUsage/:groupId',
            name: '项目组用量列表',
            meta: {
              icon: 'las la-users'
            },
            component: () => import('pages/cloud/GroupUsageList.vue')
          },
          {
            path: 'nodeUsage/:nodeId',
            name: '服务用量列表',
            meta: {
              icon: 'las la-ioxhost'
            },
            component: () => import('pages/cloud/NodeUsageList.vue')
          },
          {
            path: 'uuUsage/:uuId',
            name: '云主机每月用量明细',
            meta: {
              icon: 'lab la-stack-exchange'
            },
            component: () => import('pages/cloud/UUUsageList.vue')
          }
        ]
      },
      {
        path: 'service2',
        component: () => import('pages/service/Service2Page.vue')
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
