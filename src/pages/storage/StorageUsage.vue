<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { useStore, PersonalServerMeteringInterface } from 'stores/store'
// import { useRoute } from 'vue-router'
import { getHistoryStartFormatDate, getNowFormatDate } from 'src/hooks/processTime'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { exportNotify } from 'src/hooks/ExportNotify'
import { i18n } from 'boot/i18n'
import stats from 'src/api'
import StorageTable from 'components/statistic/StorageTable.vue'

// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])
interface QueryInterface {
  page: number
  page_size: number
  date_start: string
  date_end: string
  service_id?: string
  bucket_id?: string
  download?: boolean
}

const store = useStore()
// const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const serviceOptions = computed(() => store.getAllStorageServiceOptions)
const storageTableRow = ref<PersonalServerMeteringInterface[]>([])
const startDate = getHistoryStartFormatDate()
const currentDate = getNowFormatDate(1)
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
const bucketId = ref('')
const isLoading = ref(false)
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const serviceId = ref({
  label: '全部服务单元',
  labelEn: 'All Service Units',
  value: ''
})
const searchQuery = ref<QueryInterface>({
  page: 1,
  page_size: 10,
  date_start: startDate,
  date_end: currentDate
})
const exportQuery = ref<Record<string, string | boolean>>({
  date_start: startDate,
  date_end: currentDate,
  download: true
})
const myLocale = {
  days: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  daysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  firstDayOfWeek: 1,
  format24h: true,
  pluralDay: 'dias'
}
const getStorageMetering = async () => {
  isLoading.value = true
  const resMeteringStorage = await stats.stats.metering.getMeteringStorage({ query: searchQuery.value })
  storageTableRow.value = resMeteringStorage.data.results
  paginationTable.value.count = resMeteringStorage.data.count
  isLoading.value = false
}

const selectDate = () => {
  dateFrom.value = searchQuery.value.date_start as string
  dateTo.value = searchQuery.value.date_end as string
}
const selectService = (val: Record<string, string>) => {
  if (val.value !== '') {
    searchQuery.value.service_id = val.value
    exportQuery.value.service_id = val.value
  } else {
    delete searchQuery.value.service_id
    delete exportQuery.value.service_id
  }
}
const changePagination = () => {
  searchQuery.value.page = paginationTable.value.page
  getStorageMetering()
}
const changePageSize = () => {
  searchQuery.value.page_size = paginationTable.value.rowsPerPage
  searchQuery.value.page = 1
  paginationTable.value.page = 1
  getStorageMetering()
}
const search = () => {
  searchQuery.value.page = 1
  paginationTable.value.page = 1
  if (bucketId.value !== '' && bucketId.value !== null) {
    searchQuery.value.bucket_id = bucketId.value
  } else {
    delete searchQuery.value.bucket_id
  }
  getStorageMetering()
}
// 导出当页数据
const exportFile = () => {
  if (storageTableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    exportExcel(i18n.global.locale === 'zh' ? '对象存储用量统计-' + date.toLocaleTimeString() + '.xlsx' : ' Storage Usage Statistics-' + date.toLocaleTimeString() + '.xlsx', '#StorageMeteringTable')
  }
}
// 导出全部数据
const exportAll = async () => {
  if (storageTableRow.value.length === 0) {
    exportNotify()
  } else {
    exportQuery.value.date_start = searchQuery.value.date_start as string
    exportQuery.value.date_end = searchQuery.value.date_end as string
    const date = new Date()
    stats.stats.metering.getMeteringStorage({ query: exportQuery.value }).then((res) => {
      exportAllData(res.data, i18n.global.locale === 'zh' ? '对象存储用量统计' + date.toLocaleTimeString() : 'Storage Usage Statistics' + date.toLocaleTimeString())
    })
  }
}
onBeforeMount(() => {
  getStorageMetering()
})
</script>

<template>
  <div class="ConsumptionIndex">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-py-lg q-px-none">{{ tc('对象存储用量') }}</div>
        </div>
      </div>

      <q-separator/>

      <div class="row justify-center">

        <!--        <router-view class="content-fixed-width" :key="$route.fullPath"/>-->

        <div class="content-fixed-width">

          <div class="q-mt-xl row justify-between items-center">
            <q-input filled dense v-model="dateFrom" mask="date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="searchQuery.date_start" @update:model-value="selectDate"
                            :locale="i18n.global.locale === 'en' ? myLocale : ''" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn no-caps v-close-popup :label="tc('confirm')" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <div class="text-center">{{ tc('to') }}</div>
            <q-input filled dense v-model="dateTo" mask="date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="searchQuery.date_end" @update:model-value="selectDate"
                            :locale="i18n.global.locale === 'en' ? myLocale : ''" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn no-caps v-close-popup :label="tc('confirm')" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select class="col-2" outlined dense v-model="serviceId" :options="serviceOptions"
                      @update:model-value="selectService"
                      :label="tc('filterService')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
            <q-input class="col-2" outlined dense clearable v-model="bucketId" :label="tc('bucketId')"/>
            <q-btn color="primary" no-caps unelevated :label="tc('search')" @click="search"/>
            <q-btn color="primary" no-caps unelevated :label="tc('exportCurrentPageData')" @click="exportFile"/>
            <q-btn color="primary" no-caps unelevated :label="tc('exportAllData')" @click="exportAll"/>
          </div>
          <!--    <div class="q-mt-xl row items-center justify-between">-->
          <!--      <div class="col-8">-->
          <!--        <div class="row items-center q-gutter-x-md">-->
          <!--          <q-select class="col-4" outlined dense v-model="serviceId" :options="serviceOptions"-->
          <!--                    @update:model-value="selectService"-->
          <!--                    :label="tc('filterService')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>-->
          <!--          <q-input class="col-4" outlined dense v-model="bucketId" label="输入桶Id"/>-->
          <!--        </div>-->
          <!--        <div class="row q-mt-md items-center">-->
          <!--          <q-input class="col-4" filled dense v-model="dateFrom" mask="date">-->
          <!--            <template v-slot:append>-->
          <!--              <q-icon name="event" class="cursor-pointer">-->
          <!--                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">-->
          <!--                  <q-date minimal v-model="searchQuery.date_start" @update:model-value="selectDate"-->
          <!--                          :locale="i18n.global.locale === 'en' ? myLocale : ''" mask="YYYY-MM-DD">-->
          <!--                    <div class="row items-center justify-end">-->
          <!--                      <q-btn no-caps v-close-popup :label="tc('confirm')" color="primary" flat/>-->
          <!--                    </div>-->
          <!--                  </q-date>-->
          <!--                </q-popup-proxy>-->
          <!--              </q-icon>-->
          <!--            </template>-->
          <!--          </q-input>-->
          <!--          <div class="text-center q-ml-xs">{{ tc('to') }}</div>-->
          <!--          <q-input class="col-4 q-ml-xs" filled dense v-model="dateTo" mask="date">-->
          <!--            <template v-slot:append>-->
          <!--              <q-icon name="event" class="cursor-pointer">-->
          <!--                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">-->
          <!--                  <q-date minimal v-model="searchQuery.date_end" @update:model-value="selectDate"-->
          <!--                          :locale="i18n.global.locale === 'en' ? myLocale : ''" mask="YYYY-MM-DD">-->
          <!--                    <div class="row items-center justify-end">-->
          <!--                      <q-btn no-caps v-close-popup :label="tc('confirm')" color="primary" flat/>-->
          <!--                    </div>-->
          <!--                  </q-date>-->
          <!--                </q-popup-proxy>-->
          <!--              </q-icon>-->
          <!--            </template>-->
          <!--          </q-input>-->
          <!--        </div>-->
          <!--      </div>-->
          <!--      <div>-->
          <!--        <q-btn class="q-mr-sm" color="primary" no-caps :label="tc('search')" @click="search"/>-->
          <!--        <q-btn class="q-mr-sm" color="primary" no-caps :label="tc('exportCurrentPageData')" @click="exportFile"/>-->
          <!--        <q-btn color="primary" no-caps :label="tc('exportAllData')" @click="exportAll"/>-->
          <!--      </div>-->
          <!--    </div>-->
          <div class="q-mt-md">
            <storage-table :is-loading="isLoading" :storage-table-row="storageTableRow"/>
          </div>
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

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ConsumptionIndex {
}
</style>
