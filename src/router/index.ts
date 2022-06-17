import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import routes from './routes'
// import { Notify } from 'quasar'
import { useStore } from 'stores/store'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({
      left: 0,
      top: 0
    }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    )
  })
  Router.beforeEach((to, from, next) => {
    // console.log('@cnic/stats ', 'from:', from.fullPath, ' to:', to.fullPath)
    const store = useStore()
    // 根据当前path更新store.items.currentPath
    store.items.currentPath = to.path.split('/').slice(3)

    // console.log('store', store.items.vmsAdmin)
    // console.log('to', to.meta)
    // console.log(sessionStorage.getItem('role'))
    // console.log(JSON.parse(sessionStorage.getItem('role')))
    // if (to.meta.requireServiceAdmin && JSON.parse(sessionStorage.getItem('role')).length === 0) {
    // next(from.fullPath)
    // Notify.create({
    //   classes: 'notification-negative shadow-15',
    //   icon: 'mdi-alert-circle',
    //   textColor: 'negative',
    //   message: '访问目标页面需要服务管理员权限',
    //   position: 'bottom',
    //   closeBtn: true,
    //   timeout: 5000,
    //   multiLine: false
    // })
    // }

    next()
  })

  return Router
})
