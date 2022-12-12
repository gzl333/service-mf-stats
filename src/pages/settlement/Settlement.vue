<script setup lang="ts">
import { onMounted, Ref, ref, computed } from 'vue'
import { useStore } from 'stores/store'
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
interface queryProps {
  page: number,
  page_size: number,
  time_start: string,
  time_end: string,
  payment_status?: string
}

const resourceTypeSelect = ref({
  label: '选择资源类型',
  value: ''
})
// 按支付方式筛选选项组
const resourceOption = [{
  label: '全部',
  value: ''
}, {
  label: '云主机',
  value: 'evcloud'
}, {
  label: '对象存储',
  value: 'iharbor'
}
]

const paymentSelect = ref({
  label: '选择支付方式',
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
const store = useStore()
const tablePaymentData = ref<TableDataProps[]>([])
const tableOrderData :Ref = ref<TableDataProps[]>([])
const d = new Date()
d.setHours(d.getHours(), d.getMinutes() - d.getTimezoneOffset())
d.setMonth(d.getMonth())
const currentDate1 = d.toISOString()
const currentDate = payRecordUtcToBeijing(currentDate1) // 去掉小数点
// const currentDate = currentDate1.toDateString()
let dateTime = new Date()
dateTime.setMonth(d.getMonth() - 1)
dateTime = new Date(dateTime)
const startDate1 = dateTime.toISOString()
const startDate = payRecordUtcToBeijing(startDate1)
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

const query3: Ref = ref<queryProps>({
  page: 1,
  page_size: 10,
  time_start: startDate,
  time_end: currentDate
})
const search = async () => {
  await getDetailData()
}
const getDetailData = async () => {
  console.log('query3', query3)
  tablePaymentData.value = []
  const data = await api.stats.statement.getStatementStorage({
    query: query3.value
  }
  )
  console.log('data', data)
  console.log('tablePaymentData', tablePaymentData)
  const data2 = await api.stats.statement.getStatementServer({
    query: query3.value
  }
  )
  if (targetSelect.value === 'evcloud') {
    for (const elem of data2.data.statements) {
      tablePaymentData.value.push(elem)
    }
  } else if (targetSelect.value === 'iharbor') {
    for (const elem of data.data.statements) {
      tablePaymentData.value.push(elem)
    }
  } else {
    for (const elem of data.data.statements) {
      tablePaymentData.value.push(elem)
    }
    for (const elem of data2.data.statements) {
      tablePaymentData.value.push(elem)
    }
  }
  paginationTable.value.count = data.data.page_size
}
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
const selectDate = () => {
  query3.value.time_start = setDateFrom(dateFrom.value.replace(/(\/)/g, '-'))
  query3.value.time_end = setDateTO(dateTo.value.replace(/(\/)/g, '-'))
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
// 按日计量单的资源类型筛选
const targetSelect = ref<string>()
const selectResourceService = (val:string) => {
  if (val !== '') {
    targetSelect.value = val
    getDetailData()
  } else {
    targetSelect.value = ''
    getDetailData()
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
        <q-select outlined dense v-model="paymentSelect" :options="PaymentOption" @update:model-value="selectStatusService(paymentSelect.value)" label="选择支付方式" class="col-2 q-mr-lg" />
      <q-select outlined dense v-model="resourceTypeSelect" :options="resourceOption" @update:model-value="selectResourceService(resourceTypeSelect.value)" label="选择资源类型" class="col-2 q-mr-lg" />
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
