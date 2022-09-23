<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useStore, PersonalServerMeteringInterface } from 'stores/store'
// import { useRoute } from 'vue-router'
import { i18n } from 'boot/i18n'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { getHistoryStartFormatDate, getNowFormatDate } from 'src/hooks/processTime'
import { exportNotify } from 'src/hooks/ExportNotify'
import ServerUsageTable from 'components/public/ServerUsageTable.vue'
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
const serviceOptions = computed(() => store.getServices('enable'))
const childRef = ref()
const tableRow = ref<PersonalServerMeteringInterface[]>([])
const startDate = getHistoryStartFormatDate()
const currentDate = getNowFormatDate(1)
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
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
const query = ref<Record<string, string | number>>({
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
const getPersonalConsumptionData = async () => {
  childRef.value.startLoading()
  tableRow.value = []
  const data = await store.getServerMetering(query.value)
  for (const elem of data.data.results) {
    tableRow.value.push(elem)
  }
  paginationTable.value.count = data.data.count
  childRef.value.endLoading()
}
const selectDate = () => {
  dateFrom.value = query.value.date_start as string
  dateTo.value = query.value.date_end as string
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
const changePagination = () => {
  query.value.page = paginationTable.value.page
  getPersonalConsumptionData()
}
const changePageSize = () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  getPersonalConsumptionData()
}
const search = () => {
  query.value.page = 1
  paginationTable.value.page = 1
  getPersonalConsumptionData()
}
// 导出当页数据
const exportFile = () => {
  if (tableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    exportExcel(i18n.global.locale === 'zh' ? '个人云主机用量统计-' + date.toLocaleTimeString() + '.xlsx' : ' Personal Servers Statistics-' + date.toLocaleTimeString() + '.xlsx', '#ServerUsageTable')
  }
}
// 导出全部数据
const exportAll = async () => {
  if (tableRow.value.length === 0) {
    exportNotify()
  } else {
    exportQuery.value.date_start = query.value.date_start as string
    exportQuery.value.date_end = query.value.date_end as string
    const date = new Date()
    const fileData = await store.getServerMetering(exportQuery.value)
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '个人云主机用量统计-' + date.toLocaleTimeString() : 'Personal Servers Statistics-' + date.toLocaleTimeString())
  }
}
onMounted(() => {
  getPersonalConsumptionData()
})
</script>

<template>
  <div class="PersonalConsumptionList">
    <div class="row items-center justify-between q-mt-xl">
      <div class="col-8 row items-center q-gutter-x-sm">
        <div class="col-3">
          <q-input filled dense v-model="dateFrom" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="query.date_start" @update:model-value="selectDate" :locale="i18n.global.locale === 'en' ? myLocale : ''" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn no-caps v-close-popup :label="tc('confirm')" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="text-center">{{ tc('to') }}</div>
        <div class="col-3">
          <q-input filled dense v-model="dateTo" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="query.date_end" @update:model-value="selectDate" :locale="i18n.global.locale === 'en' ? myLocale : ''" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn no-caps v-close-popup :label="tc('confirm')" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-select class="col-4" outlined dense v-model="serviceId" :options="serviceOptions" @update:model-value="selectService"
                  :label="tc('filterService')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        <q-btn class="q-py-sm" color="primary" no-caps :label="tc('search')" @click="search"/>
      </div>
      <div class="col-4 row justify-end">
        <q-btn class="q-py-sm" color="primary" no-caps :label="tc('exportCurrentPageData')" @click="exportFile"/>
        <q-btn class="q-ml-sm q-py-sm" color="primary" no-caps :label="tc('exportAllData')" @click="exportAll"/>
      </div>
    </div>
    <div class="q-mt-md">
      <server-usage-table :tableRow="tableRow" ref="childRef"/>
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
</template>

<style lang="scss" scoped>
.PersonalConsumptionList {
}
</style>
