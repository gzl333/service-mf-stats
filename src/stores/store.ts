import { defineStore } from 'pinia'
import stats from 'src/api/index'
import { normalize, schema } from 'normalizr'
import { i18n } from 'boot/i18n'
import dateFormat from 'src/utils'

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
  // 从余额接口添加余额id
  balanceId: string
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

export interface GroupBalanceInterface {
  id: string
  balance: number
  creation_time: string
  vo: {
    id: string
  }
}

export interface CashCouponInterface {
  id: string
  face_value: string
  creation_time: string
  effective_time: string
  expiration_time: string
  balance: string
  status: string
  granted_time: string
  owner_type: string
  service: string
  vo: null | string
  user: {
    id: string
    name: string
  } | null
  activity: {
    id: string
    name: string
  } | null
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
      },
      groupBalanceTable: {
        byId: {} as Record<string, GroupBalanceInterface>,
        allIds: [],
        isLoaded: false
      },
      cashCouponTable: {
        byId: {} as Record<string, CashCouponInterface>,
        allIds: [],
        isLoaded: false
      },
      groupCashTable: {
        byId: {} as Record<string, CashCouponInterface>,
        allIds: [],
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
            balanceId: Object.values(state.tables.groupTable.byId)[i].balanceId,
            name: Object.values(state.tables.groupTable.byId)[i].name,
            nameEn: Object.values(state.tables.groupTable.byId)[i].name,
            label: i.toString()
          }
        )
      }
      // 排序
      groupTabs = groupTabs.sort((a, b) => -a.name.localeCompare(b.name, 'zh-CN'))
      return groupTabs
    },
    getAvailableCash: (state) => (): CashCouponInterface[] => {
      const newArr: CashCouponInterface[] = []
      const now = new Date()
      const sortFn = (a: CashCouponInterface, b: CashCouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.cashCouponTable.allIds.forEach((item) => {
        const startTime = dateFormat(state.tables.cashCouponTable.byId[item].expiration_time)
        const end = new Date(startTime.replace(/-/g, '/'))
        // if (now.getTime() < end.getTime()) {
        //   console.log('未过期')
        // } else {
        //   console.log('已过期')
        // }
        if (state.tables.cashCouponTable.byId[item].balance !== '0.00' && now.getTime() < end.getTime()) {
          newArr.unshift(state.tables.cashCouponTable.byId[item])
        }
      })
      return newArr.sort(sortFn)
    },
    getExpiredCash: (state) => (): CashCouponInterface[] => {
      const newArr: CashCouponInterface[] = []
      const now = new Date()
      const sortFn = (a: CashCouponInterface, b: CashCouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.cashCouponTable.allIds.forEach((item) => {
        const startTime = dateFormat(state.tables.cashCouponTable.byId[item].expiration_time)
        const end = new Date(startTime.replace(/-/g, '/'))
        const total = (end.getTime() - now.getTime()) / 1000
        const spacing = parseInt(String(total / (60 * 60)))
        if (state.tables.cashCouponTable.byId[item].balance !== '0.00' && spacing < 0) {
          newArr.unshift(state.tables.cashCouponTable.byId[item])
        }
      })
      return newArr.sort(sortFn)
    },
    getExpiringCash: (state) => (): CashCouponInterface[] => {
      const newArr: CashCouponInterface[] = []
      const now = new Date()
      const sortFn = (a: CashCouponInterface, b: CashCouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.cashCouponTable.allIds.forEach((item) => {
        const startTime = dateFormat(state.tables.cashCouponTable.byId[item].expiration_time)
        const end = new Date(startTime.replace(/-/g, '/'))
        const total = (end.getTime() - now.getTime()) / 1000
        const spacing = parseInt(String(total / (60 * 60)))
        if (state.tables.cashCouponTable.byId[item].balance !== '0.00' && spacing > 0 && spacing <= 24) {
          newArr.unshift(state.tables.cashCouponTable.byId[item])
        }
      })
      return newArr.sort(sortFn)
    },
    getOutCash: (state) => (): CashCouponInterface[] => {
      const newArr: CashCouponInterface[] = []
      const sortFn = (a: CashCouponInterface, b: CashCouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.cashCouponTable.allIds.forEach((item) => {
        if (state.tables.cashCouponTable.byId[item].balance === '0.00') {
          newArr.unshift(state.tables.cashCouponTable.byId[item])
        }
      })
      return newArr.sort(sortFn)
    },
    getGroupCash: (state) => (payload: { void: string }): CashCouponInterface[] => {
      const newArr: CashCouponInterface[] = []
      const sortFn = (a: CashCouponInterface, b: CashCouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.groupCashTable.allIds.forEach((item) => {
        if (state.tables.groupCashTable.byId[item].vo === payload.void) {
          newArr.unshift(state.tables.groupCashTable.byId[item])
        }
      })
      return newArr.sort(sortFn)
    }
  },
  actions: {
    loadAllTables () {
      if (!this.tables.dataCenterTable.isLoaded) {
        void this.loadDataCenterTable().then(() => { // 1. 基础依赖
          if (!this.tables.serviceTable.isLoaded) {
            void this.loadServiceTable().then(() => {
              this.getUser().then(() => {
                this.loadGroupTable().then(() => {
                  if (!this.tables.balanceTable.isLoaded) {
                    this.loadBalanceTable()
                  }
                  // if (!this.tables.groupBalanceTable.isLoaded) {
                  //   this.loadGroupBalanceTable()
                  // }
                  if (!this.tables.cashCouponTable.isLoaded) {
                    this.loadCashCouponTable()
                  }
                  // if (!this.tables.groupCashTable.isLoaded) {
                  //   this.loadGroupCashTable()
                  // }
                })
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
        // sessionStorage.setItem('role', JSON.stringify(payload.vmsAdmin))
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
    async getServerHostFile (payload: { date_start: string, date_end: string, 'as-admin': boolean, download: boolean }) {
      const resServer = await stats.stats.api.getAggregationServerFile({ query: payload })
      return resServer
    },
    async getServiceHostFile (payload: { date_start: string, date_end: string, 'as-admin': boolean, download: boolean }) {
      const resServer = await stats.stats.api.getAggregationServiceFile({ query: payload })
      return resServer
    },
    async getGroupHostFile (payload: { date_start: string, date_end: string, 'as-admin': boolean, download: boolean }) {
      const resServer = await stats.stats.api.getAggregationVoFile({ query: payload })
      return resServer
    },
    async getUserHostFile (payload: { date_start: string, date_end: string, 'as-admin': boolean, download: boolean }) {
      const resServer = await stats.stats.api.getAggregationUserFile({ query: payload })
      return resServer
    },
    async getServerDetailFile (payload: { date_start: string, date_end: string, 'as-admin': boolean, download: boolean }) {
      const resServer = await stats.stats.api.getMeteringServerFile({ query: payload })
      return resServer
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
        this.tables.groupTable.allIds.push(Object.keys(normalizedData.entities.group)[0])
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
    },
    async loadGroupBalanceTable () {
      this.tables.groupBalanceTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      for (const id of this.tables.groupTable.allIds) {
        const respBalance = await stats.stats.account.getBalanceVo({ path: { vo_id: id } })
        const group = new schema.Entity('group')
        const normalizedData = normalize(respBalance.data, group)
        Object.assign(this.tables.groupBalanceTable.byId, normalizedData.entities.group)
        this.tables.groupTable.byId[respBalance.data.vo.id].balanceId = respBalance.data.id
        // @ts-ignore
        this.tables.groupBalanceTable.allIds.unshift(respBalance.data.id)
        this.tables.groupBalanceTable.allIds = [...new Set(this.tables.groupBalanceTable.allIds)]
      }
    },
    async getGroupBalance (voId: string) {
      const respBalance = await stats.stats.account.getBalanceVo({ path: { vo_id: voId } })
      return respBalance
    },
    async loadCashCouponTable () {
      this.tables.cashCouponTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      const respCash = await stats.stats.cashcoupon.getCashCoupon()
      const service = new schema.Entity('service')
      // const vo = new schema.Entity('vo')
      const cach = new schema.Entity('cach', { service })
      for (const data of respCash.data.results) {
        const normalizedData = normalize(data, cach)
        Object.assign(this.tables.cashCouponTable.byId, normalizedData.entities.cach)
        // @ts-ignore
        this.tables.cashCouponTable.allIds.unshift(data.id)
        this.tables.cashCouponTable.allIds = [...new Set(this.tables.cashCouponTable.allIds)]
      }
    },
    async loadGroupCashTable () {
      this.tables.groupCashTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      for (const group of this.tables.groupTable.allIds) {
        const respCash = await stats.stats.cashcoupon.getCashCoupon({ query: { vo_id: group } })
        const service = new schema.Entity('service')
        const vo = new schema.Entity('vo')
        const cach = new schema.Entity('cach', { service, vo })
        for (const data of respCash.data.results) {
          const normalizedData = normalize(data, cach)
          Object.assign(this.tables.groupCashTable.byId, normalizedData.entities.cach)
          // @ts-ignore
          this.tables.groupCashTable.allIds.unshift(data.id)
          this.tables.groupCashTable.allIds = [...new Set(this.tables.groupCashTable.allIds)]
        }
      }
    },
    async getGroupCashCoupon (voId: string) {
      const respCash = await stats.stats.cashcoupon.getCashCoupon({ query: { vo_id: voId } })
      return respCash
    }
  }
})
