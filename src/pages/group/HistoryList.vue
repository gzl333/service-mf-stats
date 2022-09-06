<script setup lang="ts">
import { onMounted, Ref, ref, computed } from 'vue'
import { useStore } from 'stores/store'
// import { useRoute } from 'vue-router'
// import { navigateToUrl } from 'single-spa'
import { i18n } from 'boot/i18n'
import GroupUsageTable from 'components/group/GroupUsageTable.vue'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { Notify } from 'quasar'
import { getHistoryStartFormatDate, getNowFormatDate } from 'src/hooks/processTime'
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
const startDate = getHistoryStartFormatDate()
const currentDate = getNowFormatDate(1)
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
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
  date_end: currentDate
})
const exportQuery: Ref = ref({
  date_start: startDate,
  date_end: currentDate,
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
const selectDate = () => {
  query.value.date_start = dateFrom.value.replace(/(\/)/g, '-')
  query.value.date_end = dateTo.value.replace(/(\/)/g, '-')
  exportQuery.value.date_start = dateFrom.value.replace(/(\/)/g, '-')
  exportQuery.value.date_end = dateTo.value.replace(/(\/)/g, '-')
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
}
const selectGroup = (val: Record<string, string>) => {
  if (val.value !== '0') {
    query.value.vo_id = val.value
    exportQuery.value.vo_id = val.value
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
const search = async () => {
  if (groupId.value.value === '0') {
    await getDetailData()
  } else {
    await getSingleDetailData()
  }
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
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '项目组云主机历史用量统计' : 'Historical Usage Statistics Of Group Servers')
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
  <div class="HistoryList">
    <div class="row items-center justify-between">
      <div class="col-3 row items-center">
      <div class="col-5">
        <q-input filled dense v-model="dateFrom" mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dateFrom" @update:model-value="selectDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup no-caps :label="tc('确定')" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="text-center col-1">{{ tc('至') }}</div>
      <div class="col-5">
        <q-input filled dense v-model="dateTo" mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dateTo" @update:model-value="selectDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup no-caps :label="tc('确定')" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      </div>
      <div class="col-5 row justify-between">
        <q-select class="col-5" outlined dense v-model="groupId" :options="groupOptions" @update:model-value="selectGroup" :label="tc('筛选项目组')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        <q-select class="col-5" outlined dense v-model="serviceId" :options="filterOptions" @update:model-value="selectService" :label="tc('筛选服务')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        <q-btn outline no-caps :label="tc('搜索')" @click="search"/>
      </div>
      <div class="col-4 row justify-end">
        <q-btn outline no-caps :label="tc('导出当页数据')" class="q-ml-xl" @click="exportFile"/>
        <q-btn outline no-caps :label="tc('导出全部数据')" class="q-ml-md" @click="exportAll"/>
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
.HistoryList {
}
</style>
