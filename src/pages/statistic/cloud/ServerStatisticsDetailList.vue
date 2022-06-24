<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import { useRoute, useRouter } from 'vue-router'
import ServerStatisticsDetailTable from 'components/statistic/ServerStatisticsDetailTable.vue'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
// import { getNowFormatDate } from 'src/hooks/processTime'
import { Notify } from 'quasar'
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
const route = useRoute()
const router = useRouter()
// const tc = i18n.global.tc
const monthOptions: Ref = ref([])
const yearOptions: Ref = ref([])
const tableRow: Ref = ref([])
const myDate = new Date()
const year = myDate.getFullYear()
const month = myDate.getMonth() + 1
let currentMonth: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
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
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  server_id: '',
  'as-admin': true
})
const exportQuery: Ref = ref({
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
const searchQuery = ref({
  year: {
    label: year,
    value: year
  },
  month: {
    label: '全年',
    value: 0
  }
})
const changeYear = (val: Record<string, number>) => {
  monthOptions.value = []
  searchQuery.value.month = {
    label: '全年',
    value: 0
  }
  monthOptions.value.push({
    value: 0,
    label: '全年'
  })
  if (val.value === year) {
    for (let i = 1; i <= month; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月'
      })
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月'
      })
    }
  }
}
const initSelectYear = () => {
  monthOptions.value.push({
    value: 0,
    label: '全年'
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
      label: i + '月'
    })
  }
}
const getDetailData = async () => {
  tableRow.value = []
  query.value.server_id = route.params.serverId
  exportQuery.value.server_id = route.params.serverId
  const data = await store.getMeteringDetail(query.value)
  for (const elem of data.data.results) {
    tableRow.value.push(elem)
  }
  paginationTable.value.count = data.data.count
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
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getDetailData()
}
const changePagination = async (val: number) => {
  query.value.page = val
  await getDetailData()
}
const search = async () => {
  initQuery()
  await getDetailData()
}
const exportFile = () => {
  if (tableRow.value.length === 0) {
    Notify.create({
      classes: 'notification-negative shadow-15',
      icon: 'mdi-alert',
      textColor: 'negative',
      message: '暂无数据',
      position: 'bottom',
      closeBtn: true,
      timeout: 5000,
      multiLine: false
    })
  } else {
    exportExcel('云主机用量统计.xlsx', '#serverTable')
  }
}
const exportAll = async () => {
  if (tableRow.value.length === 0) {
    Notify.create({
      classes: 'notification-negative shadow-15',
      icon: 'mdi-alert',
      textColor: 'negative',
      message: '暂无数据',
      position: 'bottom',
      closeBtn: true,
      timeout: 5000,
      multiLine: false
    })
  } else {
    const fileData = await store.getServerDetailFile(exportQuery.value)
    exportAllData(fileData.data, '云主机用量统计')
  }
}
onMounted(() => {
  initSelectYear()
  getDetailData()
})
</script>

<template>
  <div class="ServerStatisticsDetailList">
    <div class="row items-center title-area q-mt-xl">
      <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
             @click="router.back()"/>
      <span class="text-primary text-h6 text-weight-bold">云主机用量统计</span>
    </div>
    <div class="row q-mt-lg justify-between">
      <div class="row col-5 items-center">
        <div class="col-3">
          <q-select outlined dense v-model="searchQuery.year" :options="yearOptions" label="请选择" @update:model-value="changeYear"/>
        </div>
        <div class="col-3 q-ml-md">
          <q-select outlined dense v-model="searchQuery.month" :options="monthOptions" label="请选择"/>
        </div>
        <div class="q-ml-md">
          <q-btn outline label="搜索" @click="search" class="q-px-lg"/>
        </div>
      </div>
      <div>
        <q-btn outline label="导出当页数据" class="q-ml-md" @click="exportFile"/>
        <q-btn outline label="导出全部数据" class="q-ml-md" @click="exportAll"/>
      </div>
    </div>
    <div class="q-mt-xl">
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="row">
            <div class="col-3 text-center">
              <div class="text-subtitle1 text-weight-bold">UUID</div>
              <q-separator/>
              <div class="q-mt-xl">{{ route.params.serverId }}</div>
            </div>
            <div class="col-3 text-center">
              <div class="text-subtitle1 text-weight-bold">服务节点</div>
              <q-separator/>
              <div class="text-subtitle1 q-mt-xl">{{ route.query.service }}</div>
            </div>
            <div class="col-3 text-center">
              <div class="text-subtitle1 text-weight-bold">用户</div>
              <q-separator/>
              <div class="text-subtitle1 q-mt-xl">{{ tableRow[0]?.username }}</div>
            </div>
            <div class="col-3 text-center">
              <div class="text-subtitle1 text-weight-bold">初始配置</div>
              <q-separator/>
              <div class="text-subtitle1 q-mt-md">{{ route.query.vcpus }}核</div>
              <div class="text-subtitle1">{{ route.query.ram / 1024 }}GB内存</div>
              <div class="text-subtitle1">公网ip：{{ route.query.ipv4 }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <server-statistics-detail-table :tableRow="tableRow"/>
    <div class="row text-grey justify-between items-center q-mt-md">
      <div class="row items-center">
        <span class="q-pr-md">共{{ paginationTable.count }}条数据</span>
        <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense options-dense
                  borderless @update:model-value="changePageSize">
        </q-select>
        <span>/页</span>
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
.ServerStatisticsDetailList {
  .button-area {
    background-color: $primary;
    color: $dark;
  }
}
</style>
