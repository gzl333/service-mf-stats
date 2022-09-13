<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { useStore, GroupServerMeteringInterface } from 'stores/store'
import { useRoute } from 'vue-router'
import { i18n } from 'boot/i18n'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { getLastFormatDate, getNowFormatDate } from 'src/hooks/processTime'
import { exportNotify } from 'src/hooks/ExportNotify'
import GroupUsageTable from 'components/group/GroupUsageTable.vue'
// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

const store = useStore()
const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const serviceOptions = computed(() => store.getServices('enable'))
const groupOptions = computed(() => store.getGroupOptions)
const tableRow = ref<GroupServerMeteringInterface[]>([])
const currentMonthStartDate = getNowFormatDate(0)
const currentMonthEndDate = getNowFormatDate(1)
const lastMonthStartDate = getLastFormatDate(0)
const lastMonthEndDate = getLastFormatDate(1)
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const groupId = ref({
  label: '全部项目组',
  labelEn: 'All Groups',
  value: '0'
})
const serviceId = ref({
  label: '全部服务',
  labelEn: 'All Services',
  value: ''
})
const query = ref<Record<string, string | number>>({
  page: 1,
  page_size: 10,
  date_start: route.meta.time === 'current' ? currentMonthStartDate : lastMonthStartDate,
  date_end: route.meta.time === 'current' ? currentMonthEndDate : lastMonthEndDate
})
const exportQuery: Record<string, string | boolean> = {
  date_start: route.meta.time === 'current' ? currentMonthStartDate : lastMonthStartDate,
  date_end: route.meta.time === 'current' ? currentMonthEndDate : lastMonthEndDate,
  download: true
}
const getSingleGroupMonthData = async () => {
  tableRow.value = []
  paginationTable.value.count = 0
  let obj: GroupServerMeteringInterface = {
    ipv4: '',
    vo_id: '',
    server_id: '',
    service_name: '',
    ram: undefined,
    vcpus: undefined,
    total_cpu_hours: undefined,
    total_disk_hours: undefined,
    total_original_amount: undefined,
    total_public_ip_hours: undefined,
    total_ram_hours: undefined,
    total_trade_amount: undefined
  }
  // query.value.vo_id = groupId.value.value
  const data = await store.getServerMetering(query.value)
  for (const elem of data.data.results) {
    obj = {
      ipv4: '',
      vo_id: '',
      server_id: '',
      service_name: '',
      ram: undefined,
      vcpus: undefined,
      total_cpu_hours: undefined,
      total_disk_hours: undefined,
      total_original_amount: undefined,
      total_public_ip_hours: undefined,
      total_ram_hours: undefined,
      total_trade_amount: undefined
    }
    obj.server_id = elem.server_id
    obj.ipv4 = elem.server.ipv4
    obj.service_name = elem.service_name
    obj.vo_id = groupId.value.value
    obj.vcpus = elem.server.vcpus
    obj.ram = elem.server.ram
    obj.total_public_ip_hours = elem.total_public_ip_hours
    obj.total_cpu_hours = elem.total_cpu_hours
    obj.total_ram_hours = elem.total_ram_hours
    obj.total_disk_hours = elem.total_disk_hours
    obj.total_original_amount = elem.total_original_amount
    obj.total_trade_amount = elem.total_trade_amount
    tableRow.value.push(obj)
  }
  paginationTable.value.count = data.data.count
}
const getMonthData = async () => {
  tableRow.value = []
  paginationTable.value.count = 0
  let obj: GroupServerMeteringInterface = {
    ipv4: '',
    vo_id: '',
    server_id: '',
    service_name: '',
    ram: undefined,
    vcpus: undefined,
    total_cpu_hours: undefined,
    total_disk_hours: undefined,
    total_original_amount: undefined,
    total_public_ip_hours: undefined,
    total_ram_hours: undefined,
    total_trade_amount: undefined
  }
  for (const id of store.tables.groupTable.allIds) {
    query.value.vo_id = id
    const data = await store.getServerMetering(query.value)
    for (const elem of data.data.results) {
      obj = {
        ipv4: '',
        vo_id: '',
        server_id: '',
        service_name: '',
        ram: undefined,
        vcpus: undefined,
        total_cpu_hours: undefined,
        total_disk_hours: undefined,
        total_original_amount: undefined,
        total_public_ip_hours: undefined,
        total_ram_hours: undefined,
        total_trade_amount: undefined
      }
      obj.server_id = elem.server_id
      obj.ipv4 = elem.server.ipv4
      obj.service_name = elem.service_name
      obj.vo_id = id
      obj.vcpus = elem.server.vcpus
      obj.ram = elem.server.ram
      obj.total_public_ip_hours = elem.total_public_ip_hours
      obj.total_cpu_hours = elem.total_cpu_hours
      obj.total_ram_hours = elem.total_ram_hours
      obj.total_disk_hours = elem.total_disk_hours
      obj.total_original_amount = elem.total_original_amount
      obj.total_trade_amount = elem.total_trade_amount
      tableRow.value.push(obj)
    }
    paginationTable.value.count = paginationTable.value.count + data.data.count
  }
  delete query.value.vo_id
  delete exportQuery.vo_id
}
const selectService = (val: Record<string, string>) => {
  if (val.value !== '') {
    query.value.service_id = val.value
    exportQuery.service_id = val.value
  } else {
    delete query.value.service_id
    delete exportQuery.service_id
  }
}
const selectGroup = (val: Record<string, string>) => {
  query.value.vo_id = val.value
  exportQuery.vo_id = val.value
}
const search = async () => {
  if (groupId.value.value === '0') {
    await getMonthData()
  } else {
    await getSingleGroupMonthData()
  }
}
const changePagination = async (val: number) => {
  query.value.page = val
  await getMonthData()
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getMonthData()
}
const exportFile = () => {
  if (tableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    exportExcel(i18n.global.locale === 'zh' ? '项目组云主机用量统计-' + date.toLocaleTimeString() + '.xlsx' : ' Group Servers Statistics-' + date.toLocaleTimeString() + '.xlsx', '#GroupUsageTable')
  }
}
const exportAll = async () => {
  if (tableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    const fileData = await store.getServerMetering(exportQuery)
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '项目组云主机本月用量统计-' + date.toLocaleTimeString() : 'Group Servers Statistics In Current Month-' + date.toLocaleTimeString())
  }
}
onBeforeMount(async () => {
  if (store.tables.groupTable.allIds.length === 0) {
    await store.loadGroupTable()
  }
  await getMonthData()
})
</script>

<template>
  <div class="MonthList">
    <div class="row items-center justify-between q-mt-xl">
      <div class="col-6 row">
        <q-select class="col-5" outlined dense v-model="groupId" :options="groupOptions" @update:model-value="selectGroup" :label="tc('筛选项目组')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        <q-select outlined dense v-model="serviceId" :options="serviceOptions" @update:model-value="selectService" :label="tc('筛选服务')" class="col-5 q-ml-sm" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        <q-btn class="q-ml-sm" outline no-caps :label="tc('搜索')" @click="search"/>
      </div>
      <div>
        <q-btn outline no-caps :label="tc('导出当页数据')" @click="exportFile"/>
        <q-btn outline no-caps :label="tc('导出全部数据')" class="q-ml-sm" @click="exportAll"/>
      </div>
    </div>
    <div class="q-mt-md">
    <group-usage-table :tableRow="tableRow"/>
    </div>
    <div class="row q-py-md text-grey justify-between items-center">
      <div class="row items-center">
        <span class="q-pr-md" v-if="i18n.global.locale === 'zh'">共{{ paginationTable.count }}条数据</span>
        <span class="q-pr-md" v-else>{{ paginationTable.count }} pieces of data in total</span>
        <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense options-dense
                  borderless @update:model-value="changePageSize">
        </q-select>
        <span>/{{ tc('页') }}</span>
      </div>
      <q-pagination
        v-model="paginationTable.page"
        :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
        :max-pages="9"
        direction-links
        outline
        :ripple="false"
        @update:model-value="changePagination"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.MonthList {
}
</style>
