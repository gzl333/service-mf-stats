<script setup lang="ts">
import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
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

// const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const searchDate = ref('')
const getNowFormatDate = (): string => {
  const date = new Date()
  const seperator = '/'
  const year = date.getFullYear()
  let month: any = date.getMonth() + 1
  let strDate: any = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  const currentDate = year + seperator + month + seperator + strDate
  return currentDate
}
searchDate.value = getNowFormatDate()
const tab = ref('mails')
const columns1 = [
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
const rows1 = [
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
const columns2 = [
  { name: 'id', required: true, label: 'ID', align: 'center' },
  { name: 'teamName', align: 'center', label: '项目组名称' },
  { name: 'company', label: '单位', style: 'width: 10px', align: 'center' },
  { name: 'department', label: '部门', align: 'center' },
  { name: 'totalBillAount', label: '计费金额合计', align: 'center' },
  { name: 'totalActualDeductionAmount', label: '实际扣费金额合计', align: 'center' },
  { name: 'totalvirtualMachines', label: '云主机数量合计', align: 'center' },
  { name: 'operation', label: '操作', align: 'center' }
]
const rows2 = [
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
const columns3 = [
  {
    name: 'uuid',
    required: true,
    label: '云主机uuid',
    align: 'center'
  },
  { name: 'ip', align: 'center', label: 'ip地址' },
  { name: 'service', label: '服务节点', style: 'width: 10px', align: 'center' },
  { name: 'configuration', label: '初始配置', align: 'center' },
  { name: 'state', label: '状态', align: 'center' },
  { name: 'settlementType', label: '结算类型', align: 'center' },
  { name: 'user', label: '用户', align: 'center' },
  { name: 'totalUseTime', label: '使用总时长(天)', align: 'center' },
  { name: 'publicIP', label: '公网IP(个)', align: 'center' },
  { name: 'vCPU', label: 'vCPU(核*天）', align: 'center' },
  { name: 'memory', label: '内存(GB*天)', align: 'center' },
  { name: 'disk', label: '本地硬盘(GB*天)', align: 'center' },
  { name: 'flow', label: '流量(GB*天)', align: 'center' },
  { name: 'billAmount', label: '计费金额(总)', align: 'center' },
  { name: 'totalActualDeductionAmount', label: '实际扣费金额合计(总)', align: 'center' }
]
const rows3 = [
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    uuid: 'Frozen Yogurt',
    ip: 159,
    service: 6.0,
    configuration: 24,
    state: 4.0,
    settlementType: 87,
    user: '1%',
    totalUseTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  }
]
const columns4 = [
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
const rows4 = [
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
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const current = ref(3)
const isShow1 = ref(true)
const isShow2 = ref(false)
const isShow3 = ref(false)
const isShow4 = ref(false)
const fun1 = () => {
  isShow2.value = false
  isShow3.value = false
  isShow4.value = false
  isShow1.value = true
}
const fun2 = () => {
  isShow1.value = false
  isShow3.value = false
  isShow4.value = false
  isShow2.value = true
}
const fun3 = () => {
  isShow1.value = false
  isShow2.value = false
  isShow4.value = false
  isShow3.value = true
}
const fun4 = () => {
  isShow1.value = false
  isShow2.value = false
  isShow3.value = false
  isShow4.value = true
}
const text = ref('')
const model = ref(null)
const options = [
  '用户', 'IP地址'
]
</script>

<template>
  <div>
      <div class="row q-px-lg q-mt-md q-gutter-x-md">
        <div class="col-2">
          <q-input filled v-model="searchDate" mask="date" :rules="['searchDate']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-2">
          <q-input outlined v-model="text" label="请输入"/>
        </div>
        <div class="col-2" v-show="isShow3">
          <q-select square outlined v-model="model" :options="options" label="请选择"/>
        </div>
      </div>
      <div class="row q-px-lg items-center">
        <div class="col-6">
          <q-tabs
            v-model="tab"
            inline-label
            :breakpoint="0"
            align="justify"
            class="bg-grey-3 text-black text-bold"
          >
            <q-tab name="mails" @click="fun1">按用户id显示</q-tab>
            <q-tab name="alarms" @click="fun2">按项目组id显示</q-tab>
            <q-tab name="movies" @click="fun3">按云主机uuid显示</q-tab>
            <q-tab name="photos" @click="fun4">按服务节点显示</q-tab>
          </q-tabs>
        </div>
        <div class="col-4 row q-gutter-x-lg q-ml-xs">
          <q-btn color="white" text-color="black" label="搜索"/>
          <q-btn color="white" text-color="black" label="导出Excel"/>
        </div>
      </div>
      <div class="q-px-lg q-mt-md">
        <div v-show="isShow1">
          <q-table
            flat
            table-header-class="bg-grey-1 text-grey"
            :rows="rows1"
            :columns="columns1"
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
                  <q-btn
                    @click="navigateToUrl(`/my/stats/cloud/userUsage/${props.row.id}`)"
                    class="q-ma-none" :label="props.row.id" color="primary" padding="xs" flat dense unelevated>
                  </q-btn>
                </q-td>
                <q-td key="user" :props="props">
                  {{ props.row.user }}
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
              <span class="q-pr-md">共{{ paginationTable.count }}台云主机</span>
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
        <div v-show="isShow2">
          <q-table
            flat
            table-header-class="bg-grey-1 text-grey"
            :rows="rows2"
            :columns="columns2"
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
              <span class="q-pr-md">共{{ paginationTable.count }}台云主机</span>
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
        <div v-show="isShow3">
          <q-table
            flat
            table-header-class="bg-grey-1 text-grey"
            :rows="rows3"
            :columns="columns3"
            row-key="name"
            color="primary"
            loading-label="网络请求中，请稍候..."
            no-data-label="暂无数据"
            hide-pagination
            :pagination="{ rowsPerPage: 0 }"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="uuid" :props="props">
                  <q-btn
                    @click="navigateToUrl(`/my/stats/cloud/uuUsage/${props.row.uuid}`)"
                    class="q-ma-none" :label="props.row.uuid" color="primary" padding="xs" flat dense unelevated>
                  </q-btn>
                </q-td>
                <q-td key="ip" :props="props">{{ props.row.ip }}</q-td>
                <q-td key="service" :props="props">
                  <div class="text-pre-wrap">{{ props.row.service }}</div>
                </q-td>
                <q-td key="configuration" :props="props">{{ props.row.configuration }}</q-td>
                <q-td key="state" :props="props">{{ props.row.state }}</q-td>
                <q-td key="settlementType" :props="props">{{ props.row.settlementType }}</q-td>
                <q-td key="user" :props="props">{{ props.row.user }}</q-td>
                <q-td key="totalUseTime" :props="props">{{ props.row.totalUseTime }}</q-td>
                <q-td key="publicIP" :props="props">{{ props.row.publicIP }}</q-td>
                <q-td key="vCPU" :props="props">{{ props.row.vCPU }}</q-td>
                <q-td key="memory" :props="props">{{ props.row.memory }}</q-td>
                <q-td key="disk" :props="props">{{ props.row.disk }}</q-td>
                <q-td key="flow" :props="props">{{ props.row.flow }}</q-td>
                <q-td key="billAmount" :props="props">{{ props.row.billAmount }}</q-td>
                <q-td key="totalActualDeductionAmount" :props="props">{{ props.row.totalActualDeductionAmount }}</q-td>
              </q-tr>
            </template>
          </q-table>
          <div class="row q-pa-sm text-grey justify-between items-center">
            <div class="row items-center">
              <span class="q-pr-md">共{{ paginationTable.count }}台云主机</span>
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
        <div v-show="isShow4">
          <q-table
            flat
            table-header-class="bg-grey-1 text-grey"
            :rows="rows4"
            :columns="columns4"
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
              <span class="q-pr-md">共{{ paginationTable.count }}台云主机</span>
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
      </div>
  </div>
</template>

<style lang="scss" scoped>
.ServiceListById {
}
</style>
