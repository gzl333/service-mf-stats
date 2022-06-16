<script setup lang="ts">
import { onMounted, Ref, ref, computed } from 'vue'
import { useStore } from 'stores/store'
// import { useRoute } from 'vue-router'
// import { navigateToUrl } from 'single-spa'
// import { i18n } from 'boot/i18n'
import DetailTable from 'components/personal/PersonalServerTable.vue'
import { exportExcel } from 'src/hooks/exportExcel'
import { Notify } from 'quasar'
import { getNowFormatDate, getLastFormatDate } from 'src/hooks/processTime'
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
const dateFrom = ref('')
const dateTo = ref('')
const isLastMonth = ref(false)
const isCurrentMonth = ref(true)
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
const startDate = getNowFormatDate(0)
const currentDate = getNowFormatDate(1)
const startLastDate = getLastFormatDate(0)
const currentLastDate = getLastFormatDate(1)
const dateStart = ref('')
const dateEnd = ref('')
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
  dateStart.value = query.value.date_start
  dateEnd.value = query.value.date_end
}
const changeMonth = async (type: number) => {
  if (type === 0) {
    isLastMonth.value = false
    isCurrentMonth.value = true
    query.value.date_start = startDate
    query.value.date_end = currentDate
    exportQuery.value.date_start = startDate
    exportQuery.value.date_end = currentDate
    await getDetailData()
  } else {
    isCurrentMonth.value = false
    isLastMonth.value = true
    query.value.date_start = startLastDate
    query.value.date_end = currentLastDate
    exportQuery.value.date_start = startLastDate
    exportQuery.value.date_end = currentLastDate
    await getDetailData()
  }
  console.log(query.value)
  console.log(exportQuery.value)
  dateFrom.value = ''
  dateTo.value = ''
}
const selectDate = () => {
  const dateStart = dateFrom.value.replace(/(\/)/g, '-')
  const dateEnd = dateTo.value.replace(/(\/)/g, '-')
  query.value.date_start = dateStart
  query.value.date_end = dateEnd
  exportQuery.value.date_start = dateStart
  exportQuery.value.date_end = dateEnd
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
    <div class="row q-mt-xl items-center">
      <q-btn-group>
        <q-btn label="本月" class="text-subtitle1 q-px-lg" @click="changeMonth(0)" :style="isCurrentMonth ? 'background-color: #1976D2; color: #ffffff' : ''"/>
        <q-btn label="上月" class="text-subtitle1 q-px-lg" @click="changeMonth(1)" :style="isLastMonth ? 'background-color: #1976D2; color: #ffffff' : ''"/>
      </q-btn-group>
      <div class="col-4 row items-baseline q-ml-lg">
        <div class="col-5">
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
        <div class="col-1 text-center">至</div>
        <div class="col-5">
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
      </div>
      <div class="col-2">
        <q-select outlined dense v-model="serviceId" :options="filterOptions" @update:model-value="selectService" label="筛选服务"/>
      </div>
      <div class="col-4 q-ml-md">
        <q-btn outline label="搜索" class="q-px-lg" @click="search"/>
        <q-btn outline label="导出当页数据" class="q-ml-md" @click="exportFile"/>
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
