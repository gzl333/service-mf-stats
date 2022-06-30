<script setup lang="ts">
import { onMounted, Ref, ref, computed } from 'vue'
import { useStore } from 'stores/store'
// import { useRoute } from 'vue-router'
// import { navigateToUrl } from 'single-spa'
// import { i18n } from 'boot/i18n'
import ServerUsageTable from 'components/public/ServerUsageTable.vue'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { Notify } from 'quasar'
import { getNowFormatDate } from 'src/hooks/processTime'
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
// const tc = i18n.global.tc
const filterOptions = computed(() => store.getServices)
const tableRow: Ref = ref([])
const startDate = getNowFormatDate(0)
const currentDate = getNowFormatDate(1)
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const serviceId = ref({
  label: '全部服务',
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
const getDetailData = async () => {
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
    exportQuery.value.service_id = val.value
    getDetailData()
  } else {
    delete query.value.service_id
    delete exportQuery.value
    getDetailData()
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
    exportExcel('个人云主机用量统计.xlsx', '#ServerUsageTable')
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
    const fileData = await store.getServerHostFile(exportQuery.value)
    exportAllData(fileData.data, '个人云主机本月用量统计')
  }
}
onMounted(async () => {
  await getDetailData()
})
</script>

<template>
  <div class="CurrentMonthList">
    <div class="row items-center justify-between">
      <div class="col-4 row">
        <q-select outlined dense v-model="serviceId" :options="filterOptions" @update:model-value="selectService" label="筛选服务" class="col-8"/>
      </div>
      <div>
        <q-btn outline label="导出当页数据" class="q-ml-md" @click="exportFile"/>
        <q-btn outline label="导出全部数据" class="q-ml-md" @click="exportAll"/>
      </div>
    </div>
    <server-usage-table :tableRow="tableRow"/>
    <div class="row q-py-md text-grey justify-between items-center">
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
.CurrentMonthList {
}
</style>
