<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import DetailTable from 'components/statistic/ServerUsageDetailTable.vue'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { getNowFormatDate, getLastFormatDate } from 'src/hooks/processTime'
import { Notify } from 'quasar'
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
const router = useRouter()
// const tc = i18n.global.tc
const totalAmount = ref(0)
const actualAmount = ref(0)
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
const currentMonthStartDate = getNowFormatDate(0)
const currentMonthEndDate = getNowFormatDate(1)
const lastMonthStartDate = getLastFormatDate(0)
const lastMonthEndDate = getLastFormatDate(1)
const dateStart = ref('')
const dateEnd = ref('')
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: currentMonthStartDate,
  date_end: currentMonthEndDate,
  'as-admin': true
})
const exportQuery: Ref = ref({
  date_start: currentMonthStartDate,
  date_end: currentMonthEndDate,
  'as-admin': true,
  download: true
})
const getDetailData = async () => {
  tableRow.value = []
  totalAmount.value = 0
  actualAmount.value = 0
  let obj: Record<string, string> = {}
  if (route.meta.type === 'user') {
    query.value.user_id = route.params.userid
    exportQuery.value.user_id = route.params.userid
  } else if (route.meta.type === 'group') {
    query.value.vo_id = route.params.groupId
    exportQuery.value.vo_id = route.params.groupId
  } else if (route.meta.type === 'service') {
    query.value.service_id = route.params.serviceId
    exportQuery.value.service_id = route.params.serviceId
  }
  const data = await store.getServerMetering(query.value)
  for (const elem of data.data.results) {
    obj = {}
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
    totalAmount.value = totalAmount.value + elem.total_original_amount
    actualAmount.value = actualAmount.value + elem.total_trade_amount
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
    query.value.date_start = currentMonthStartDate
    query.value.date_end = currentMonthEndDate
    exportQuery.value.date_start = currentMonthStartDate
    exportQuery.value.date_end = currentMonthEndDate
    await getDetailData()
  } else {
    isCurrentMonth.value = false
    isLastMonth.value = true
    query.value.date_start = lastMonthStartDate
    query.value.date_end = lastMonthEndDate
    exportQuery.value.date_start = lastMonthStartDate
    exportQuery.value.date_end = lastMonthEndDate
    await getDetailData()
  }
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
    exportExcel('云主机用量统计.xlsx', '#detailTable')
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
    exportAllData(fileData.data, '云主机用量统计')
  }
}
onMounted(async () => {
  await getDetailData()
})
</script>

<template>
  <div class="ServerUsageDetailList">
    <div class="row items-center title-area q-mt-xl">
      <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
             @click="router.back()"/>
      <span class="text-primary text-h6 text-weight-bold">云主机用量统计</span>
    </div>
    <div class="row q-mt-lg">
      <q-btn-group>
        <q-btn label="本月" :class="isCurrentMonth ? 'text-subtitle1 q-px-lg button-area' : 'text-subtitle1 q-px-lg'" @click="changeMonth(0)"/>
        <q-btn label="上月" :class="isLastMonth ? 'text-subtitle1 q-px-lg button-area' : 'text-subtitle1 q-px-lg'" @click="changeMonth(1)"/>
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
      <div class="col-4">
        <q-btn outline label="搜索" @click="search"/>
        <q-btn outline label="导出当页数据" class="q-ml-md" @click="exportFile"/>
        <q-btn outline label="导出全部数据" class="q-ml-md" @click="exportAll"/>
      </div>
    </div>
    <div class="row q-mt-xl text-subtitle1 text-bold">
      <!--      <div class="col-2">{{ store.tables.UserNameTable.byId[route.params.userid]?.username }}</div>-->
      <div>
        {{ route.meta.type === 'user' ? '用户名：' : route.meta.type === 'group' ? '组名称：' : '服务名称：' }}{{ route.query.name }}
      </div>
      <div class="q-ml-lg">云主机数量合计：{{ route.query.count }}</div>
      <div class="q-ml-lg">计费周期：{{ dateStart }}-{{ dateEnd }}</div>
      <div class="q-ml-lg">计费金额合计：{{ totalAmount.toFixed(2) }}点</div>
      <div class="q-ml-lg">实际扣费金额合计：{{ actualAmount.toFixed(2) }}点</div>
    </div>
    <detail-table :tableRow="tableRow"/>
    <div class="row q-mt-lg text-grey justify-between items-center">
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
.ServerUsageDetailList {
  .button-area {
    background-color: $primary;
    color: $dark;
  }
}
</style>
