<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute } from 'vue-router'
// import { i18n } from 'boot/i18n'
import { loadingShow, loadingHide } from 'src/hooks/loadingPluugins'
import DetailTable from 'components/user/cloud/DetailTable.vue'
import { exportExcel } from 'src/hooks/exportExcel'
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
const dateFrom: any = ref('')
const dateTo: any = ref('')
const isLastMonth = ref(false)
const isCurrentMonth = ref(true)
const tableRow: any = ref([])
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const myDate = new Date()
const year = myDate.getFullYear()
let month: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const getNowFormatDate = (type: number) => {
  month = myDate.getMonth() + 1
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
const dateStart = ref('')
const dateEnd = ref('')
const query: Record<string, any> = ref({
  page: 1,
  page_size: 10,
  date_start: startDate,
  date_end: currentDate
})
const getData = async () => {
  loadingShow()
  tableRow.value = []
  let obj: Record<string, any> = {}
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
  loadingHide()
}
const changeMonth = async (type: number) => {
  if (type === 0) {
    isLastMonth.value = false
    isCurrentMonth.value = true
    query.value.date_start = startDate
    query.value.date_end = currentDate
    await getData()
  } else {
    isCurrentMonth.value = false
    isLastMonth.value = true
    query.value.date_start = startLastDate
    query.value.date_end = currentLastDate
    await getData()
  }
  dateFrom.value = null
  dateTo.value = null
}
const selectDate = () => {
  const dateStart = dateFrom.value.replace(/(\/)/g, '-')
  const dateEnd = dateTo.value.replace(/(\/)/g, '-')
  query.value.date_start = dateStart
  query.value.date_end = dateEnd
}
const changePagination = async (val: number) => {
  query.value.page = val
  await getData()
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getData()
}
const search = async () => {
  await getData()
}
const exportFile = () => {
  exportExcel('用量列表.xlsx', '#detailTable')
}
onMounted(async () => {
  await getData()
})
</script>

<template>
  <div class="DetailList">
    <div class="row q-pa-lg q-gutter-x-md">
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
                      <q-btn v-close-popup label="Close" color="primary" flat/>
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
                      <q-btn v-close-popup label="Close" color="primary" flat/>
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
    <detail-table :tableRow="tableRow"/>
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
.DetailList {
}
</style>
