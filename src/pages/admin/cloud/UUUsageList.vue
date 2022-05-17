<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UUTable from 'components/admin/cloud/UUTable.vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import { useRoute } from 'vue-router'
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
const dateFrom: any = ref('')
const dateTo: any = ref('')
const isLastMonth = ref(false)
const isCurrentMonth = ref(true)
const topRow: any = ref([])
const bottomRow: any = ref([])
const myDate = new Date()
const year = myDate.getFullYear()
let month: any = myDate.getMonth() + 1
let strDate: any = myDate.getDate()
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
const query: any = ref({
  page: 1,
  page_size: 10,
  date_start: startDate,
  date_end: currentDate,
  server_id: '',
  'as-admin': true
})
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const getData = async () => {
  topRow.value = []
  bottomRow.value = []
  let obj: any = {}
  let objTwo: any = {}
  query.value.server_id = route.params.uuId
  const data = await store.getMachineDetail(query.value)
  for (const elem of data.data.results) {
    obj = {}
    objTwo = {}
    obj.server_id = elem.server_id
    obj.service_id = elem.service_id
    obj.pay_type = elem.pay_type
    obj.payment_status = elem.payment_status
    obj.owner_type = elem.owner_type
    topRow.value.push(obj)
    objTwo.creation_time = elem.creation_time
    objTwo.public_ip_hours = elem.public_ip_hours
    objTwo.cpu_hours = elem.cpu_hours
    objTwo.ram_hours = elem.ram_hours
    objTwo.disk_hours = elem.disk_hours
    objTwo.original_amount = elem.original_amount
    objTwo.trade_amount = elem.trade_amount
    bottomRow.value.push(objTwo)
  }
  paginationTable.value.count = data.data.count
}
const changeMonth = (type: number) => {
  if (type === 0) {
    isLastMonth.value = false
    isCurrentMonth.value = true
    query.value.date_start = startDate
    query.value.date_end = currentDate
    getData()
  } else {
    isCurrentMonth.value = false
    isLastMonth.value = true
    query.value.date_start = startLastDate
    query.value.date_end = currentLastDate
    getData()
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
// const changePageSize = async () => {
//   query.value.page_size = paginationTable.value.rowsPerPage
//   query.value.page = 1
//   paginationTable.value.page = 1
//   const data = await store.getUUMachineData(query.value)
//   tableRow.value = data.data.results
// }
const changePagination = async (val: number) => {
  query.value.page = val
  // const data = await store.getUUMachineData(query.value)
  // tableRow.value = data.data.results
}
const search = async () => {
  await getData()
}
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="UUUsageList">
    <div class="row q-px-lg q-pt-lg q-pb-xs">
      <div class="col-2">
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
      <div class="col-2">
        <q-btn outline color="primary" label="搜索" class="q-px-xl" @click="search"/>
<!--        <q-btn outline color="primary" label="导出" class="q-px-xl q-ml-sm"/>-->
      </div>
    </div>
    <u-u-table :topRow="topRow" :bottomRow="bottomRow"/>
    <q-separator/>
    <div class="row q-pa-md text-grey justify-between items-center">
      <div class="row items-center">
        <span class="q-pr-md">共{{ paginationTable.count }}条数据</span>
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
.UUUsageList {
}
</style>
