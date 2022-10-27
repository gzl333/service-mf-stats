import { defineStore } from 'pinia'
import stats from 'src/api/index'
import { normalize, schema } from 'normalizr'
import { dateFormat } from 'src/hooks/processTime'
// @ts-expect-error
import { useStoreMain } from '@cnic/main'

// id
export interface idTable<T> {
  allIds: string[]
  byId: Record<string, T>
}
export interface totalTable {
  status: 'init' | 'loading' | 'total' | 'error'
}
export interface DataCenterInterface {
  // 来自registry接口
  id: string
  name: string
  name_en: string
  endpoint_vms: string
  endpoint_object: never // null 待细化
  endpoint_compute: never // null 待细化
  endpoint_monitor: never // null 待细化
  creationTime: string
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
  cloud_type: string
  add_time: string
  need_vpn: boolean
  status: string
  data_center: string
  longitude: number
  latitude: number
  pay_app_service_id: string
}

export interface GroupInterface {
  id: string
  name: string
  company: string
  description: string
  creationTime: string
  owner: {
    id: string
    username: string
  },
  status: string // 'active' | 'inactive' ?

  // 以下字段自行判断添加
  // 当前用户在组内权限  owner > leader > member
  myRole: 'owner' | 'leader' | 'member'
  // 余额
  balance: string // groupBalanceTable 内的id值
  // 订单
  order: string[] // orderId
  // coupon
  coupons: string[] // couponId
}

export interface PersonalBalanceInterface {
  id: string
  balance: number
  creationTime: string
  user: {
    id: string
  }
}

export interface GroupBalanceInterface {
  id: string
  balance: number
  creationTime: string
  vo: {
    id: string
  }
}

export interface CouponInterface {
  id: string
  face_value: string
  creationTime: string
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

export interface PersonalServerMeteringInterface {
  server_id: string
  service_name: string
  total_cpu_hours: number
  total_disk_hours: number
  total_original_amount: number
  total_public_ip_hours: number
  total_ram_hours: number
  total_trade_amount: number
  server: {
    id: string
    ipv4: string
    ram: number
    vcpus: number
  }
}

export interface GroupServerMeteringInterface {
  ipv4: string
  vo_id: string
  server_id: string
  service_name: string
  ram: number | string
  vcpus: number | string
  total_cpu_hours: number | string
  total_disk_hours: number | string
  total_original_amount: number | string
  total_public_ip_hours: number | string
  total_ram_hours: number | string
  total_trade_amount: number | string
}

export interface DateInterface {
  value: number
  label: string | number
  labelEn?: string
}

export interface MeteringDetailInterface {
  cpu_hours: number
  creationTime: string
  daily_statement_id: string
  date: string
  disk_hours: number
  downstream: number
  id: string
  original_amount: string
  owner_type: string
  pay_type: string
  public_ip_hours: number
  ram_hours: number
  server_id: string
  service_id: string
  snapshot_hours: number
  trade_amount: string
  upstream: number
  user_id: string
  username: string
  vo_id: string
  vo_name: string
}
export interface SingleMemberInterface {
  id: string
  user: {
    id: string
    username: string
  }
  role: 'member' | 'leader'
  join_time: string
  inviter: string
}
export interface GroupMemberInterface {
  members: SingleMemberInterface[]
  owner: {
    id: string
    username: string
  }
}
export interface ServerInterface {
  // 来自server接口
  id: string
  name: string
  vcpus: number
  ram: number
  ipv4: string
  publicIp: boolean
  image: string
  creationTime: string
  expiration_time: string
  remarks: string
  classification: string
  image_id: string
  image_desc: string
  default_user: string
  default_password: string
  pay_type: 'prepaid' | 'postpaid'
  endpoint_url: string
  service: string // 简化成serviceId
  user_quota: string
  center_quota: number
  vo_id: string | null
  user: {
    id: string
    username: string
  }
  lock: 'free' | 'lock-delete' | 'lock-operation'

  // 来自vnc接口
  vnc?: string
  // 来自status接口，类型为number
  status?: number
}

export interface DataCenterTableInterface extends totalTable, idTable<DataCenterInterface> {
}

export interface ServiceTableInterface extends totalTable, idTable<ServiceInterface> {
}

export interface PersonalBalanceTableInterface extends totalTable, idTable<PersonalBalanceInterface> {
}

export interface GroupBalanceTableInterface extends totalTable, idTable<GroupBalanceInterface> {
}

export interface CouponTableInterface extends totalTable, idTable<CouponInterface> {
}

export interface GroupTableInterface extends totalTable, idTable<GroupInterface> {
}
// 组配额table: groupId -> groupMember
export interface GroupMemberTableInterface extends totalTable, idTable<GroupMemberInterface> {
}
// 项目组云主机
export interface GroupServerTableInterface extends totalTable, idTable<ServerInterface> {
}
export const useStore = defineStore('stats', {
  state: () => ({
    items: {
      // 实时记录用户所在app局部路径位置
      // 例如'/my/server/consumption/list' -> ['consumption', 'list'], 供二级三级导航栏在刷新时保持选择使用
      currentPath: [] as string[],
      fedRole: 'ordinary' as string,
      vmsAdmin: [] as string[],
      personalBalance: {} as PersonalBalanceTableInterface
    },
    tables: {
      dataCenterTable: {
        byId: {},
        allIds: [],
        status: 'init'
      } as DataCenterTableInterface,
      serviceTable: {
        byId: {},
        allIds: [],
        status: 'init'
      } as ServiceTableInterface,
      groupTable: {
        byId: {},
        allIds: [],
        status: 'init'
      } as GroupTableInterface,
      groupMemberTable: {
        byId: {},
        allIds: [],
        status: 'init'
      } as GroupMemberTableInterface,
      groupServerTable: {
        byId: {},
        allIds: [],
        status: 'init'
      } as GroupServerTableInterface,
      groupBalanceTable: {
        byId: {},
        allIds: [],
        status: 'init'
      } as GroupBalanceTableInterface,
      groupCouponTable: {
        byId: {},
        allIds: [],
        status: 'init'
      } as CouponTableInterface,
      personalCouponTable: {
        byId: {},
        allIds: [],
        status: 'init'
      } as CouponTableInterface
    }
  }),
  getters: {
    getServices: (state) => (type: string) : { value: string; label: string; }[] => {
      const serviceOptions = []
      if (type === 'all') {
        for (const service of Object.values(state.tables.serviceTable.byId)) {
          serviceOptions.push(
            {
              value: service.id,
              label: service.name,
              labelEn: service.name_en
            }
          )
        }
      } else {
        for (const service of Object.values(state.tables.serviceTable.byId).filter(item => item.status === type)) {
          serviceOptions.push(
            {
              value: service.id,
              label: service.name,
              labelEn: service.name_en
            }
          )
        }
      }
      serviceOptions.unshift({
        value: '',
        label: '全部服务',
        labelEn: 'All Services'
      })
      return serviceOptions
    },
    getGroupTabs (state): { voId: string; name: string; }[] {
      let groupTabs = []
      for (let i = 0; i < Object.values(state.tables.groupTable.byId).length; i++) {
        groupTabs.push(
          {
            voId: Object.values(state.tables.groupTable.byId)[i].id,
            balanceId: Object.values(state.tables.groupTable.byId)[i].balance,
            coupons: Object.values(state.tables.groupTable.byId)[i].coupons,
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
    getGroupServersByGroupId: (state) => (groupId: string): ServerInterface[] => {
      const sortFn = (a: ServerInterface, b: ServerInterface) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
      if (groupId === '0') {
        return Object.values(state.tables.groupServerTable.byId).sort(sortFn)
      } else {
        const servers: ServerInterface[] = []
        for (const server of Object.values(state.tables.groupServerTable.byId)) {
          if (groupId === server.vo_id) {
            servers.push(server)
          }
        }
        return servers.sort(sortFn)
      }
    },
    getGroupsByFilter: (state) => (filter: string): GroupInterface[] => {
      // 排序函数，按照组创建时间降序排列
      const sortFn = (a: GroupInterface, b: GroupInterface) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
      if (filter === 'all') {
        return Object.values(state.tables.groupTable.byId).sort(sortFn)
      } else {
        const groups: GroupInterface[] = []
        for (const group of Object.values(state.tables.groupTable.byId)) {
          if (filter === 'owner' && group.myRole === 'owner') {
            groups.push(group)
          } else if (filter === 'member' && group.myRole === 'member') {
            groups.push(group)
          } else if (filter === 'leader' && group.myRole === 'leader') {
            groups.push(group)
          }
        }
        return groups.sort(sortFn)
      }
    },
    getPersonalAvailableCoupon: (state) => (): CouponInterface[] => {
      const newArr: CouponInterface[] = []
      const now = new Date()
      const sortFn = (a: CouponInterface, b: CouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.personalCouponTable.allIds.forEach((item) => {
        const startTime = dateFormat(state.tables.personalCouponTable.byId[item]?.expiration_time)
        const end = new Date(startTime.replace(/-/g, '/'))
        // if (now.getTime() < end.getTime()) {
        //   console.log('未过期')
        // } else {
        //   console.log('已过期')
        // }
        if (state.tables.personalCouponTable.byId[item]?.balance !== '0.00' && now.getTime() < end.getTime()) {
          newArr.unshift(state.tables.personalCouponTable.byId[item])
        }
      })
      return newArr.sort(sortFn)
    },
    getPersonalExpiringCoupon: (state) => (): CouponInterface[] => {
      const newArr: CouponInterface[] = []
      const now = new Date()
      const sortFn = (a: CouponInterface, b: CouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.personalCouponTable.allIds.forEach((item) => {
        const startTime = dateFormat(state.tables.personalCouponTable.byId[item]?.expiration_time)
        const end = new Date(startTime.replace(/-/g, '/'))
        const total = (end.getTime() - now.getTime()) / 1000
        const spacing = parseInt(String(total / (60 * 60)))
        if (state.tables.personalCouponTable.byId[item]?.balance !== '0.00' && spacing > 0 && spacing <= 24) {
          newArr.unshift(state.tables.personalCouponTable.byId[item])
        }
      })
      return newArr.sort(sortFn)
    },
    getPersonalExpiredCoupon: (state) => (): CouponInterface[] => {
      const newArr: CouponInterface[] = []
      const now = new Date()
      const sortFn = (a: CouponInterface, b: CouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.personalCouponTable.allIds.forEach((item) => {
        const startTime = dateFormat(state.tables.personalCouponTable.byId[item]?.expiration_time)
        const end = new Date(startTime.replace(/-/g, '/'))
        const total = (end.getTime() - now.getTime()) / 1000
        const spacing = parseInt(String(total / (60 * 60)))
        if (state.tables.personalCouponTable.byId[item]?.balance !== '0.00' && spacing < 0) {
          newArr.unshift(state.tables.personalCouponTable.byId[item])
        }
      })
      return newArr.sort(sortFn)
    },
    getPersonalOutCoupon: (state) => (): CouponInterface[] => {
      const newArr: CouponInterface[] = []
      const sortFn = (a: CouponInterface, b: CouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.personalCouponTable.allIds.forEach((item) => {
        if (state.tables.personalCouponTable.byId[item]?.balance === '0.00') {
          newArr.unshift(state.tables.personalCouponTable.byId[item])
        }
      })
      return newArr.sort(sortFn)
    },
    getGroupBalanceByGroupId: (state) => (groupId: string): number => {
      const balanceId = state.tables.groupTable.byId[groupId]?.balance
      return state.tables.groupBalanceTable.byId[balanceId]?.balance
    },
    getGroupAvailableCouponByGroupId: (state) => (groupId: string): CouponInterface[] => {
      const newArr: CouponInterface[] = []
      const outCoupons: CouponInterface[] = []
      const now = new Date()
      const sortFn = (a: CouponInterface, b: CouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.groupTable.byId[groupId]?.coupons.forEach((item) => {
        newArr.unshift(state.tables.groupCouponTable.byId[item])
      })
      newArr.forEach((item) => {
        const startTime = dateFormat(item.expiration_time)
        const end = new Date(startTime.replace(/-/g, '/'))
        if (item.balance !== '0.00' && now.getTime() < end.getTime()) {
          outCoupons.unshift(item)
        }
      })
      return outCoupons.sort(sortFn)
    },
    getGroupExpiringCouponByGroupId: (state) => (groupId: string): CouponInterface[] => {
      const newArr: CouponInterface[] = []
      const outCoupons: CouponInterface[] = []
      const now = new Date()
      const sortFn = (a: CouponInterface, b: CouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.groupTable.byId[groupId]?.coupons.forEach((item) => {
        newArr.unshift(state.tables.groupCouponTable.byId[item])
      })
      newArr.forEach((item) => {
        const startTime = dateFormat(item.expiration_time)
        const end = new Date(startTime.replace(/-/g, '/'))
        const total = (end.getTime() - now.getTime()) / 1000
        const spacing = parseInt(String(total / (60 * 60)))
        if (item.balance !== '0.00' && spacing > 0 && spacing <= 24) {
          outCoupons.unshift(item)
        }
      })
      return outCoupons.sort(sortFn)
    },
    getGroupExpiredCouponByGroupId: (state) => (groupId: string): CouponInterface[] => {
      const newArr: CouponInterface[] = []
      const outCoupons: CouponInterface[] = []
      const now = new Date()
      const sortFn = (a: CouponInterface, b: CouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.groupTable.byId[groupId]?.coupons.forEach((item) => {
        newArr.unshift(state.tables.groupCouponTable.byId[item])
      })
      newArr.forEach((item) => {
        const startTime = dateFormat(item.expiration_time)
        const end = new Date(startTime.replace(/-/g, '/'))
        const total = (end.getTime() - now.getTime()) / 1000
        const spacing = parseInt(String(total / (60 * 60)))
        if (item.balance !== '0.00' && spacing < 0) {
          outCoupons.unshift(item)
        }
      })
      return outCoupons.sort(sortFn)
    },
    getGroupOutCouponByGroupId: (state) => (groupId: string): CouponInterface[] => {
      const newArr: CouponInterface[] = []
      const outCoupons: CouponInterface[] = []
      const sortFn = (a: CouponInterface, b: CouponInterface) => new Date(b.effective_time).getTime() - new Date(a.effective_time).getTime()
      state.tables.groupTable.byId[groupId]?.coupons.forEach((item) => {
        newArr.unshift(state.tables.groupCouponTable.byId[item])
      })
      newArr.forEach((item) => {
        if (item.balance === '0.00') {
          outCoupons.unshift(item)
        }
      })
      return outCoupons.sort(sortFn)
    }
  },
  actions: {
    async loadAllItems () {
      this.storeUserRole()
    },
    loadAllTables () {
      if (this.tables.dataCenterTable.status === 'init') {
        void this.loadDataCenterTable().then(() => { // 1. 基础依赖
          if (this.tables.serviceTable.status === 'init') {
            void this.loadServiceTable().then(() => {
              if (this.tables.groupTable.status === 'init') {
                this.loadGroupTable().then(() => {
                  if (this.tables.groupMemberTable.status === 'init') {
                    this.loadGroupMemberTable().then(() => {
                      if (this.tables.groupServerTable.status === 'init') {
                        this.loadGroupServerTable()
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    },
    async storeUserRole () {
      const respUserRole = await stats.stats.user.getUserPermissionPolicy()
      if (respUserRole.status === 200) {
        // 方式1
        // this.items.fedRole = 'ordinary'
        // this.items.fedRole = 'federal-admin'
        // 方式2
        // this.$patch({
        //   items: {
        //     fedRole: respUserRole.data.role,
        //     vmsAdmin: respUserRole.data.vms.service_ids
        //   }
        // })
        // 方式3
        this.$patch(state => {
          state.items.fedRole = respUserRole.data.role
          state.items.vmsAdmin = respUserRole.data.vms.service_ids
        })
      }
    },
    async loadDataCenterTable () {
      this.tables.dataCenterTable = {
        byId: {},
        allIds: [],
        status: 'init'
      }
      this.tables.dataCenterTable.status = 'loading'
      const respDataCenter = await stats.stats.registry.getRegistry()
      const dataCenter = new schema.Entity('dataCenter', {})
      respDataCenter.data.registries.forEach((data: Record<string, never>) => {
        const normalizedData = normalize(data, dataCenter)
        Object.values(normalizedData.entities.dataCenter!)[0].services = []
        Object.values(normalizedData.entities.dataCenter!)[0].personalServices = []
        Object.assign(this.tables.dataCenterTable.byId, normalizedData.entities.dataCenter)
        this.tables.dataCenterTable.allIds.unshift(Object.keys(normalizedData.entities.dataCenter as Record<string, unknown>)[0])
        this.tables.dataCenterTable.allIds = [...new Set(this.tables.dataCenterTable.allIds)]
      })
      this.tables.dataCenterTable.status = 'total'
    },
    async loadServiceTable () {
      this.tables.serviceTable = {
        byId: {},
        allIds: [],
        status: 'init'
      }
      this.tables.serviceTable.status = 'loading'
      const respService = await stats.stats.service.getService()
      // eslint-disable-next-line camelcase
      const data_center = new schema.Entity('data_center')
      // eslint-disable-next-line camelcase
      const service = new schema.Entity('service', { data_center })
      respService.data.results.forEach((data: Record<string, never>) => {
        const normalizedData = normalize(data, service)
        Object.assign(this.tables.serviceTable.byId, normalizedData.entities.service)
        this.tables.serviceTable.allIds.unshift(Object.keys(normalizedData.entities.service as Record<string, unknown>)[0])
        this.tables.serviceTable.allIds = [...new Set(this.tables.serviceTable.allIds)]
        this.tables.dataCenterTable.byId[Object.values(normalizedData.entities.service!)[0].data_center].services.unshift(Object.values(normalizedData.entities.service!)[0].id)
        this.tables.dataCenterTable.byId[Object.values(normalizedData.entities.service!)[0].data_center].services = [...new Set(this.tables.dataCenterTable.byId[Object.values(normalizedData.entities.service!)[0].data_center].services)]
      })
      this.tables.serviceTable.status = 'total'
    },
    async loadGroupTable () {
      // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
      this.tables.groupTable = {
        byId: {},
        allIds: [],
        status: 'init'
      }
      this.tables.groupTable.status = 'loading'
      // 发送请求
      const respGroup = await stats.stats.vo.getVo()
      // normalize
      const group = new schema.Entity('group')
      for (const data of respGroup.data.results) {
        // 添加role/balance/order字段
        const storeMain = useStoreMain()
        const currentId = storeMain.items.tokenDecoded.email
        const myRole = currentId === data.owner.username ? 'owner' : 'member'
        Object.assign(data, {
          myRole,
          balance: '',
          order: [],
          coupons: []
        })
        // normalize
        const normalizedData = normalize(data, group)
        // 保存table
        Object.assign(this.tables.groupTable.byId, normalizedData.entities.group)
        this.tables.groupTable.allIds.unshift(Object.keys(normalizedData.entities.group as Record<string, unknown>)[0])
        this.tables.groupTable.allIds = [...new Set(this.tables.groupTable.allIds)]
      }
      // load table的最后再改status
      this.tables.groupTable.status = 'total'
    },
    // 更新整个groupServerTable，调用点在group模块里
    async loadGroupServerTable () {
      // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
      this.tables.groupServerTable = {
        byId: {},
        allIds: [],
        status: 'init'
      }
      this.tables.groupServerTable.status = 'loading'
      // 根据groupTable,建立groupServerTable
      for (const groupId of this.tables.groupTable.allIds) {
        // 发送请求
        const respGroupServer = await stats.stats.vo.getServerVo({
          path: {
            vo_id: groupId
          },
          query: {
            page_size: 999
          }
        })
        // 将响应normalize
        const service = new schema.Entity('service')
        const user_quota = new schema.Entity('user_quota')
        const server = new schema.Entity('server', {
          service,
          user_quota
        })
        for (const data of respGroupServer.data.servers) {
          const normalizedData = normalize(data, server)
          Object.assign(this.tables.groupServerTable.byId, normalizedData.entities.server)
          this.tables.groupServerTable.allIds.unshift(Object.keys(normalizedData.entities.server as Record<string, unknown>)[0])
          this.tables.groupServerTable.allIds = [...new Set(this.tables.groupServerTable.allIds)]
        }
      }
      this.tables.groupServerTable.status = 'total'
    },
    // 根据groupTable,建立groupMemberTable
    async loadGroupMemberTable () {
      // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
      this.tables.groupMemberTable = {
        byId: {},
        allIds: [],
        status: 'init'
      }
      this.tables.groupMemberTable.status = 'loading'
      for (const groupId of this.tables.groupTable.allIds) {
        const respGroupMember = await stats.stats.vo.getVoListMembers({ path: { id: groupId } })
        // 是否把组长添加进member列表？
        // 把groupId字段补充进去
        Object.assign(respGroupMember.data, { id: groupId })
        // normalize
        const groupMember = new schema.Entity('groupMember')
        const normalizedData = normalize(respGroupMember.data, groupMember)
        // 存入state
        Object.assign(this.tables.groupMemberTable.byId, normalizedData.entities.groupMember)
        this.tables.groupMemberTable.allIds.unshift(Object.keys(normalizedData.entities.groupMember as Record<string, unknown>)[0])
        this.tables.groupMemberTable.allIds = [...new Set(this.tables.groupMemberTable.allIds)]
        // 给groupTable补充role字段
        const storeMain = useStoreMain()
        const currentId = storeMain.items.tokenDecoded.email
        for (const member of respGroupMember.data.members) {
          if (member.user.username === currentId && member.role === 'leader') {
            this.tables.groupTable.byId[groupId].myRole = 'leader'
          }
        }
      }
      // load table的最后再改status
      this.tables.groupMemberTable.status = 'total'
    },
    async loadPersonalBalance () {
      const respPersonalBalance = await stats.stats.account.getBalanceUser()
      if (respPersonalBalance.status === 200) {
        this.items.personalBalance = respPersonalBalance.data
      }
    },
    async loadGroupBalanceTable () {
      this.tables.groupBalanceTable = {
        byId: {},
        allIds: [],
        status: 'init'
      }
      this.tables.groupBalanceTable.status = 'loading'
      for (const id of this.tables.groupTable.allIds) {
        const respGroupBalance = await stats.stats.account.getBalanceVo({ path: { vo_id: id } })
        const group = new schema.Entity('group')
        const normalizedData = normalize(respGroupBalance.data, group)
        Object.assign(this.tables.groupBalanceTable.byId, normalizedData.entities.group)
        this.tables.groupTable.byId[respGroupBalance.data.vo.id].balance = respGroupBalance.data.id
        this.tables.groupBalanceTable.allIds.unshift(respGroupBalance.data.id)
        this.tables.groupBalanceTable.allIds = [...new Set(this.tables.groupBalanceTable.allIds)]
      }
      this.tables.groupBalanceTable.status = 'total'
    },
    async loadPersonalCouponTable () {
      this.tables.personalCouponTable = {
        byId: {},
        allIds: [],
        status: 'init'
      }
      this.tables.personalCouponTable.status = 'loading'
      const respCashCoupon = await stats.stats.cashcoupon.getCashCoupon()
      const service = new schema.Entity('service')
      // const vo = new schema.Entity('vo')
      const coupon = new schema.Entity('coupon', { service })
      for (const data of respCashCoupon.data.results) {
        const normalizedData = normalize(data, coupon)
        Object.assign(this.tables.personalCouponTable.byId, normalizedData.entities.coupon)
        this.tables.personalCouponTable.allIds.unshift(data.id)
        this.tables.personalCouponTable.allIds = [...new Set(this.tables.personalCouponTable.allIds)]
      }
      this.tables.personalCouponTable.status = 'total'
    },
    async loadGroupCouponTable () {
      this.tables.groupCouponTable = {
        byId: {},
        allIds: [],
        status: 'init'
      }
      this.tables.groupCouponTable.status = 'loading'
      for (const group of this.tables.groupTable.allIds) {
        const respCashCoupon = await stats.stats.cashcoupon.getCashCoupon({ query: { vo_id: group } })
        const service = new schema.Entity('service')
        const vo = new schema.Entity('vo')
        const coupon = new schema.Entity('coupon', { service, vo })
        for (const data of respCashCoupon.data.results) {
          const normalizedData = normalize(data, coupon)
          Object.assign(this.tables.groupCouponTable.byId, normalizedData.entities.coupon)
          this.tables.groupCouponTable.allIds.unshift(data.id)
          this.tables.groupCouponTable.allIds = [...new Set(this.tables.groupCouponTable.allIds)]
          // 把couponId补充到groupTable里
          this.tables.groupTable.byId[data.vo.id].coupons.push(data.id)
        }
      }
      this.tables.groupCouponTable.status = 'total'
    }
  }
})
