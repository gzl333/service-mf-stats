import { defineStore } from 'pinia'
import stats from 'src/api/index'
export const useStore = defineStore('stats', {
  state: () => ({
    items: {
      // 实时记录用户所在app局部路径位置
      // 例如'/my/server/personal/list' -> ['personal', 'list'], 供二级三级导航栏在刷新时保持选择使用
      currentPath: [] as string[]
    },
    tables: {}
  }),
  getters: {},
  actions: {
    async getUser () {
      const respDataCenter = await stats.stats.api.getUserPermissionPolicy()
      console.log(respDataCenter)
      return respDataCenter
    }
  }
})
