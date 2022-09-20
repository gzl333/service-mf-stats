<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount, Ref, computed } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
import emitter from 'boot/mitt'
import { getNowFormatDate } from 'src/hooks/processTime'
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
const { tc } = i18n.global

const serviceColumns = computed(() => [
  // { name: 'service_id', label: 'ID', align: 'center' },
  { name: 'name', align: 'center', label: (() => tc('components.public.ServerUsageTable.service_unit'))() },
  { name: 'total_original_amount', label: (() => tc('components.public.ServerStatisticsDetailTable.total_billing_amount'))(), align: 'center' },
  { name: 'total_trade_amount', label: (() => tc('components.public.ServerStatisticsDetailTable.total_amount_of_actual_deduction'))(), align: 'center' },
  { name: 'total_server', label: (() => tc('pages.statistic.cloud.GroupAggregationList.total_number_of_servers'))(), align: 'center' }
])
const isLoading = ref(false)
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const myDate = new Date()
const year = myDate.getFullYear()
const serviceTableRow = ref([])
const currentDate = getNowFormatDate(1)
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
emitter.on('service', async (value) => {
  query.value = value
  await getServiceAggregationData()
})
const getServiceAggregationData = async () => {
  isLoading.value = true
  const data = await store.getServiceMetering(query.value)
  serviceTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
  isLoading.value = false
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getServiceAggregationData()
}
const changePagination = async (val: number) => {
  isLoading.value = true
  query.value.page = val
  const data = await store.getServiceMetering(query.value)
  serviceTableRow.value = data.data.results
  isLoading.value = false
}
const goToDetail = (serviceId: string, serviceName: string, serviceCount: string) => {
  navigateToUrl(`/my/stats/statistic/list/service/${serviceId}?name=${serviceName}&count=${serviceCount}`)
}
onBeforeMount(async () => {
  await getServiceAggregationData()
})
onBeforeUnmount(() => {
  emitter.off('service')
})
</script>

<template>
  <div class="ServiceAggregationList">
    <div class="q-ml-md">
      <q-separator/>
      <q-table
        flat
        id="serviceTable"
        :loading="isLoading"
        table-header-class="bg-grey-1 text-grey"
        :rows="serviceTableRow"
        :columns="serviceColumns"
        row-key="name"
        color="primary"
        :loading-label="tc('components.group.GroupTable.notify_loading')"
        :no-data-label="tc('pages.personal.CurrentMonthList.no_data')"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
<!--            <q-td key="service_id" :props="props">{{ props.row.service_id }}</q-td>-->
            <q-td key="name" :props="props">
              <q-btn
                @click="goToDetail(props.row.service_id, props.row.service.name, props.row.total_server )"
                class="q-ma-none" :label="props.row.service.name" color="primary" padding="xs" flat dense unelevated>
              </q-btn>
            </q-td>
            <q-td key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
            <q-td key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
            <q-td key="total_server" :props="props">{{ props.row.total_server }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator/>
      <div class="row text-grey justify-between items-center q-mt-md">
        <div class="row items-center">
          <span class="q-pr-md" v-if="i18n.global.locale === 'zh'">共{{ paginationTable.count }}条数据</span>
          <span class="q-pr-md" v-else>{{ paginationTable.count }} pieces of data in total</span>
          <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense options-dense
                    borderless @update:model-value="changePageSize">
          </q-select>
          <span>/{{ tc('pages.personal.CurrentMonthList.page') }}</span>
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
.ServiceAggregationList {
}
</style>
