<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MeteringDetailInterface, DateInterface } from 'stores/store'
import { useRoute, useRouter } from 'vue-router'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { exportNotify } from 'src/hooks/ExportNotify'
import { i18n } from 'boot/i18n'
import stats from 'src/api'
import ServerCard from 'components/public/ServerCard.vue'
import ServerStatisticsDetailTable from 'components/public/ServerStatisticsDetailTable.vue'

// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

// const store = useStore()
const route = useRoute()
const router = useRouter()
const { tc } = i18n.global
const monthOptions = ref<DateInterface[]>([])
const yearOptions = ref<DateInterface[]>([])
const statisticsTableRow = ref<MeteringDetailInterface[]>([])
const title = ref('')
const isLoading = ref(false)
const myDate = new Date()
const year = myDate.getFullYear()
const month = myDate.getMonth() + 1
let currentMonth: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const cardObj = ref({
  ipv4: '',
  name: '',
  serverId: '',
  service: '',
  ram: '',
  vcpus: ''
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
const searchQuery = ref<Record<string, string | number | boolean>>({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  server_id: '',
  'as-admin': true
})
const dateQuery = ref({
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
const exportQuery = ref<Record<string, string | boolean>>({
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  server_id: '',
  'as-admin': true,
  download: true
})
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const monthArray = ['January', 'february', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const changeYear = (val: Record<string, number>) => {
  monthOptions.value = []
  dateQuery.value.month = {
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
const getConsumptionDetailData = async () => {
  isLoading.value = true
  statisticsTableRow.value = []
  searchQuery.value.server_id = route.params.serverId as string
  exportQuery.value.server_id = route.params.serverId as string
  const respMeteringDetail = await stats.stats.metering.getMeteringServer({ query: searchQuery.value })
  for (const elem of respMeteringDetail.data.results) {
    statisticsTableRow.value.push(elem)
  }
  paginationTable.value.count = respMeteringDetail.data.count
  isLoading.value = false
}
const initQuery = () => {
  searchQuery.value.page = 1
  let dateStart = ''
  let dateEnd = ''
  if (dateQuery.value.year.value === year) {
    if (dateQuery.value.month.value === 0) {
      dateStart = year + '-' + '01-01'
      dateEnd = currentDate
    } else if (dateQuery.value.month.value === month) {
      dateStart = year + '-' + currentMonth + '-' + '01'
      dateEnd = currentDate
    } else {
      const day = new Date(dateQuery.value.year.value, dateQuery.value.month.value, 0).getDate()
      if (dateQuery.value.month.value < 10) {
        dateStart = year + '-' + '0' + dateQuery.value.month.value + '-' + '01'
        dateEnd = year + '-' + '0' + dateQuery.value.month.value + '-' + day
      } else {
        dateStart = year + '-' + dateQuery.value.month.value + '-' + '01'
        dateEnd = year + '-' + dateQuery.value.month.value + '-' + day
      }
    }
  } else {
    if (dateQuery.value.month.value === 0) {
      dateStart = dateQuery.value.year.value + '-' + '01-01'
      dateEnd = dateQuery.value.year.value + '-' + '12-31'
    } else {
      const day = new Date(dateQuery.value.year.value, dateQuery.value.month.value, 0).getDate()
      if (dateQuery.value.month.value < 10) {
        dateStart = dateQuery.value.year.value + '-' + '0' + dateQuery.value.month.value + '-' + '01'
        dateEnd = dateQuery.value.year.value + '-' + '0' + dateQuery.value.month.value + '-' + day
      } else {
        dateStart = dateQuery.value.year.value + '-' + dateQuery.value.month.value + '-' + '01'
        dateEnd = dateQuery.value.year.value + '-' + dateQuery.value.month.value + '-' + day
      }
    }
  }
  searchQuery.value.date_start = dateStart
  searchQuery.value.date_end = dateEnd
  exportQuery.value.date_start = dateStart
  exportQuery.value.date_end = dateEnd
}
const changePageSize = () => {
  searchQuery.value.page_size = paginationTable.value.rowsPerPage
  searchQuery.value.page = 1
  paginationTable.value.page = 1
  getConsumptionDetailData()
}
const changePagination = () => {
  searchQuery.value.page = paginationTable.value.page
  getConsumptionDetailData()
}
const search = () => {
  initQuery()
  paginationTable.value.page = 1
  getConsumptionDetailData()
}
const exportFile = () => {
  if (statisticsTableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    exportExcel(i18n.global.locale === 'zh' ? '云主机用量统计-' + date.toLocaleTimeString() + '.xlsx' : 'Servers Usage Statistics-' + date.toLocaleTimeString() + '.xlsx', '#serverTable')
  }
}
const exportAll = async () => {
  if (statisticsTableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    const fileData = await stats.stats.metering.getMeteringServer({ query: exportQuery.value })
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '云主机用量统计-' + date.toLocaleTimeString() : 'Servers Usage Statistics-' + date.toLocaleTimeString())
  }
}
onMounted(async () => {
  initSelectYear()
  await getConsumptionDetailData()
  cardObj.value.serverId = route.params.serverId as string
  cardObj.value.service = statisticsTableRow.value[0].service_id
  cardObj.value.vcpus = route.query.vcpus as string
  cardObj.value.ram = route.query.ram as string
  cardObj.value.ipv4 = route.query.ipv4 as string
  if (statisticsTableRow.value[0].username === '') {
    cardObj.value.name = statisticsTableRow.value[0].vo_name
    title.value = 'group'
  } else {
    cardObj.value.name = statisticsTableRow.value[0].username
    title.value = 'user'
  }
})
</script>

<template>
  <div class="ServerStatisticsDetailList">
    <div class="row items-center title-area q-mt-xl">
      <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
             @click="router.back()"/>
      <span class="text-primary text-h6 text-weight-bold">{{ tc('serversUsageDetails') }}</span>
    </div>
    <div class="row q-mt-lg justify-between">
      <div class="row col-5 items-center">
        <div class="col-3">
          <q-select outlined dense v-model="dateQuery.year" :options="yearOptions" :label="tc('pleaseSelect')"
                    @update:model-value="changeYear"/>
        </div>
        <div class="col-3 q-ml-sm">
          <q-select outlined dense v-model="dateQuery.month" :options="monthOptions" :label="tc('pleaseSelect')"
                    :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        </div>
        <div class="q-ml-sm">
          <q-btn class="q-py-sm q-px-lg" color="primary" no-caps :label="tc('search')" @click="search"/>
        </div>
      </div>
      <div>
        <q-btn class="q-py-sm" color="primary" no-caps :label="tc('exportCurrentPageData')" @click="exportFile"/>
        <q-btn class="q-py-sm q-ml-sm" color="primary" no-caps :label="tc('exportAllData')" @click="exportAll"/>
      </div>
    </div>
    <div class="q-mt-md">
      <server-card :cardObj="cardObj" :title="title"/>
    </div>
    <div class="q-mt-md">
      <server-statistics-detail-table :tableRow="statisticsTableRow" :isLoading="isLoading"/>
    </div>
    <div class="row text-grey justify-between items-center q-mt-md">
      <div class="row items-center">
        <span class="q-pr-md" v-if="i18n.global.locale === 'zh'">共{{ paginationTable.count }}条数据</span>
        <span class="q-pr-md" v-else>{{ paginationTable.count }} pieces of data in total</span>
        <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense options-dense
                  borderless @update:model-value="changePageSize">
        </q-select>
        <span>/{{ tc('page') }}</span>
      </div>
      <q-pagination
        v-model="paginationTable.page"
        :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
        :max-pages="9"
        direction-links
        outline
        :ripple="false"
        @click="changePagination"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ServerStatisticsDetailList {
  .button-area {
    background-color: $primary;
    color: $dark;
  }
}
</style>
