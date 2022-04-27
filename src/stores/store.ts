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
    },
    async getUser () {
      const respDataCenter = await stats.stats.api.getUserPermissionPolicy()
      if (respDataCenter.status === 200) {
        this.storeUserRole({ fedRole: respDataCenter.data.role, vmsAdmin: respDataCenter.data.vms.service_ids })
      }
    },
    // 保存用户角色
    storeUserRole (payload: { fedRole: 'ordinary' | 'federal-admin', vmsAdmin: string[] }) {
      // this.items.fedRole = 'ordinary'
      // this.items.fedRole = 'federal-admin'
      this.items.fedRole = payload.fedRole
      this.items.vmsAdmin = payload.vmsAdmin
    }
  }
})
