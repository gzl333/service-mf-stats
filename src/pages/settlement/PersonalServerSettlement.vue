<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import ServerPayRecord from 'components/public/ServerStatement.vue'
import { payRecordUtcToBeijing } from 'src/hooks/processTime'

import api from 'src/api'
interface TableDataProps {
  id: string,
  original_amount: string,
  payable_amount: string,
  trade_amount: string,
  payment_status: string,
  payment_history_id: string,
  date: string,
  creation_time: string,
  user_id: string,
  username: string,
  vo_id: string,
  vo_name: string,
  owner_type: string,
  service: {
    id:string,
    name: string,
    name_en: string,
    service_type: string
  }
}
interface QueryProps {
  page: number,
  page_size: number,
  date_start: string,
  date_end: string,
  payment_status?: string
}

const paymentSelect = ref({
  label: '选择支付状态',
  value: ''
})
// 按支付方式筛选选项组
const PaymentOption = [{
  label: '全部',
  value: ''
}, {
  label: '待支付',
  value: 'unpaid'
}, {
  label: '已支付',
  value: 'paid'
}, {
  label: '作废',
  value: 'cancelled'
}
]

const tablePaymentData = ref<TableDataProps[]>([])
const date = new Date()
date.setHours(date.getHours(), date.getMinutes() - date.getTimezoneOffset())
date.setMonth(date.getMonth())
const currentDate = payRecordUtcToBeijing(date.toISOString()) // 去掉小数点
const date2 = new Date()
date2.setMonth(date2.getMonth() - 1)
const startDate = payRecordUtcToBeijing(date2.toISOString())
function setDateFrom (setTime:string) {
  return setTime.split('T')[0]
}
function setDateTO (setTime:string) {
  return setTime.split('T')[0]
}
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})

const query3: Ref = ref<QueryProps>({
  page: 1,
  page_size: 10,
  date_start: startDate,
  date_end: currentDate
})
const search = async () => {
  await getDetailData()
}
//  获取个人日计量单列表
const getDetailData = async () => {
  tablePaymentData.value = []
  const serverData = await api.stats.statement.getStatementServer({
    query: query3.value
  }
  )
  for (const elem of serverData.data.statements) {
    tablePaymentData.value.push(elem)
  }
  paginationTable.value.count = serverData.data.count
}
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
const selectDate = () => {
  query3.value.date_start = setDateFrom(dateFrom.value.replace(/(\/)/g, '-'))
  query3.value.date_end = setDateTO(dateTo.value.replace(/(\/)/g, '-'))
}
// 按日计量单的支付状态筛选
const selectStatusService = (val:string) => {
  if (val !== '') {
    query3.value.payment_status = val
    getDetailData()
  } else {
    delete query3.value.payment_status
  }
}

const changePagination = async (val: number) => {
  query3.value.page = val
  await getDetailData()
}
const changePageSize = async () => {
  query3.value.page_size = paginationTable.value.rowsPerPage * 0.5
  query3.value.page = 1
  paginationTable.value.page = 1
  await getDetailData()
}
const searchTicket = ref('')

onMounted(async () => {
  await getDetailData()
})
</script>

<template>
  <div class="CurrentMonthList">
    <div class="row items-center ">
      <div class="col-2">
        <q-input filled dense v-model="dateFrom" mask="date" >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale" >
                <q-date minimal v-model="dateFrom" @update:model-value="selectDate" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="text-center q-mx-md">至</div>
      <div class="col-2 q-mr-md">
        <q-input filled dense v-model="dateTo" mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="dateTo" @update:model-value="selectDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
        <q-select outlined dense v-model="paymentSelect" :options="PaymentOption" @update:model-value="selectStatusService(paymentSelect.value)" label="选择支付状态" class="col-2 q-mr-lg" />
      <div class="row justify-start">
        <div class="col">
          <q-input dense outlined v-model="searchTicket">
            <template v-slot:prepend>
              <q-icon name="search"/>
            </template>
            <template v-slot:append v-if="searchTicket">
              <q-icon name="close" @click="searchTicket = ''" class="cursor-pointer"/>
            </template>
          </q-input>
        </div>
      </div>
      <q-btn outline label="搜索" class="q-px-lg q-ml-lg" @click="search"/>
      </div>
    <server-pay-record :tableRow="tablePaymentData" :search="searchTicket"/>
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
