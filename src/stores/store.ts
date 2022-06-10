import { defineStore } from 'pinia'
import stats from 'src/api/index'
import { normalize, schema } from 'normalizr'
import { i18n } from 'boot/i18n'
export interface DataCenterInterface {
  // 来自registry接口
  id: string
  name: string
  name_en: string
  endpoint_vms: string
  endpoint_object: never // null 待细化
  endpoint_compute: never // null 待细化
  endpoint_monitor: never // null 待细化
  creation_time: string
  status: {
    code: number
    message: string
  },
  desc: string
  longitude: number
  latitude: number

  // 来自service接口
  services: string[] // 全部services汇总
  // personalServices: string[] // 用户可用services汇总
}
export interface ServiceInterface {
  // 来自service接口
  id: string
  name: string
  name_en: string
  service_type: string
  add_time: string
  need_vpn: boolean
  status: number
  data_center: string
  longitude: number
  latitude: number
}
export interface UserNameInterface {
  id: string
  username: string
}
export interface GroupInterface {
  id: string
  name: string
  company: string
  description: string
  creation_time: string
  owner: {
    id: string
    username: string
  },
  status: string // 'active' | 'inactive' ?

  // 以下字段自行判断添加
  // 当前用户在组内权限  owner > leader > member
  myRole: 'owner' | 'leader' | 'member'
}
export interface BalanceInterface {
  id: string
  balance: number
  creation_time: string
  user: {
    id: string
  }
}
export const useStore = defineStore('stats', {
  state: () => ({
    items: {
      // 实时记录用户所在app局部路径位置
      // 例如'/my/server/personal/list' -> ['personal', 'list'], 供二级三级导航栏在刷新时保持选择使用
      currentPath: [] as string[],
      fedRole: 'ordinary' as string,
      vmsAdmin: [] as string[]
    },
    tables: {
      dataCenterTable: {
        byId: {} as Record<string, DataCenterInterface>,
        allIds: [],
        isLoaded: false
      },
      serviceTable: {
        byId: {} as Record<string, ServiceInterface>,
        allIds: [],
        isLoaded: false
      },
      groupTable: {
        byId: {} as Record<string, GroupInterface>,
        allIds: [],
        isLoaded: false
      },
      UserNameTable: {
        byId: {} as Record<string, UserNameInterface>,
        allIds: [],
        isLoaded: false
      },
      balanceTable: {
        byId: {} as Record<string, BalanceInterface>,
        isLoaded: false
      }
    }
  }),
  getters: {
    getServices (state): { value: string; label: string; }[] {
      const serviceOptions = []
      for (const group of Object.values(state.tables.serviceTable.byId)) {
        serviceOptions.push(
          {
            value: group.id,
            label: group.name
          }
        )
      }
      serviceOptions.unshift({
        value: '',
        label: i18n.global.locale === 'zh' ? '全部服务' : 'All Groups'
      })
      return serviceOptions
    },
    getGroupOptions (state): { value: string; label: string; }[] {
      let groupOptions = []
      for (const group of Object.values(state.tables.groupTable.byId)) {
        groupOptions.push(
          {
            value: group.id,
            label: group.name,
            labelEn: group.name
          }
        )
      }
      // 排序
      groupOptions = groupOptions.sort((a, b) => -a.label.localeCompare(b.label, 'zh-CN'))
      groupOptions.unshift({
        value: '0',
        label: '全部项目组',
        labelEn: 'All Groups'
      })
      return groupOptions
    },
    getGroupTabs (state): { voId: string; name: string; }[] {
      let groupTabs = []
      for (let i = 0; i < Object.values(state.tables.groupTable.byId).length; i++) {
        groupTabs.push(
          {
            voId: Object.values(state.tables.groupTable.byId)[i].id,
            name: Object.values(state.tables.groupTable.byId)[i].name,
            nameEn: Object.values(state.tables.groupTable.byId)[i].name,
            label: i
          }
        )
      }
      // 排序
      groupTabs = groupTabs.sort((a, b) => -a.name.localeCompare(b.name, 'zh-CN'))
      return groupTabs
    }
  },
  actions: {
    loadAllTables () {
      if (!this.tables.dataCenterTable.isLoaded) {
        void this.loadDataCenterTable().then(() => { // 1. 基础依赖
          if (!this.tables.serviceTable.isLoaded) {
            void this.loadServiceTable().then(() => {
              this.getUser()
              this.loadGroupTable().then(() => {
                this.loadBalanceTable()
              })
            })
          }
        })
      }
    },
    async loadDataCenterTable () {
      this.tables.dataCenterTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      const respDataCenter = await stats.stats.api.getRegistry()
      const dataCenter = new schema.Entity('dataCenter', {})
      respDataCenter.data.registries.forEach((data: Record<string, never>) => {
        const normalizedData = normalize(data, dataCenter)
        Object.values(normalizedData.entities.dataCenter!)[0].services = []
        Object.values(normalizedData.entities.dataCenter!)[0].personalServices = []
        Object.assign(this.tables.dataCenterTable.byId, normalizedData.entities.dataCenter)
        // @ts-ignore
        this.tables.dataCenterTable.allIds.unshift(Object.keys(normalizedData.entities.dataCenter)[0])
        this.tables.dataCenterTable.allIds = [...new Set(this.tables.dataCenterTable.allIds)]
      })
      this.tables.dataCenterTable.isLoaded = true
    },
    async loadServiceTable () {
      this.tables.serviceTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      const respService = await stats.stats.api.getService()
      // eslint-disable-next-line camelcase
      const data_center = new schema.Entity('data_center')
      // eslint-disable-next-line camelcase
      const service = new schema.Entity('service', { data_center })
      respService.data.results.forEach((data: Record<string, never>) => {
        const normalizedData = normalize(data, service)
        Object.assign(this.tables.serviceTable.byId, normalizedData.entities.service)
        // @ts-ignore
        this.tables.serviceTable.allIds.unshift(Object.keys(normalizedData.entities.service)[0])
        this.tables.serviceTable.allIds = [...new Set(this.tables.serviceTable.allIds)]
        this.tables.dataCenterTable.byId[Object.values(normalizedData.entities.service!)[0].data_center].services.unshift(Object.values(normalizedData.entities.service!)[0].id)
        this.tables.dataCenterTable.byId[Object.values(normalizedData.entities.service!)[0].data_center].services = [...new Set(this.tables.dataCenterTable.byId[Object.values(normalizedData.entities.service!)[0].data_center].services)]
      })
      this.tables.serviceTable.isLoaded = true
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
    async getMachineDetail (payload: { page: number, page_size: number, date_start: string, date_end: string, vo_id: string, user_id: string, server_id: string, service_id: string, 'as-admin': boolean }) {
      const respDataCenter = await stats.stats.api.getMeteringServer({ query: payload })
      return respDataCenter
    },
    async getUserHostData (payload: { page: number, page_size: number, date_start: string, date_end: string, service_id: string, 'as-admin': boolean }) {
      const respDataCenter = await stats.stats.api.getAggregationUser({ query: payload })
      this.tables.UserNameTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      const user = new schema.Entity('user')
      for (const data of respDataCenter.data.results) {
        const normalizedData = normalize(data.user, user)
        Object.assign(this.tables.UserNameTable.byId, normalizedData.entities.user)
        // @ts-ignore
        this.tables.UserNameTable.allIds.unshift(Object.keys(normalizedData.entities.user)[0])
        this.tables.UserNameTable.allIds = [...new Set(this.tables.UserNameTable.allIds)]
      }
      this.tables.serviceTable.isLoaded = true
      return respDataCenter
    },
    async getGroupHostData (payload: { page: number, page_size: number, date_start: string, date_end: string, service_id: string, 'as-admin': boolean }) {
      const respDataCenter = await stats.stats.api.getAggregationVo({ query: payload })
      return respDataCenter
    },
    async getServerHostData (payload: { page: number, page_size: number, date_start: string, date_end: string, vo_id: string, user_id: string, service_id: string, 'as-admin': boolean }) {
      const respDataCenter = await stats.stats.api.getAggregationServer({ query: payload })
      return respDataCenter
    },
    async getServiceHostData (payload: { page: number, page_size: number, date_start: string, date_end: string, 'as-admin': boolean }) {
      const respDataCenter = await stats.stats.api.getAggregationService({ query: payload })
      return respDataCenter
    },
    async loadGroupTable () {
      // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
      this.tables.groupTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      // 发送请求
      const respGroup = await stats.stats.vo.getVo()
      // normalize
      const group = new schema.Entity('group')
      for (const data of respGroup.data.results) {
        // 添加role字段
        // const currentId = this.items.decoded?.email
        // const myRole = currentId === data.owner.username ? 'owner' : 'member'
        // Object.assign(data, { myRole })
        // normalize
        const normalizedData = normalize(data, group)
        Object.assign(this.tables.groupTable.byId, normalizedData.entities.group)
        // @ts-ignore
        this.tables.groupTable.allIds.unshift(Object.keys(normalizedData.entities.group)[0])
        this.tables.groupTable.allIds = [...new Set(this.tables.groupTable.allIds)]
      }
      // load table的最后再改isLoaded
      this.tables.groupTable.isLoaded = true
      return respGroup
    },
    async loadBalanceTable () {
      this.tables.balanceTable = {
        byId: {},
        isLoaded: false
      }
      const respBalance = await stats.stats.account.getBalanceUser()
      Object.assign(this.tables.balanceTable.byId, respBalance.data)
      this.tables.balanceTable.isLoaded = true
      return respBalance
    }
  }
})
