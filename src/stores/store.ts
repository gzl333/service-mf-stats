import { defineStore } from 'pinia'
import stats from 'src/api/index'
export const useStore = defineStore('stats', {
  state: () => ({
    items: {
      // 实时记录用户所在app局部路径位置
      // 例如'/my/server/personal/list' -> ['personal', 'list'], 供二级三级导航栏在刷新时保持选择使用
      currentPath: [] as string[],
      fedRole: 'ordinary' as string,
      vmsAdmin: [] as string[]
    },
    tables: {}
  }),
  getters: {},
  actions: {
    loadAllTables () {
      this.getUser()
      this.getData()
    },
    async getUser () {
      const respDataCenter = await stats.stats.api.getUserPermissionPolicy()
      if (respDataCenter.status === 200) {
        this.storeUserRole({ fedRole: respDataCenter.data.role, vmsAdmin: respDataCenter.data.vms.service_ids })
      }
    },
    // 保存用户角色
    storeUserRole (payload: { fedRole: 'ordinary' | 'federal-admin', vmsAdmin: string[] }) {
      // 方式1
      // this.items.fedRole = 'ordinary'
      // this.items.fedRole = 'federal-admin'
      // 方式2
      // this.$patch({
      //   items: {
      //     fedRole: payload.fedRole,
      //     vmsAdmin: payload.vmsAdmin
      //   }
      // })
      // 方式3
      this.$patch(state => {
        state.items.fedRole = payload.fedRole
        state.items.vmsAdmin = payload.vmsAdmin
      })
    },
    async getData () {
      const respDataCenter = await stats.stats.api.getMeteringServerAggregation({ query: { 'as-admin': true } })
      console.log(respDataCenter)
    }
  }
})
