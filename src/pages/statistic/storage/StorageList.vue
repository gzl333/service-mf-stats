<script setup lang="ts">
import { computed, ref, onBeforeMount, Ref } from 'vue'
import { DateInterface, useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { navigateToUrl } from 'single-spa'
import { getNowFormatDate } from 'src/hooks/processTime'
import { exportNotify } from 'src/hooks/ExportNotify'
import { exportAllData, exportExcel } from 'src/hooks/exportExcel'
import { i18n } from 'boot/i18n'
import stats from 'src/api/index'
import StorageTable from 'components/statistic/StorageTable'

// const props = defineProps({
// })
// const emits = defineEmits(['change', 'delete'])
interface QueryInterface {
  page: number
  page_size: number
  date_start: string
  date_end: string
  service_id?: string
  bucket_id?: string
  user_id?: string
  'as-admin': boolean
  download?: boolean
}
const store = useStore()
// const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const serviceOptions = computed(() => store.getAllStorageServiceOptions)
const yearOptions = ref<DateInterface[]>([])
const monthOptions = ref<DateInterface[]>([])
const storageTableRow = ref([])
const userId = ref('')
const bucketId = ref('')
const isLoading = ref(false)
const myDate = new Date()
const year = myDate.getFullYear()
// 该变量用于作比较判断
const month = myDate.getMonth() + 1
const currentDate = getNowFormatDate(1)
const searchQuery: Ref<QueryInterface> = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
const serviceId = ref({
  label: '全部服务单元',
  labelEn: 'All Services Units',
  value: ''
})
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
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
const monthArray = ['January', 'february', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// 初始化年份
const initSelectYear = () => {
  // 默认添加全年
  monthOptions.value.push({
    value: 0,
    label: '全年',
    labelEn: 'Annual'
  })
  // 从2021年开始 2021年之前不再添加
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
const changeYear = (val: Record<string, number>) => {
  monthOptions.value = []
  // 切换年份 月份默认选择全年
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
    // 如果选择的是本年 月份添加到当月
    for (let i = 1; i <= month; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月',
        labelEn: monthArray[i - 1]
      })
    }
  } else {
    // 如果选择的不是本年 月份添加12个月
    for (let i = 1; i <= 12; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月',
        labelEn: monthArray[i - 1]
      })
    }
  }
}
const getStorageMetering = () => {
  isLoading.value = true
  stats.stats.metering.getMeteringStorage({ query: searchQuery.value }).then((res) => {
    storageTableRow.value = res.data.results
    paginationTable.value.count = res.data.count
    isLoading.value = false
  })
}
// 初始化参数
const initQuery = () => {
  searchQuery.value.page = 1
  let dateStart = ''
  let dateEnd = ''
  // 如果是当年
  if (dateQuery.value.year.value === year) {
    // 如果是全年 当年一月到本月
    if (dateQuery.value.month.value === 0) {
      dateStart = year + '-' + '01-01'
      dateEnd = currentDate
    } else if (dateQuery.value.month.value === month) {
      // 如果不是全年 选择的是当月 日期为当月1号至当前日期
      dateStart = year + '-' + month + '-' + '01'
      dateEnd = currentDate
    } else {
      // 如果选择的不是全年 不是当月 日期为选择的月份整月
      // 判断选择的月份有几天
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
    // 如果不是当年
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
}
const search = () => {
  initQuery()
  if (serviceId.value.value !== '') {
    searchQuery.value.service_id = serviceId.value.value
  } else {
    delete searchQuery.value.service_id
  }
  if (bucketId.value !== '' && bucketId.value !== null) {
    searchQuery.value.bucket_id = bucketId.value
  } else {
    delete searchQuery.value.bucket_id
  }
  if (userId.value !== '' && userId.value !== null) {
    searchQuery.value.user_id = userId.value
  } else {
    delete searchQuery.value.user_id
  }
  getStorageMetering()
}
const changePageSize = () => {
  searchQuery.value.page_size = paginationTable.value.rowsPerPage
  searchQuery.value.page = 1
  paginationTable.value.page = 1
  getStorageMetering()
}
const changePagination = () => {
  searchQuery.value.page = paginationTable.value.page
  getStorageMetering()
}
// 导出当页数据
const exportFile = () => {
  if (storageTableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    exportExcel(i18n.global.locale === 'zh' ? '对象存储用量统计-' + date.toLocaleTimeString() + '.xlsx' : 'Storage Usage Statistics-' + date.toLocaleTimeString() + '.xlsx', '#StorageMeteringTable')
  }
}
// 导出全部数据
const exportAll = async () => {
  if (storageTableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    stats.stats.metering.getMeteringStorage({ query: { 'as-admin': true, download: true } }).then((res) => {
      exportAllData(res.data, i18n.global.locale === 'zh' ? '对象存储用量统计' + date.toLocaleTimeString() : 'Storage Usage Statistics' + date.toLocaleTimeString())
    })
  }
}
onBeforeMount(async () => {
  await initSelectYear()
  await getStorageMetering()
})
</script>

<template>
  <div class="StorageList">
    <div class="row q-mt-xl justify-between items-center">
      <div class="row col-9 items-center">
          <q-select style="width: 100px" outlined dense v-model="dateQuery.year" :options="yearOptions" :label="tc('pleaseSelect')" @update:model-value="changeYear" />
          <q-select style="width: 100px" class="q-ml-sm" outlined dense v-model="dateQuery.month" :options="monthOptions" :label="tc('pleaseSelect')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
          <q-select style="width: 200px" class="q-ml-sm" outlined dense v-model="serviceId" :options="serviceOptions" :label="tc('filterService')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
          <q-input style="width: 200px" class="q-ml-sm" outlined dense clearable v-model="bucketId" :label="tc('bucketId')" />
          <q-input style="width: 200px" class="q-ml-sm" outlined dense clearable v-model="userId" :label="tc('userId')" />
          <q-btn color="primary" class="q-ml-sm q-py-sm" no-caps :label="tc('search')" @click="search"/>
      </div>
      <div class="row justify-end">
        <q-btn class="q-py-sm" color="primary" no-caps :label="tc('exportCurrentPageData')" @click="exportFile()"/>
        <q-btn class="q-ml-xs" color="primary" no-caps :label="tc('exportAllData')" @click="exportAll"/>
      </div>
    </div>
    <div class="q-mt-md">
      <storage-table :storageTableRow="storageTableRow" :isLoading="isLoading"/>
    </div>
<!--    <div class="row text-grey justify-between items-center q-mt-md">-->
<!--      <div class="row items-center">-->
<!--        <span class="q-pr-md" v-if="i18n.global.locale === 'zh'">共{{ paginationTable.count }}条数据</span>-->
<!--        <span class="q-pr-md" v-else>{{ paginationTable.count }} pieces of data in total</span>-->
<!--        <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense options-dense-->
<!--                  borderless @update:model-value="changePageSize">-->
<!--        </q-select>-->
<!--        <span>/{{ tc('page') }}</span>-->
<!--      </div>-->
<!--      <q-pagination-->
<!--        v-model="paginationTable.page"-->
<!--        :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"-->
<!--        :max-pages="9"-->
<!--        direction-links-->
<!--        outline-->
<!--        :ripple="false"-->
<!--        @click="changePagination"-->
<!--      />-->
<!--    </div>-->
    <div class="row q-py-md text-grey justify-between items-center">
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
.StorageList {
}
</style>
