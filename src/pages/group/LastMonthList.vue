<script setup lang="ts">
import { onMounted, Ref, ref, computed } from 'vue'
import { useStore } from 'stores/store'
// import { useRoute } from 'vue-router'
// import { navigateToUrl } from 'single-spa'
import { i18n } from 'boot/i18n'
import GroupUsageTable from 'components/group/GroupUsageTable.vue'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { Notify } from 'quasar'
import { getLastFormatDate } from 'src/hooks/processTime'
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
const { tc } = i18n.global
const filterOptions = computed(() => store.getServices)
const groupOptions = computed(() => store.getGroupOptions)
const tableRow: Ref = ref([])
const startDate = getLastFormatDate(0)
const endDate = getLastFormatDate(1)
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
  labelEn: 'All Servers',
  value: ''
})
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: startDate,
  date_end: endDate
})
const exportQuery: Ref = ref({
  date_start: startDate,
  date_end: endDate,
  download: true
})
const getSingleDetailData = async () => {
  tableRow.value = []
  paginationTable.value.count = 0
  let obj: Record<string, string> = {}
  // query.value.vo_id = groupId.value.value
  const data = await store.getServerMetering(query.value)
  for (const elem of data.data.results) {
    obj = {}
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
const getDetailData = async () => {
  tableRow.value = []
  paginationTable.value.count = 0
  let obj: Record<string, string> = {}
  for (const id of store.tables.groupTable.allIds) {
    query.value.vo_id = id
    const data = await store.getServerMetering(query.value)
    for (const elem of data.data.results) {
      obj = {}
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
  delete exportQuery.value.vo_id
}
const selectService = (val: Record<string, string>) => {
  if (val.value !== '') {
    query.value.service_id = val.value
    exportQuery.value.service_id = val.value
  } else {
    delete query.value.service_id
    delete exportQuery.value.service_id
  }
  // if (groupId.value.value !== '0') {
  //   query.value.service_id = val.value
  //   exportQuery.value.service_id = val.value
  //   getSingleDetailData()
  // } else {
  //   delete query.value.service_id
  //   delete exportQuery.value.service_id
  //   getDetailData()
  // }
}
const selectGroup = (val: Record<string, string>) => {
  query.value.vo_id = val.value
  exportQuery.value.vo_id = val.value
  // if (val.value !== '0') {
  //   query.value.vo_id = val.value
  //   exportQuery.value.vo_id = val.value
  //   getSingleDetailData()
  // } else {
  //   getDetailData()
  // }
}
const search = async () => {
  if (groupId.value.value === '0') {
    await getDetailData()
  } else {
    await getSingleDetailData()
  }
}
const changePagination = async (val: number) => {
  query.value.page = val
  await getDetailData()
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getDetailData()
}
const exportFile = () => {
  if (tableRow.value.length === 0) {
    Notify.create({
      classes: 'notification-negative shadow-15',
      icon: 'mdi-alert',
      textColor: 'negative',
      message: tc('暂无数据'),
      position: 'bottom',
      closeBtn: true,
      timeout: 5000,
      multiLine: false
    })
  } else {
    exportExcel(i18n.global.locale === 'zh' ? '项目组云主机用量统计.xlsx' : ' Group Servers Statistics.xlsx', '#GroupUsageTable')
  }
}
const exportAll = async () => {
  if (tableRow.value.length === 0) {
    Notify.create({
      classes: 'notification-negative shadow-15',
      icon: 'mdi-alert',
      textColor: 'negative',
      message: tc('暂无数据'),
      position: 'bottom',
      closeBtn: true,
      timeout: 5000,
      multiLine: false
    })
  } else {
    const fileData = await store.getServerHostFile(exportQuery.value)
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '项目组云主机上月月用量统计' : 'Group Servers Statistics In Last Month')
  }
}
onMounted(async () => {
  if (store.tables.groupTable.allIds.length === 0) {
    await store.loadGroupTable()
  }
  await getDetailData()
})
</script>

<template>
  <div class="CurrentMonthList">
    <div class="row items-center justify-between">
      <div class="col-5 row">
        <q-select class="col-5" outlined dense v-model="groupId" :options="groupOptions" @update:model-value="selectGroup" :label="tc('筛选项目组')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        <q-select outlined dense v-model="serviceId" :options="filterOptions" @update:model-value="selectService" :label="tc('筛选服务')" class="col-5 q-ml-xs" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        <q-btn class="q-ml-xs" outline no-caps :label="tc('搜索')" @click="search"/>
      </div>
      <div>
        <q-btn outline no-caps :label="tc('导出当页数据')" @click="exportFile"/>
        <q-btn outline no-caps :label="tc('导出全部数据')" class="q-ml-xs" @click="exportAll"/>
      </div>
    </div>
    <group-usage-table :tableRow="tableRow"/>
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
.CurrentMonthList {
}
</style>
