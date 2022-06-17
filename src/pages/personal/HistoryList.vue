<script setup lang="ts">
import { onMounted, Ref, ref, computed } from 'vue'
import { useStore } from 'stores/store'
// import { useRoute } from 'vue-router'
// import { navigateToUrl } from 'single-spa'
// import { i18n } from 'boot/i18n'
import DetailTable from 'components/personal/PersonalServerTable.vue'
import { exportExcel } from 'src/hooks/exportExcel'
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
// const tc = i18n.global.tc
const filterOptions = computed(() => store.getServices)
const tableRow: Ref = ref([])
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const serviceId = ref({
  label: '全部服务',
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
  let obj: Record<string, string> = {}
  const data = await store.getServerHostData(query.value)
  for (const elem of data.data.results) {
    obj = {}
    obj.server_id = elem.server_id
    obj.ipv4 = elem.server.ipv4
    obj.service_name = elem.service_name
    obj.vcpus = elem.server.vcpus
    obj.ram = elem.server.ram
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
    exportExcel('个人云主机用量统计.xlsx', '#personalServerTable')
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
    const link = document.createElement('a')
    const blob = new Blob(['\ufeff' + fileData.data], { type: 'text/csv,charset=UTF-8' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.download = fileData.headers['content-disposition']
    link.download = '个人云主机用量统计'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
onMounted(async () => {
  await getDetailData()
})
</script>

<template>
  <div class="PersonalList">
    <div class="row items-center justify-between">
      <div class="col-9 row items-center q-gutter-x-md">
        <div class="col-3">
          <q-input filled dense v-model="dateFrom" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateFrom" @update:model-value="selectDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="text-center">至</div>
        <div class="col-3">
          <q-input filled dense v-model="dateTo" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateTo" @update:model-value="selectDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-select outlined dense v-model="serviceId" :options="filterOptions" @update:model-value="selectService" label="筛选服务" class="col-3"/>
        <q-btn outline label="搜索" class="q-px-lg" @click="search"/>
      </div>
      <div class="col-3 q-ml-md">
        <q-btn outline label="导出当页数据" @click="exportFile"/>
        <q-btn outline label="导出全部数据" class="q-ml-md" @click="exportAll"/>
      </div>
    </div>
    <detail-table :tableRow="tableRow"/>
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
.PersonalList {
}
</style>
