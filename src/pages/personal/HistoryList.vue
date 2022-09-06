<script setup lang="ts">
import { onMounted, Ref, ref, computed } from 'vue'
import { useStore } from 'stores/store'
// import { useRoute } from 'vue-router'
// import { navigateToUrl } from 'single-spa'
import { i18n } from 'boot/i18n'
import ServerUsageTable from 'components/public/ServerUsageTable.vue'
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
const tableRow: Ref = ref([])
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const serviceId = ref({
  label: '全部服务',
  labelEn: 'All Servers',
  value: ''
})
const startDate = getHistoryStartFormatDate()
const currentDate = getNowFormatDate(1)
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
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
const getDetailData = async () => {
  tableRow.value = []
  const data = await store.getServerMetering(query.value)
  for (const elem of data.data.results) {
    tableRow.value.push(elem)
  }
  paginationTable.value.count = data.data.count
}
const selectDate = () => {
  query.value.date_start = dateFrom.value.replace(/(\/)/g, '-')
  query.value.date_end = dateTo.value.replace(/(\/)/g, '-')
  exportQuery.value.date_start = dateFrom.value.replace(/(\/)/g, '-')
  exportQuery.value.date_end = dateTo.value.replace(/(\/)/g, '-')
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
  await getDetailData()
}
// 导出当页数据
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
    exportExcel(i18n.global.locale === 'zh' ? '个人云主机用量统计.xlsx' : ' Personal Servers Statistics.xlsx', '#ServerUsageTable')
  }
}
// 导出全部数据
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
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '个人云主机历史用量统计' : 'Historical Usage Statistics Of Personal Servers')
  }
}
onMounted(async () => {
  await getDetailData()
})
</script>

<template>
  <div class="PersonalList">
    <div class="row items-center justify-between">
      <div class="col-8 row items-center q-gutter-x-md">
        <div class="col-3">
          <q-input filled dense v-model="dateFrom" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateFrom" @update:model-value="selectDate">
                    <div class="row items-center justify-end">
                      <q-btn no-caps v-close-popup :label="tc('确定')" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="text-center">{{ tc('至') }}</div>
        <div class="col-3">
          <q-input filled dense v-model="dateTo" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateTo" @update:model-value="selectDate">
                    <div class="row items-center justify-end">
                      <q-btn no-caps v-close-popup :label="tc('确定')" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-select outlined dense v-model="serviceId" :options="filterOptions" @update:model-value="selectService"
                  :label="tc('筛选服务')" class="col-3" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        <q-btn outline no-caps :label="tc('搜索')" class="q-px-lg" @click="search"/>
      </div>
      <div class="col-4 row justify-end">
        <q-btn outline no-caps :label="tc('导出当页数据')" @click="exportFile"/>
        <q-btn outline no-caps :label="tc('导出全部数据')" class="q-ml-md" @click="exportAll"/>
      </div>
    </div>
    <server-usage-table :tableRow="tableRow"/>
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
.PersonalList {
}
</style>
