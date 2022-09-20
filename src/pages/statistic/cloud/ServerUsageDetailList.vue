<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useStore, DateInterface, PersonalServerMeteringInterface } from 'stores/store'
import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
import ServerUsageTable from 'components/public/ServerUsageTable.vue'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { exportNotify } from 'src/hooks/ExportNotify'
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
const totalAmount = ref(0)
const actualAmount = ref(0)
const dateStart = ref()
const dateEnd = ref()
const monthOptions = ref<DateInterface[]>([])
const yearOptions = ref<DateInterface[]>([])
const tableRow = ref<PersonalServerMeteringInterface[]>([])
const myDate = new Date()
const year = myDate.getFullYear()
const month = myDate.getMonth() + 1
let currentMonth: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const monthArray = ['January', 'february', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const searchQuery = ref({
  year: {
    label: year,
    value: year
  },
  month: {
    label: '全年',
    labelEn: 'Annual',
    value: 0
  }
})
const getFormatDate = () => {
  const seperator1 = '-'
  if (currentMonth >= 1 && currentMonth <= 9) {
    currentMonth = '0' + currentMonth
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return year + seperator1 + currentMonth + seperator1 + strDate
}
const currentDate = getFormatDate()
const query = ref<Record<string, string | number | boolean>>({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
const exportQuery = ref<Record<string, string | boolean>>({
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true,
  download: true
})
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const changeYear = (val: Record<string, number>) => {
  monthOptions.value = []
  searchQuery.value.month = {
    label: '全年',
    labelEn: 'Annual',
    value: 0
  }
  monthOptions.value.push({
    value: 0,
    label: '全年',
    labelEn: 'Annual'
  })
  if (val.value === year) {
    for (let i = 1; i <= month; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月',
        labelEn: monthArray[i - 1]
      })
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月',
        labelEn: monthArray[i - 1]
      })
    }
  }
}
const initSelectYear = () => {
  monthOptions.value.push({
    value: 0,
    label: '全年',
    labelEn: 'Annual'
  })
  for (let i = 2021; i <= year; i++) {
    yearOptions.value.unshift({
      value: i,
      label: i
    })
  }
  for (let i = 1; i <= month; i++) {
    monthOptions.value.push({
      value: i,
      label: i + '月',
      labelEn: monthArray[i - 1]
    })
  }
}
const initQuery = () => {
  query.value.page = 1
  let dateStart = ''
  let dateEnd = ''
  if (searchQuery.value.year.value === year) {
    if (searchQuery.value.month.value === 0) {
      dateStart = year + '-' + '01-01'
      dateEnd = currentDate
    } else if (searchQuery.value.month.value === month) {
      dateStart = year + '-' + currentMonth + '-' + '01'
      dateEnd = currentDate
    } else {
      const day = new Date(searchQuery.value.year.value, searchQuery.value.month.value, 0).getDate()
      if (searchQuery.value.month.value < 10) {
        dateStart = year + '-' + '0' + searchQuery.value.month.value + '-' + '01'
        dateEnd = year + '-' + '0' + searchQuery.value.month.value + '-' + day
      } else {
        dateStart = year + '-' + searchQuery.value.month.value + '-' + '01'
        dateEnd = year + '-' + searchQuery.value.month.value + '-' + day
      }
    }
  } else {
    if (searchQuery.value.month.value === 0) {
      dateStart = searchQuery.value.year.value + '-' + '01-01'
      dateEnd = searchQuery.value.year.value + '-' + '12-31'
    } else {
      const day = new Date(searchQuery.value.year.value, searchQuery.value.month.value, 0).getDate()
      if (searchQuery.value.month.value < 10) {
        dateStart = searchQuery.value.year.value + '-' + '0' + searchQuery.value.month.value + '-' + '01'
        dateEnd = searchQuery.value.year.value + '-' + '0' + searchQuery.value.month.value + '-' + day
      } else {
        dateStart = searchQuery.value.year.value + '-' + searchQuery.value.month.value + '-' + '01'
        dateEnd = searchQuery.value.year.value + '-' + searchQuery.value.month.value + '-' + day
      }
    }
  }
  query.value.date_start = dateStart
  query.value.date_end = dateEnd
  exportQuery.value.date_start = dateStart
  exportQuery.value.date_end = dateEnd
}
const getDetailData = async () => {
  tableRow.value = []
  totalAmount.value = 0
  actualAmount.value = 0
  if (route.meta.type === 'user') {
    query.value.user_id = route.params.userid as string
    exportQuery.value.user_id = route.params.userid as string
  } else if (route.meta.type === 'group') {
    query.value.vo_id = route.params.groupId as string
    exportQuery.value.vo_id = route.params.groupId as string
  } else if (route.meta.type === 'service') {
    query.value.service_id = route.params.serviceId as string
    exportQuery.value.service_id = route.params.serviceId as string
  }
  const data = await store.getServerMetering(query.value)
  for (const elem of data.data.results) {
    tableRow.value.push(elem)
  }
  paginationTable.value.count = data.data.count
  dateStart.value = query.value.date_start
  dateEnd.value = query.value.date_end
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
  initQuery()
  await getDetailData()
}
const exportFile = () => {
  if (tableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    exportExcel(i18n.global.locale === 'zh' ? '云主机用量统计-' + date.toLocaleTimeString() + '.xlsx' : 'Servers Usage Statistics-' + date.toLocaleTimeString() + '.xlsx', '#ServerUsageTable')
  }
}
const exportAll = async () => {
  if (tableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    const fileData = await store.getServerMetering(exportQuery.value)
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '云主机用量统计' + date.toLocaleTimeString() : 'Servers Usage Statistics' + date.toLocaleTimeString())
  }
}
onBeforeMount(async () => {
  initSelectYear()
  await getDetailData()
})
</script>

<template>
  <div class="ServerUsageDetailList">
    <div class="row items-center title-area q-mt-xl">
      <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
             @click="router.back()"/>
      <span class="text-primary text-h6 text-weight-bold">{{ tc('pages.public.ServerUsageDetailList.servers_usage_details') }}</span>
    </div>
    <div class="row q-mt-lg justify-between">
      <div class="row col-5 items-center">
        <div class="col-3">
          <q-select outlined dense v-model="searchQuery.year" :options="yearOptions" :label="tc('pages.public.ServerUsageDetailList.please_select')" @update:model-value="changeYear"/>
        </div>
        <div class="col-3 q-ml-sm">
          <q-select outlined dense v-model="searchQuery.month" :options="monthOptions" :label="tc('pages.public.ServerUsageDetailList.please_select')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        </div>
        <div class="q-ml-sm">
          <q-btn outline no-caps :label="tc('pages.personal.HistoryList.search')" @click="search" class="q-px-lg"/>
        </div>
      </div>
      <div>
        <q-btn outline no-caps :label="tc('pages.personal.CurrentMonthList.export_current_page_data')" @click="exportFile"/>
        <q-btn outline no-caps :label="tc('pages.personal.CurrentMonthList.export_all_data')" class="q-ml-sm" @click="exportAll"/>
      </div>
    </div>
    <div class="row q-mt-md text-subtitle1 text-bold">
      <div>
        {{ route.meta.type === 'user' ? tc('pages.statistic.cloud.ServerUsageDetailList.user') + '：' : route.meta.type === 'group' ? tc('pages.statistic.cloud.ServerUsageDetailList.group') + '：' : tc('pages.statistic.cloud.ServerUsageDetailList.service') + '：' }}{{ route.query.name }}
      </div>
      <div class="q-ml-xl">{{ tc('pages.statistic.cloud.GroupAggregationList.total_number_of_servers') }}：{{ route.query.count }}</div>
      <div class="q-ml-xl">{{ tc('pages.statistic.cloud.ServerUsageDetailList.billing_cycle') }}：{{ dateStart }}-{{ dateEnd }}</div>
<!--      <div class="col-3">{{ tc('components.public.ServerStatisticsDetailTable.total_billing_amount') }}：{{ totalAmount.toFixed(2) }} {{ tc('components.public.ServerStatisticsDetailTable.points') }}</div>-->
<!--      <div class="col-3">{{ tc('components.public.ServerStatisticsDetailTable.total_amount_of_actual_deduction') }}：{{ actualAmount.toFixed(2) }} {{ tc('components.public.ServerStatisticsDetailTable.points') }}</div>-->
    </div>
    <div class="q-mt-md">
    <server-usage-table :table-row="tableRow"/>
    </div>
    <div class="row q-mt-lg text-grey justify-between items-center">
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
.ServerUsageDetailList {
  .button-area {
    background-color: $primary;
    color: $dark;
  }
}
</style>
