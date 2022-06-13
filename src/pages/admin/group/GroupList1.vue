<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, Ref } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import emitter from 'boot/mitt'
import { getLastFormatDate, getNowFormatDate } from 'src/hooks/processTime'
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
const groupColumns = [
  { name: 'vo_id', label: 'ID', align: 'center' },
  { name: 'name', align: 'center', label: '项目组名称' },
  { name: 'company', label: '单位', align: 'center' },
  { name: 'total_original_amount', label: '计费金额合计', align: 'center' },
  { name: 'total_trade_amount', label: '实际扣费金额合计', align: 'center' },
  { name: 'total_server', label: '云主机数量合计', align: 'center' }
]
const isLoading = ref(false)
const dateFrom = ref('')
const dateTo = ref('')
const isLastMonth = ref(false)
const isCurrentMonth = ref(true)
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const startDate = getNowFormatDate(0)
const currentDate = getNowFormatDate(1)
const startLastDate = getLastFormatDate(0)
const currentLastDate = getLastFormatDate(1)
// const dateStart = ref('')
// const dateEnd = ref('')
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: startDate,
  date_end: currentDate
})
// const myDate = new Date()
// const year = myDate.getFullYear()
const groupTableRow = ref([])
emitter.on('group', async (value) => {
  query.value = value
  await getGroupData()
})
const changeMonth = async (type: number) => {
  if (type === 0) {
    isLastMonth.value = false
    isCurrentMonth.value = true
    query.value.date_start = startDate
    query.value.date_end = currentDate
    // await getDetailData()
  } else {
    isCurrentMonth.value = false
    isLastMonth.value = true
    query.value.date_start = startLastDate
    query.value.date_end = currentLastDate
    // await getDetailData()
  }
  dateFrom.value = ''
  dateTo.value = ''
}
const search = async () => {
  // if (groupId.value.value === '0') {
  //   await getDetailData()
  // } else {
  //   await getSingleDetailData()
  // }
}
const exportFile = () => {
  exportExcel('项目组云主机用量列表.xlsx', '#groupServerTable')
}
const selectDate = () => {
  const dateStart = dateFrom.value.replace(/(\/)/g, '-')
  const dateEnd = dateTo.value.replace(/(\/)/g, '-')
  query.value.date_start = dateStart
  query.value.date_end = dateEnd
}
const getGroupData = async () => {
  isLoading.value = true
  const data = await store.getGroupHostData(query.value)
  groupTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
  isLoading.value = false
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getGroupData()
}
const changePagination = async (val: number) => {
  isLoading.value = true
  query.value.page = val
  const data = await store.getGroupHostData(query.value)
  groupTableRow.value = data.data.results
  isLoading.value = false
}
const goToDetail = (userid: string, voName: string, count: string) => {
  navigateToUrl(`/my/stats/statistic/list/group/${userid}`)
  sessionStorage.setItem('voName', voName)
  sessionStorage.setItem('groupCount', count)
}
onMounted(async () => {
  await getGroupData()
})
onBeforeUnmount(() => {
  emitter.off('group')
})

</script>

<template>
  <div class="GroupList">
    <div class="row q-mt-xl items-center">
      <q-btn-group>
        <q-btn label="本月" class="text-subtitle1 q-px-lg" :style="isCurrentMonth ? 'background-color: #1976D2; color: #ffffff' : ''" @click="changeMonth(0)"/>
        <q-btn label="上月" class="text-subtitle1 q-px-lg" :style="isLastMonth ? 'background-color: #1976D2; color: #ffffff' : ''" @click="changeMonth(1)"/>
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
        <q-btn outline label="搜索" class="q-px-lg" @click="search"/>
        <q-btn outline label="导出当页数据" class="q-ml-sm" @click="exportFile"/>
      </div>
    </div>
    <div class="q-ml-md q-mt-xl">
      <q-separator/>
      <q-table
        flat
        id="groupTable"
        :loading="isLoading"
        table-header-class="bg-grey-1 text-grey"
        :rows="groupTableRow"
        :columns="groupColumns"
        row-key="name"
        color="primary"
        loading-label="网络请求中，请稍候..."
        no-data-label="暂无数据"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="vo_id" :props="props">{{ props.row.vo_id }}</q-td>
            <q-td key="name" :props="props">
              <q-btn
                @click="goToDetail(props.row.vo_id, props.row.vo.name, props.row.total_server)"
                class="q-ma-none" :label="props.row.vo.name" color="primary" padding="xs" flat dense unelevated>
              </q-btn>
            </q-td>
            <q-td key="company" :props="props">{{ props.row.vo.company }}</q-td>
            <q-td key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
            <q-td key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
            <q-td key="total_server" :props="props">{{ props.row.total_server }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator/>
      <div class="row text-grey justify-between items-center q-mt-md">
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
  </div>
</template>

<style lang="scss" scoped>
.GroupList {
}
</style>
