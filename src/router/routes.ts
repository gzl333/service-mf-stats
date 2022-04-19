import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/my/stats',
    component: () => import('layouts/StatsLayout.vue'),
    redirect: '/my/stats/service1',
    children: [
      {
        path: 'service1',
        component: () => import('pages/ServiceIndex.vue'),
        // redirect: '/my/stats/service1/list',
        children: [
          {
            path: 'list',
            component: () => import('pages/ServiceList.vue')
          }
        ]
      },
      {
        path: 'userUsage/:userId',
        component: () => import('pages/UserUsageList.vue')
      },
      {
        path: 'service2',
        component: () => import('pages/Service2Page.vue')
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
