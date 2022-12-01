<script setup lang="ts">
import { onMounted, Ref, ref, computed } from 'vue'
import { useStore } from 'stores/store'
import ServerPayRecord from 'components/public/ServerPayrecord.vue'
import { payRecordUtcToBeijing } from 'src/hooks/processTime'

import api from 'src/api'
interface TableDataProps {
  id?: string,
  amounts?: string,
  type?: string,
  remark?: string,
  subject?: string,
  payment_method?: string,
  payment_time?: string,
  order_id?: string,
  resource_type?:string,
  vm_cpu?: number,
  vm_ram?: number,
  vm_systemdisk_size?: number,
  cancelled_time?: string,
  owner_type?:string,
  service_name?: string
}
interface itemProps {
  id: string,
  status: string
  resource_type: string
}

const store = useStore()
// const filterOptions1 = computed(() => store.getpaymenthistory)
const filterOptions1 = []
const tablePaymentData = ref<TableDataProps[]>([])
const tableOrderData :Ref = ref<TableDataProps[]>([])
const d = new Date()
d.setHours(d.getHours(), d.getMinutes() - d.getTimezoneOffset())
d.setMonth(d.getMonth())
const currentDate1 = d.toISOString()
const currentDate = payRecordUtcToBeijing(currentDate1) // 去掉小数点
let dateTime = new Date()
dateTime.setMonth(d.getMonth() - 1)
dateTime = new Date(dateTime)
const startDate1 = dateTime.toISOString()
const startDate = payRecordUtcToBeijing(startDate1)
function setDateFrom (setTime:string) {
  return setTime.split('T')[0] + 'T' + '00:' + '00:' + '00' + 'Z'
}
function setDateTO (setTime:string) {
  return setTime.split('T')[0] + 'T' + '23:' + '59:' + '59' + 'Z'
}
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const paymentSelect = ref({
  label: '支付选择',
  value: ''
})
const query3: Ref = ref({
  page: 1,
  page_size: 10,
  time_start: startDate,
  time_end: currentDate
})
const search = async () => {
  await getDetailData()
}
const getDetailData = async () => {
  tablePaymentData.value = []
  const data = await api.stats.paymentHistory.getPaymentHistory({
    query: {
      page_size: query3.value.page_size,
      time_start: query3.value.time_start,
      time_end: query3.value.time_end
    }
  })
  const data2 = await api.stats.paymentOrder.getOrder({
    query: {
      page_size: query3.value.page_size,
      time_start: query3.value.time_start,
      time_end: query3.value.time_end,
      page: query3.value.page
    }
  })
  for (const elem of data.data.results) {
    tablePaymentData.value.push(elem)
  }
  for (const elem of data2.data.orders) {
    tableOrderData.value.push(elem)
  }
  paginationTable.value.count = data.data.page_size
  tablePaymentData.value.forEach(function (item) {
    tableOrderData.value.forEach(function (item2: itemProps) {
      if (item.order_id === item2.id) {
        item.resource_type = item2.resource_type
      }
    })
  })
}
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
const selectDate = () => {
  query3.value.time_start = setDateFrom(dateFrom.value.replace(/(\/)/g, '-'))
  query3.value.time_end = setDateTO(dateTo.value.replace(/(\/)/g, '-'))
}
const selectService = (val: Record<string, string>) => {
  if (val.value !== '') {
    query3.value.id = val.value
    query3.value.payment_method = val.label
  } else {
    delete query3.value.id
  }
}
const changePagination = async (val: number) => {
  query3.value.page = val
  await getDetailData()
}
const changePageSize = async () => {
  query3.value.page_size = paginationTable.value.rowsPerPage
  query3.value.page = 1
  paginationTable.value.page = 1
  await getDetailData()
}

onMounted(async () => {
  await getDetailData()
})
</script>

<template>
  <div class="CurrentMonthList">
    <div class="row items-start ">
      <div class="col-2">
        <q-input filled dense v-model="dateFrom" mask="date" >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale" >
                <q-date v-model="dateFrom" @update:model-value="selectDate" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="q-mx-md">至</div>
      <div class="col-2 q-mr-md">
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
        <q-select outlined dense v-model="paymentSelect" :options="filterOptions1" @update:model-value="selectService" label="选择支付方式" class="col-2 q-mr-lg" />
      <q-btn outline label="搜索" class="q-px-lg" @click="search"/>
      </div>
    <server-pay-record :tableRow="tablePaymentData"/>
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
.StatisticsIndex {
}
</style>
