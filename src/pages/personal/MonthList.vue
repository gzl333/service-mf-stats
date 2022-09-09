<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useStore, PersonalServerMeteringInterface } from 'stores/store'
import { useRoute } from 'vue-router'
import { i18n } from 'boot/i18n'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { getNowFormatDate, getLastFormatDate } from 'src/hooks/processTime'
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
const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const serviceOptions = computed(() => store.getServices)
const tableRow = ref<PersonalServerMeteringInterface[]>([])
const currentMonthStartDate = getNowFormatDate(0)
const currentMonthEndDate = getNowFormatDate(1)
const lastMonthStartDate = getLastFormatDate(0)
const lastMonthEndDate = getLastFormatDate(1)
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
  date_start: route.meta.time === 'current' ? currentMonthStartDate : lastMonthStartDate,
  date_end: route.meta.time === 'current' ? currentMonthEndDate : lastMonthEndDate
})
const exportQuery: Record<string, string | boolean> = {
  date_start: route.meta.time === 'current' ? currentMonthStartDate : lastMonthStartDate,
  date_end: route.meta.time === 'current' ? currentMonthEndDate : lastMonthEndDate,
  download: true
}
const getMonthData = async () => {
  tableRow.value = []
  const data = await store.getServerMetering(query.value)
  for (const elem of data.data.results) {
    tableRow.value.push(elem)
  }
  paginationTable.value.count = data.data.count
}
const selectService = (val: Record<string, string>) => {
  if (val.value !== '') {
    query.value.service_id = val.value
    exportQuery.service_id = val.value
    getMonthData()
  } else {
    delete query.value.service_id
    delete exportQuery.service_id
    getMonthData()
  }
}
const changePagination = async (val: number) => {
  query.value.page = val
  await getMonthData()
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getMonthData()
}
const exportFile = () => {
  if (tableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    exportExcel(i18n.global.locale === 'zh' ? '个人云主机用量统计-' + date.toLocaleTimeString() + '.xlsx' : ' Personal Servers Statistics-' + date.toLocaleTimeString() + '.xlsx', '#ServerUsageTable')
  }
}
const exportAll = async () => {
  if (tableRow.value.length === 0) {
    exportNotify()
  } else {
    const date = new Date()
    const fileData = await store.getServerMetering(exportQuery)
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '个人云主机本月用量统计-' + date.toLocaleTimeString() : 'Personal Servers Statistics In Current Month-' + date.toLocaleTimeString())
  }
}
onBeforeMount(async () => {
  await getMonthData()
})
</script>

<template>
  <div class="MonthList">
    <div class="row items-center justify-between q-mt-xl">
      <div class="col-3">
        <q-select outlined dense v-model="serviceId" :options="serviceOptions" @update:model-value="selectService"
                  :label="tc('筛选服务')" class="col-8" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
      </div>
      <div>
        <q-btn outline no-caps :label="tc('导出当页数据')" @click="exportFile"/>
        <q-btn outline no-caps :label="tc('导出全部数据')" class="q-ml-sm" @click="exportAll"/>
      </div>
    </div>
    <div class="q-mt-md">
      <server-usage-table :tableRow="tableRow"/>
    </div>
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
.MonthList {
}
</style>
