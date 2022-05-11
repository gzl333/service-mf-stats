<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const tab = ref('id')
const activeItem = ref('id')
const idShow = ref(true)
const groupShow = ref(false)
const uuidShow = ref(false)
const nodeShow = ref(false)
const idColumns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'center'
  },
  { name: 'user', align: 'center', label: '用户' },
  { name: 'company', label: '单位', style: 'width: 10px', align: 'center' },
  { name: 'department', label: '部门', align: 'center' },
  { name: 'totalBillAount', label: '计费金额合计', align: 'center' },
  { name: 'totalActualDeductionAmount', label: '实际扣费金额合计', align: 'center' },
  { name: 'totalvirtualMachines', label: '云主机数量合计', align: 'center' },
  { name: 'operation', label: '操作', align: 'center' }
]
const idRows = [
  {
    id: 159,
    user: 'Frozen Yogurt',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 237,
    user: 'Ice cream sandwich',
    company: 9.0,
    department: 37,
    totalBillAount: 4.3,
    totalActualDeductionAmount: 129,
    totalvirtualMachines: '8%',
    operation: '1%'
  },
  {
    id: 262,
    user: 'Eclair',
    company: 16.0,
    department: 23,
    totalBillAount: 6.0,
    totalActualDeductionAmount: 337,
    totalvirtualMachines: '6%',
    operation: '7%'
  },
  {
    id: 305,
    user: 'Cupcake',
    company: 3.7,
    department: 67,
    totalBillAount: 4.3,
    totalActualDeductionAmount: 413,
    totalvirtualMachines: '3%',
    operation: '8%'
  },
  {
    id: 356,
    user: 'Gingerbread',
    company: 16.0,
    department: 49,
    totalBillAount: 3.9,
    totalActualDeductionAmount: 327,
    totalvirtualMachines: '7%',
    operation: '16%'
  },
  {
    id: 159,
    user: 'Frozen Yogurt',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 159,
    user: 'Frozen Yogurt',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 159,
    user: 'Frozen Yogurt',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 159,
    user: 'Frozen Yogurt',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 159,
    user: 'Frozen Yogurt',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  }
]
const groupColumns = [
  { name: 'id', required: true, label: 'ID', align: 'center' },
  { name: 'teamName', align: 'center', label: '项目组名称' },
  { name: 'company', label: '单位', style: 'width: 10px', align: 'center' },
  { name: 'department', label: '部门', align: 'center' },
  { name: 'totalBillAount', label: '计费金额合计', align: 'center' },
  { name: 'totalActualDeductionAmount', label: '实际扣费金额合计', align: 'center' },
  { name: 'totalvirtualMachines', label: '云主机数量合计', align: 'center' },
  { name: 'operation', label: '操作', align: 'center' }
]
const groupRows = [
  {
    id: 159,
    teamName: 'Frozen',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 157,
    teamName: 'Frozen',
    company: 9.0,
    department: 37,
    totalBillAount: 4.3,
    totalActualDeductionAmount: 129,
    totalvirtualMachines: '8%',
    operation: '1%'
  },
  {
    id: 157,
    teamName: 'Frozen',
    company: 16.0,
    department: 23,
    totalBillAount: 6.0,
    totalActualDeductionAmount: 337,
    totalvirtualMachines: '6%',
    operation: '7%'
  },
  {
    id: 157,
    teamName: 'Frozen',
    company: 3.7,
    department: 67,
    totalBillAount: 4.3,
    totalActualDeductionAmount: 413,
    totalvirtualMachines: '3%',
    operation: '8%'
  },
  {
    id: 157,
    teamName: 'Frozen',
    company: 16.0,
    department: 49,
    totalBillAount: 3.9,
    totalActualDeductionAmount: 327,
    totalvirtualMachines: '7%',
    operation: '16%'
  },
  {
    id: 157,
    teamName: 'Frozen',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 157,
    teamName: 'Frozen',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 157,
    teamName: 'Frozen',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 157,
    teamName: 'Frozen',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 157,
    teamName: 'Frozen',
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  }
]
const uuidRows = [
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  },
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  },
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  },
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  },
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  },
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  },
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  },
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  },
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  },
  {
    uuid: '123456',
    ip: '159.126.111.222',
    service: '云联邦',
    configuration: '4核8GB内存200GB本地硬盘公网ip:1.11.1.11',
    state: '正常',
    settlementType: '在线',
    user: 'duyukuan@cnic.cn',
    totalUseTime: '10天',
    publicIP: '10个',
    vCPU: '10核',
    memory: '8G',
    disk: '20G',
    flow: '2G',
    billAmount: '1000',
    totalActualDeductionAmount: '500'
  }
]
const nodeColumns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'center'
  },
  { name: 'service', align: 'center', label: '服务节点' },
  { name: 'company', label: '所属单位', style: 'width: 10px', align: 'center' },
  { name: 'totalBillAount', label: '计费金额合计', align: 'center' },
  { name: 'totalActualDeductionAmount', label: '实际扣费金额合计', align: 'center' },
  { name: 'userNumber', label: '用户数量', align: 'center' },
  { name: 'totalvirtualMachines', label: '云主机数量合计', align: 'center' },
  { name: 'operation', label: '操作', align: 'center' }
]
const nodeRows = [
  {
    id: 'Frozen Yogurt',
    service: 159,
    company: 6.0,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    userNumber: 24,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Ice cream sandwich',
    service: 237,
    company: 9.0,
    totalBillAount: 4.3,
    totalActualDeductionAmount: 129,
    userNumber: 37,
    totalvirtualMachines: '8%',
    operation: '1%'
  },
  {
    id: 'Eclair',
    service: 262,
    company: 16.0,
    totalBillAount: 6.0,
    totalActualDeductionAmount: 337,
    userNumber: 23,
    totalvirtualMachines: '6%',
    operation: '7%'
  },
  {
    id: 'Cupcake',
    service: 305,
    company: 3.7,
    totalBillAount: 4.3,
    totalActualDeductionAmount: 413,
    userNumber: 67,
    totalvirtualMachines: '3%',
    operation: '8%'
  },
  {
    id: 'Gingerbread',
    service: 356,
    company: 16.0,
    totalBillAount: 3.9,
    totalActualDeductionAmount: 327,
    userNumber: 49,
    totalvirtualMachines: '7%',
    operation: '16%'
  },
  {
    id: 'Frozen Yogurt',
    service: 159,
    company: 6.0,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    userNumber: 24,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Frozen Yogurt',
    service: 159,
    company: 6.0,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    userNumber: 24,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Frozen Yogurt',
    service: 159,
    company: 6.0,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    userNumber: 24,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Frozen Yogurt',
    service: 159,
    company: 6.0,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    userNumber: 24,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Frozen Yogurt',
    service: 159,
    company: 6.0,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    userNumber: 24,
    totalvirtualMachines: '14%',
    operation: '1%'
  }
]
// const options = [
//   '用户', 'IP地址'
// ]
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const current = ref(3)
const myDate = new Date()
const year = myDate.getFullYear()
const month = myDate.getMonth()
const day = new Date(year, month, 0).getDate()
let start: string | number = ''
if (month < 10) {
  start = '0' + month
} else {
  start = month
}
const monthOptions: any = ref([])
const yearOptions: any = ref([])
const initSelectYear = () => {
  monthOptions.value.push({ value: 0, label: '全年' })
  for (let i = 2021; i <= year; i++) {
    yearOptions.value.push({ value: i, label: i })
  }
  for (let i = 1; i <= month; i++) {
    monthOptions.value.push({ value: i, label: i + '月' })
  }
}
const changeYear = (val: any) => {
  monthOptions.value = []
  searchQuery.value.month = { label: '全年', value: 0 }
  monthOptions.value.push({ value: 0, label: '全年' })
  if (val.value === myDate.getFullYear()) {
    for (let i = 1; i <= month; i++) {
      monthOptions.value.push({ value: i, label: i + '月' })
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      monthOptions.value.push({ value: i, label: i + '月' })
    }
  }
}
const idFun = () => {
  activeItem.value = 'id'
  groupShow.value = false
  uuidShow.value = false
  nodeShow.value = false
  idShow.value = true
  searchQuery.value = {
    year: {
      label: year,
      value: year
    },
    month: {
      label: '全年',
      value: 0
    },
    userName: ''
  }
}
const groupFun = () => {
  activeItem.value = 'group'
  idShow.value = false
  uuidShow.value = false
  nodeShow.value = false
  groupShow.value = true
  searchQuery.value = {
    year: {
      label: year,
      value: year
    },
    month: {
      label: '全年',
      value: 0
    },
    userName: ''
  }
}
const uuidFun = () => {
  activeItem.value = 'uuid'
  idShow.value = false
  groupShow.value = false
  nodeShow.value = false
  uuidShow.value = true
  searchQuery.value = {
    year: {
      label: year,
      value: year
    },
    month: {
      label: '全年',
      value: 0
    },
    userName: ''
  }
}
const nodeFun = () => {
  activeItem.value = 'node'
  idShow.value = false
  groupShow.value = false
  uuidShow.value = false
  nodeShow.value = true
  searchQuery.value = {
    year: {
      label: year,
      value: year
    },
    month: {
      label: '全年',
      value: 0
    },
    userName: ''
  }
}
const searchQuery: any = ref({
  year: {
    label: year,
    value: year
  },
  month: {
    label: '全年',
    value: 0
  },
  userName: ''
})
const tableRow = ref([])
const query: any = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: year + '-' + '05-11',
  'as-admin': true
})
// console.log('query', query.value)
const search = () => {
  if (idShow.value) {
    console.log('1111')
  }
  if (groupShow.value) {
    console.log('2222')
  }
  if (uuidShow.value) {
    query.value.user_id = searchQuery.value.userName
    let dateStart = ''
    let dateEnd = ''
    if (searchQuery.value.month.value === 0) {
      if (searchQuery.value.year.value !== year) {
        dateStart = searchQuery.value.year.value + '-' + '01-01'
        dateEnd = searchQuery.value.year.value + '-' + '12-31'
      } else {
        if (month < 10) {
          const day = new Date(searchQuery.value.year.value, searchQuery.value.month.value, 0).getDate()
          dateStart = searchQuery.value.year.value + '-' + '01-01'
          dateEnd = searchQuery.value.year.value + '-' + '0' + month + '-' + day
        } else {
          const day = new Date(searchQuery.value.year.value, searchQuery.value.month.value, 0).getDate()
          dateStart = searchQuery.value.year.value + '-' + '01-01'
          dateEnd = searchQuery.value.year.value + '-' + month + '-' + day
        }
      }
    } else {
      if (month < 10) {
        const day = new Date(searchQuery.value.year.value, searchQuery.value.month.value, 0).getDate()
        dateStart = searchQuery.value.year.value + '-' + '0' + searchQuery.value.month.value + '-' + '01'
        dateEnd = searchQuery.value.year.value + '-' + '0' + searchQuery.value.month.value + '-' + day
      } else {
        const day = new Date(searchQuery.value.year.value, searchQuery.value.month.value, 0).getDate()
        dateStart = searchQuery.value.year.value + '-' + searchQuery.value.month.value + '-' + '01'
        dateEnd = searchQuery.value.year.value + '-' + searchQuery.value.month.value + '-' + day
      }
    }
    query.value.date_start = dateStart
    query.value.date_end = dateEnd
    store.getUUMachineData(query.value)
  }
  if (nodeShow.value) {
    console.log('4444')
  }
}
const changePageSize = () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  // void getData(searchQuery.value)
}
const changePagination = (val: number) => {
  query.value.page = val
  // void getData(searchQuery.value)
}
onMounted(async () => {
  initSelectYear()
  const data = await store.getUUMachineData(query.value)
  tableRow.value = data.data.results
  console.log('data', data)
  console.log(tableRow.value)
})
</script>

<template>
  <div>
    <div class="row q-px-lg q-mt-md q-gutter-x-sm">
      <div class="col-1">
        <q-select outlined dense v-model="searchQuery.year" :options="yearOptions" label="请选择"
                  @update:model-value="changeYear"/>
      </div>
      <div class="col-1">
        <q-select outlined dense v-model="searchQuery.month" :options="monthOptions" label="请选择"/>
      </div>
      <div class="col-2">
        <q-input dense outlined clearable v-model="searchQuery.userName" label="请输入用户名"/>
      </div>
<!--      <div class="col-2" v-show="uuidShow">-->
<!--        <q-select dense outlined clearable v-model="searchQuery.company" :options="options" label="请选择"/>-->
<!--      </div>-->
    </div>
    <div class="row q-px-lg q-mt-md items-center">
      <div class="col-6">
        <q-tabs
          v-model="tab"
          inline-label
          :breakpoint="0"
          align="justify"
          indicator-color="blue-grey"
          class="shadow-2"
        >
          <q-tab name="id" @click="idFun" :class="activeItem === 'id' ? 'bg-blue-4' : 'bg-grey-4'">按用户id显示</q-tab>
          <q-tab name="group" @click="groupFun" :class="activeItem === 'group' ? 'bg-blue-4' : 'bg-grey-4'">按项目组id显示
          </q-tab>
          <q-tab name="uuid" @click="uuidFun" :class="activeItem === 'uuid' ? 'bg-blue-4' : 'bg-grey-4'">按云主机uuid显示
          </q-tab>
          <q-tab name="node" @click="nodeFun" :class="activeItem === 'node' ? 'bg-blue-4' : 'bg-grey-4'">按服务节点显示</q-tab>
        </q-tabs>
      </div>
      <div class="col-4 row q-gutter-x-lg q-ml-md">
        <q-btn outline text-color="black" label="搜索" class="q-px-xl" @click="search"/>
        <q-btn outline text-color="black" label="导出Excel" class="q-px-lg"/>
      </div>
    </div>
    <div class="q-px-lg q-mt-md">
      <div v-show="idShow">
        <q-table
          flat
          table-header-class="bg-grey-1 text-grey"
          :rows="idRows"
          :columns="idColumns"
          row-key="name"
          color="primary"
          loading-label="网络请求中，请稍候..."
          no-data-label="暂无数据"
          hide-pagination
          :pagination="{ rowsPerPage: 0 }"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="user" :props="props">
                <q-btn
                  @click="navigateToUrl(`/my/stats/cloud/userUsage/${props.row.id}`)"
                  class="q-ma-none" :label="props.row.user" color="primary" padding="xs" flat dense unelevated>
                </q-btn>
              </q-td>
              <q-td key="company" :props="props">
                <div class="text-pre-wrap">{{ props.row.company }}</div>
              </q-td>
              <q-td key="department" :props="props">
                {{ props.row.department }}
              </q-td>
              <q-td key="totalBillAount" :props="props">{{ props.row.totalBillAount }}</q-td>
              <q-td key="totalActualDeductionAmount" :props="props">{{ props.row.totalActualDeductionAmount }}</q-td>
              <q-td key="totalvirtualMachines" :props="props">{{ props.row.totalvirtualMachines }}</q-td>
              <q-td key="operation" :props="props">{{ props.row.operation }}</q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="row q-pa-sm text-grey justify-between items-center">
          <div class="row items-center">
            <span class="q-pr-md">共{{ paginationTable.count }}条数据</span>
            <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense
                      options-dense
                      borderless @update:model-value="changePageSize">
            </q-select>
            <span>/页</span>
          </div>
          <div class="q-pa-lg flex flex-center">
            <q-pagination
              v-model="current"
              :max="5"
              direction-links
              boundary-links
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            />
          </div>
        </div>
      </div>
      <div v-show="groupShow">
        <q-table
          flat
          table-header-class="bg-grey-1 text-grey"
          :rows="groupRows"
          :columns="groupColumns"
          row-key="name"
          color="primary"
          loading-label="网络请求中，请稍候..."
          no-data-label="暂无数据"
          hide-pagination
          :pagination="{ rowsPerPage: 0 }"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="teamName" :props="props">
                <q-btn
                  @click="navigateToUrl(`/my/stats/cloud/groupUsage/${props.row.teamName}`)"
                  class="q-ma-none" :label="props.row.teamName" color="primary" padding="xs" flat dense unelevated>
                </q-btn>
              </q-td>
              <q-td key="company" :props="props">
                <div class="text-pre-wrap">{{ props.row.company }}</div>
              </q-td>
              <q-td key="department" :props="props">
                {{ props.row.department }}
              </q-td>
              <q-td key="totalBillAount" :props="props">{{ props.row.totalBillAount }}</q-td>
              <q-td key="totalActualDeductionAmount" :props="props">{{ props.row.totalActualDeductionAmount }}</q-td>
              <q-td key="totalvirtualMachines" :props="props">{{ props.row.totalvirtualMachines }}</q-td>
              <q-td key="operation" :props="props">{{ props.row.operation }}</q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="row q-pa-sm text-grey justify-between items-center">
          <div class="row items-center">
            <span class="q-pr-md">共{{ paginationTable.count }}条数据</span>
            <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[5,10,15,20,25,30]" dense
                      options-dense
                      borderless @update:model-value="changePageSize">
            </q-select>
            <span>/页</span>
          </div>
          <div class="q-pa-lg flex flex-center">
            <q-pagination
              v-model="current"
              :max="5"
              direction-links
              boundary-links
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            />
          </div>
        </div>
      </div>
      <div v-show="uuidShow">
        <q-separator/>
        <q-table
          flat
          table-header-class="bg-grey-1 text-grey"
          :rows="tableRow"
          row-key="name"
          color="primary"
          loading-label="网络请求中，请稍候..."
          no-data-label="暂无数据"
          hide-pagination
          hide-header
          :pagination="{ rowsPerPage: 0 }"
        >
          <template v-slot:top-row>
            <q-tr>
              <q-th rowspan="2">云主机uuid</q-th>
              <q-th rowspan="2">ip地址</q-th>
              <q-th rowspan="2">服务节点</q-th>
              <q-th rowspan="2">初始配置</q-th>
<!--              <q-th rowspan="2">状态</q-th>-->
<!--              <q-th rowspan="2">结算类型</q-th>-->
<!--              <q-th rowspan="2">用户</q-th>-->
              <q-th colspan="6">计量项</q-th>
<!--              <q-th rowspan="2">计费金额(总)</q-th>-->
<!--              <q-th rowspan="2">实际扣费金额合计(总)</q-th>-->
            </q-tr>
            <q-tr>
              <q-th>使用总时长(天)</q-th>
              <q-th>公网IP(个)</q-th>
              <q-th>vCPU(核*天）</q-th>
              <q-th>内存(GB*天)</q-th>
              <q-th>本地硬盘(GB*天)</q-th>
              <q-th>流量(GB*天)</q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
<!--            <div>{{props.row}}</div>-->
            <q-tr :props="props">
              <q-td key="server_id" :props="props">
                <div class="text-center">
                  <q-btn
                    @click="navigateToUrl(`/my/stats/cloud/uuUsage/${props.row.server_id}`)"
                    class="q-ma-none" :label="props.row.server_id" color="primary" padding="xs" flat dense unelevated>
                  </q-btn>
                </div>
              </q-td>
              <q-td key="server" :props="props">
                <div class="text-center">{{ props.row.server.ipv4 }}</div>
              </q-td>
              <q-td key="service_name" :props="props">
                <div class="text-center">{{ props.row.service_name }}</div>
              </q-td>
              <q-td key="server" :props="props">
                <div class="text-center">{{ props.row.server.vcpus + '核' + props.row.server.ram / 1024 + 'GB内存' }}</div>
              </q-td>
<!--              <q-td key="state" :props="props">-->
<!--                <div class="text-center">{{ props.row.state }}</div>-->
<!--              </q-td>-->
<!--              <q-td key="settlementType" :props="props">-->
<!--                <div class="text-center">{{ props.row.settlementType }}</div>-->
<!--              </q-td>-->
<!--              <q-td key="user" :props="props">-->
<!--                <div class="text-center">{{ props.row.user }}</div>-->
<!--              </q-td>-->
              <q-td class="text-left text-justify" key="server" :props="props">
                <div class="text-center">{{ (props.row.total_public_ip_hours + props.row.total_cpu_hours + props.row.total_ram_hours + props.row.total_disk_hours + props.row.total_original_amount) / 24 }}</div>
              </q-td>
              <q-td class="text-right" key="total_public_ip_hours" :props="props">
                <div class="text-center">{{ props.row.total_public_ip_hours / 24 }}</div>
              </q-td>
              <q-td class="text-left" key="total_cpu_hours" :props="props">
                <div class="text-center">{{ props.row.total_cpu_hours / 24 }}</div>
              </q-td>
              <q-td key="total_ram_hours" :props="props">
                <div class="text-center">{{ props.row.total_ram_hours / 24 }}</div>
              </q-td>
              <q-td key="total_disk_hours" :props="props">
                <div class="text-center">{{ props.row.total_disk_hours / 24 }}</div>
              </q-td>
              <q-td key="total_original_amount" :props="props">
                <div class="text-center">{{ props.row.total_original_amount / 24 }}</div>
              </q-td>
              <q-td key="billAmount" :props="props">
                <div class="text-center">{{ props.row.billAmount }}</div>
              </q-td>
              <q-td key="totalActualDeductionAmount" :props="props">
                <div class="text-center">{{ props.row.totalActualDeductionAmount }}</div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-separator/>
        <div class="row q-pa-sm text-grey justify-between items-center">
          <div class="row items-center">
            <span class="q-pr-md">共{{ paginationTable.count }}台云主机</span>
            <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense options-dense
                      borderless @update:model-value="changePageSize">
            </q-select>
            <span>/页</span>
          </div>
          <q-pagination
            v-model="paginationTable.page"
            max="10"
            :max-pages="9"
            direction-links
            outline
            :ripple="false"
            @update:model-value="changePagination"
          />
          <!--            :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"-->
        </div>
      </div>
      <div v-show="nodeShow">
        <q-table
          flat
          table-header-class="bg-grey-1 text-grey"
          :rows="nodeRows"
          :columns="nodeColumns"
          row-key="name"
          color="primary"
          loading-label="网络请求中，请稍候..."
          no-data-label="暂无数据"
          hide-pagination
          :pagination="{ rowsPerPage: 0 }"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="service" :props="props">
                <q-btn
                  @click="navigateToUrl(`/my/stats/cloud/nodeUsage/${props.row.service}`)"
                  class="q-ma-none" :label="props.row.service" color="primary" padding="xs" flat dense unelevated>
                </q-btn>
              </q-td>
              <q-td key="company" :props="props">
                <div class="text-pre-wrap">{{ props.row.company }}</div>
              </q-td>
              <q-td key="totalBillAount" :props="props">{{ props.row.totalBillAount }}</q-td>
              <q-td key="totalActualDeductionAmount" :props="props">{{ props.row.totalActualDeductionAmount }}</q-td>
              <q-td key="userNumber" :props="props">
                {{ props.row.userNumber }}
              </q-td>
              <q-td key="totalvirtualMachines" :props="props">{{ props.row.totalvirtualMachines }}</q-td>
              <q-td key="operation" :props="props">{{ props.row.operation }}</q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="row q-pa-sm text-grey justify-between items-center">
          <div class="row items-center">
            <span class="q-pr-md">共{{ paginationTable.count }}条数据</span>
            <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense
                      options-dense
                      borderless @update:model-value="changePageSize">
            </q-select>
            <span>/页</span>
          </div>
          <div class="q-pa-lg flex flex-center">
            <q-pagination
              v-model="current"
              :max="5"
              direction-links
              boundary-links
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ServiceList {
}
</style>
