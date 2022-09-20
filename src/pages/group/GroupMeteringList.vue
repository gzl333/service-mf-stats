<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { useStore, GroupServerMeteringInterface } from 'stores/store'
import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { exportNotify } from 'src/hooks/ExportNotify'
import GroupUsageTable from 'components/group/GroupUsageTable.vue'
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
const route = useRoute()
const router = useRouter()
const { tc } = i18n.global
const serviceOptions = computed(() => store.getServices('enable'))
const tableRow = ref<GroupServerMeteringInterface[]>([])
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const serviceId = ref({
  label: '全部服务',
  labelEn: 'All Services',
  value: ''
})
const startDate = getHistoryStartFormatDate()
const currentDate = getNowFormatDate(1)
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
const myLocale = {
  days: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  daysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  firstDayOfWeek: 1,
  format24h: true,
  pluralDay: 'dias'
}
const query = ref<Record<string, string | number>>({
  page: 1,
  page_size: 10,
  date_start: startDate,
  date_end: currentDate,
  vo_id: route.params.voId as string
})
const exportQuery: Record<string, string | boolean> = {
  date_start: startDate,
  date_end: currentDate,
  download: true
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
const selectDate = () => {
  dateFrom.value = query.value.date_start as string
  dateTo.value = query.value.date_end as string
}
const search = async () => {
  await getSingleGroupMonthData1()
}
const changePagination = async (val: number) => {
  query.value.page = val
  await getSingleGroupMonthData1()
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getSingleGroupMonthData1()
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
const getSingleGroupMonthData1 = async () => {
  tableRow.value = []
  // paginationTable.value.count = 0
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
    obj.vcpus = elem.server.vcpus
    obj.ram = elem.server.ram
    obj.vo_id = route.params.voId as string
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
onBeforeMount(() => {
  getSingleGroupMonthData1()
})
</script>

<template>
  <div class="MonthList">
    <div class="row items-center title-area q-mt-xl">
      <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
             @click="router.back()"/>
      <span class="text-primary text-h6 text-weight-bold">{{ tc('pages.group.GroupMeteringList.go_back_to_group_list') }}</span>
    </div>
    <div class="row items-center justify-between q-mt-lg">
      <div class="col-8 row">
        <div class="col-6 row items-center">
          <div class="col-5">
            <q-input filled dense v-model="dateFrom" mask="date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="query.date_start" @update:model-value="selectDate"
                            mask="YYYY-MM-DD" :locale="i18n.global.locale === 'en' ? myLocale : ''">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup no-caps :label="tc('pages.personal.HistoryList.confirm')" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="text-center q-ml-md">{{ tc('pages.personal.HistoryList.to') }}</div>
          <div class="col-5 q-ml-md">
            <q-input filled dense v-model="dateTo" mask="date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="query.date_end" @update:model-value="selectDate"
                            mask="YYYY-MM-DD" :locale="i18n.global.locale === 'en' ? myLocale : ''">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup no-caps :label="tc('pages.personal.HistoryList.confirm')" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <q-select class="col-4" outlined dense v-model="serviceId" :options="serviceOptions" @update:model-value="selectService" :label="tc('pages.personal.CurrentMonthList.filter_service')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        <q-btn class="q-ml-md" outline no-caps :label="tc('pages.personal.HistoryList.search')" @click="search"/>
      </div>
      <div>
        <q-btn outline no-caps :label="tc('pages.personal.CurrentMonthList.export_current_page_data')" @click="exportFile"/>
        <q-btn outline no-caps :label="tc('pages.personal.CurrentMonthList.export_all_data')" class="q-ml-sm" @click="exportAll"/>
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
        <span>/{{ tc('pages.personal.CurrentMonthList.page') }}</span>
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
