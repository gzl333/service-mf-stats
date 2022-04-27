<script setup lang="ts">
import { ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
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
const columns = [
  { name: 'uuid', align: 'center', label: 'UUID' },
  { name: 'service', label: '服务节点', align: 'center' },
  { name: 'user', label: '用户', align: 'center' },
  { name: 'settlementType', label: '结算类型', align: 'center' },
  { name: 'state', label: '状态', align: 'center' },
  { name: 'time', label: '到期时间', align: 'center' }
]
const rows = [
  {
    uuid: 159,
    service: 24,
    user: '14%',
    settlementType: 87,
    state: 4.0,
    time: '1%'
  }
]
const columns3 = [
  { name: 'dailyTime', align: 'center', label: '每日统计时间' },
  { name: 'useTime', label: '使用时长(天)', align: 'center' },
  { name: 'publicIP', label: '公网IP(个)', align: 'center' },
  { name: 'vCPU', label: 'vCPU(核*天）', align: 'center' },
  { name: 'memory', label: '内存(GB*天)', align: 'center' },
  { name: 'disk', label: '本地硬盘(GB*天)', align: 'center' },
  { name: 'flow', label: '流量(GB*天)', align: 'center' },
  { name: 'billAmount', label: '计费金额合计', align: 'center' },
  { name: 'totalActualDeductionAmount', label: '实际扣费金额合计', align: 'center' }
]
const rows3 = [
  {
    dailyTime: 159,
    useTime: 24,
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    dailyTime: 159,
    useTime: 24,
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    dailyTime: 159,
    useTime: 24,
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    dailyTime: 159,
    useTime: 24,
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    dailyTime: 159,
    useTime: 24,
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    dailyTime: 159,
    useTime: '14%',
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    dailyTime: 159,
    useTime: 24,
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    dailyTime: 159,
    useTime: 24,
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    dailyTime: 159,
    useTime: 24,
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  },
  {
    dailyTime: 159,
    useTime: 24,
    publicIP: '1%',
    vCPU: '1%',
    memory: '1%',
    disk: '1%',
    flow: '1%',
    billAmount: '1%',
    totalActualDeductionAmount: '1%'
  }
]
const current = ref(3)
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
</script>

<template>
  <div class="UUTable">
    <div class="q-px-lg">
      <q-table
        flat
        table-header-class="bg-grey-1 text-grey"
        :rows="rows"
        :columns="columns"
        row-key="name"
        color="primary"
        loading-label="网络请求中，请稍候..."
        no-data-label="暂无数据"
        hide-pagination
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="uuid" :props="props">{{ props.row.uuid }}</q-td>
            <q-td key="service" :props="props">{{ props.row.service }}</q-td>
            <q-td key="user" :props="props">{{ props.row.user }}</q-td>
            <q-td key="settlementType" :props="props">{{ props.row.settlementType }}</q-td>
            <q-td key="state" :props="props">{{ props.row.state }}</q-td>
            <q-td key="time" :props="props">{{ props.row.time }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator/>
    </div>
    <div class="row">
    <div class="col-12 q-px-lg q-mt-xl">
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
            <q-td key="dailyTime" :props="props">{{ props.row.dailyTime }}</q-td>
            <q-td key="useTime" :props="props">{{ props.row.useTime }}</q-td>
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
.UUTable {
}
</style>
