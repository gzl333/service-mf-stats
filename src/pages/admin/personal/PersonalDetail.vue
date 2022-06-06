<script setup lang="ts">
import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { useStore } from 'stores/store'
import { useRoute } from 'vue-router'
import ServerTable from 'components/admin/statistic/ServerTable.vue'
import { exportExcel } from 'src/hooks/exportExcel'
// import { navigateToUrl } from 'single-spa'
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
// const router = useRouter()
// const tc = i18n.global.tc
const dateFrom = ref('')
const dateTo = ref('')
const isLastMonth = ref(false)
const isCurrentMonth = ref(true)
const tableRow: Ref = ref([])
const serviceName = ref('')
const vcpus = ref('')
const ram = ref('')
const myDate = new Date()
const year = myDate.getFullYear()
let month: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const getNowFormatDate = (type: number) => {
  month = myDate.getMonth() + 1
  strDate = myDate.getDate()
  const seperator1 = '-'
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (type === 0) {
    return year + seperator1 + month + seperator1 + '01'
  } else {
    return year + seperator1 + month + seperator1 + strDate
  }
}
const getLastFormatDate = (type: number) => {
  month = myDate.getMonth()
  strDate = myDate.getDate()
  const day = new Date(year, month, 0).getDate()
  const seperator1 = '-'
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (type === 0) {
    return year + seperator1 + month + seperator1 + '01'
  } else {
    return year + seperator1 + month + seperator1 + day
  }
}
const startDate = getNowFormatDate(0)
const currentDate = getNowFormatDate(1)
const startLastDate = getLastFormatDate(0)
const currentLastDate = getLastFormatDate(1)
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: startDate,
  date_end: currentDate,
  server_id: ''
})
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const getDetailData = async () => {
  tableRow.value = []
  let obj: Record<string, string> = {}
  query.value.server_id = route.params.serverId
  const data = await store.getMachineDetail(query.value)
  for (const elem of data.data.results) {
    obj = {}
    obj.creation_time = elem.creation_time
    obj.public_ip_hours = elem.public_ip_hours
    obj.cpu_hours = elem.cpu_hours
    obj.ram_hours = elem.ram_hours
    obj.disk_hours = elem.disk_hours
    obj.original_amount = elem.original_amount
    obj.trade_amount = elem.trade_amount
    tableRow.value.push(obj)
  }
  paginationTable.value.count = data.data.count
}
const changeMonth = (type: number) => {
  if (type === 0) {
    isLastMonth.value = false
    isCurrentMonth.value = true
    query.value.date_start = startDate
    query.value.date_end = currentDate
    getDetailData()
  } else {
    isCurrentMonth.value = false
    isLastMonth.value = true
    query.value.date_start = startLastDate
    query.value.date_end = currentLastDate
    getDetailData()
  }
  dateFrom.value = ''
  dateTo.value = ''
}
const selectDate = () => {
  const dateStart = dateFrom.value.replace(/(\/)/g, '-')
  const dateEnd = dateTo.value.replace(/(\/)/g, '-')
  query.value.date_start = dateStart
  query.value.date_end = dateEnd
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
  await getDetailData()
}
const exportFile = () => {
  exportExcel('用量明细.xlsx', '#serverTable')
}
onMounted(() => {
  serviceName.value = sessionStorage.getItem('serviceName') || ''
  vcpus.value = sessionStorage.getItem('vcpus') || ''
  ram.value = sessionStorage.getItem('ram') || ''
  getDetailData()
})
onUnmounted(() => {
  sessionStorage.removeItem('serviceName')
  sessionStorage.removeItem('vcpus')
  sessionStorage.removeItem('ram')
})
</script>

<template>
  <div class="DetailServer">
    <div class="row q-pa-md q-pt-lg q-pb-xs">
      <div class="col-3">
        <q-btn-group>
          <q-btn :color="isCurrentMonth ? 'blue-5' : 'white'" label="本月" class="text-subtitle1 q-px-xl text-black"
                 @click="changeMonth(0)"/>
          <q-btn :color="isLastMonth ? 'blue-5' : 'white'" label="上月" class="text-subtitle1 q-px-xl text-black"
                 @click="changeMonth(1)"/>
        </q-btn-group>
      </div>
      <div class="col-4 row items-baseline">
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
      <div class="col-3">
        <q-btn outline color="primary" label="搜索" class="q-px-xl" @click="search"/>
        <q-btn outline color="primary" label="导出" class="q-px-xl q-ml-sm" @click="exportFile"/>
      </div>
    </div>
    <div class="q-px-lg q-py-md">
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="row">
            <div class="col-4 text-center">
              <div class="text-h6">UUID</div>
              <q-separator size="0.1rem"/>
              <div class="text-subtitle1 q-mt-lg">{{route.params.serverId}}</div>
            </div>
            <div class="col-4 text-center">
              <div class="text-h6">服务节点</div>
              <q-separator size="0.1rem"/>
              <div class="text-subtitle1 q-mt-lg">{{serviceName}}</div>
            </div>
            <div class="col-4 text-center">
              <div class="text-h6">初始配置</div>
              <q-separator size="0.1rem"/>
              <div class="text-subtitle1 q-mt-md">{{vcpus}}核</div>
              <div class="text-subtitle1">{{ram / 1024}}GB内存</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <server-table :tableRow="tableRow"/>
    <div class="row q-pa-md text-grey justify-between items-center">
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
.DetailServer {
}
</style>
