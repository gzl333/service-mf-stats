<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount, computed, Ref } from 'vue'
// import { useStore } from 'stores/store'
import { getNowFormatDate } from 'src/hooks/processTime'
import { navigateToUrl } from 'single-spa'
import useCopyToClipboard from 'src/hooks/useCopyToClipboard'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
import stats from 'src/api'
import emitter from 'boot/mitt'

// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

// const store = useStore()
// const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const clickToCopy = useCopyToClipboard()
const serverColumns = computed(() => [
  { name: 'server_id', label: (() => tc('uuid'))(), align: 'center' },
  { name: 'ipv4', align: 'center', label: (() => tc('ip'))() },
  { name: 'service_name', label: (() => tc('serviceUnit'))(), align: 'center' },
  { name: 'configuration', label: (() => tc('initialConfiguration'))(), align: 'center' },
  { name: 'total_public_ip_hours', label: (() => tc('publicIp'))(), align: 'center' },
  { name: 'total_cpu_hours', label: (() => tc('vCPU'))(), align: 'center' },
  { name: 'total_ram_hours', label: (() => tc('memory'))(), align: 'center' },
  { name: 'total_disk_hours', label: (() => tc('localDisk'))(), align: 'center' },
  { name: 'total_original_amount', label: (() => tc('billingAmount'))(), align: 'center' },
  { name: 'total_trade_amount', label: (() => tc('actualBillingAmount'))(), align: 'center' }
])
const isLoading = ref(false)
const myDate = new Date()
const year = myDate.getFullYear()
const serverTableRow = ref([])
const currentDate = getNowFormatDate(1)
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
emitter.on('server', async (value) => {
  query.value = value
  paginationTable.value.page = 1
  await getServerAggregationData()
})
const getServerAggregationData = async () => {
  isLoading.value = true
  const respServerMetering = await stats.stats.metering.getAggregationServer({ query: query.value })
  serverTableRow.value = respServerMetering.data.results
  paginationTable.value.count = respServerMetering.data.count
  isLoading.value = false
}
const changePageSize = () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  getServerAggregationData()
}
const changePagination = () => {
  query.value.page = paginationTable.value.page
  getServerAggregationData()
}
const goToDetail = (serverId: string, ipv4: string, vcpus: string, ram: string) => {
  navigateToUrl(`/my/stats/statistic/list/server/${serverId}?ipv4=${ipv4}&vcpus=${vcpus}&ram=${ram}`)
}
onBeforeMount(() => {
  getServerAggregationData()
})
onBeforeUnmount(() => {
  emitter.off('server')
})
</script>

<template>
  <div class="ServerAggregationList">
    <div class="q-ml-md">
      <q-table
        flat
        id="serverTable"
        card-class="no-padding"
        :loading="isLoading"
        table-header-class="bg-grey-1 text-grey"
        :rows="serverTableRow"
        :columns="serverColumns"
        row-key="name"
        color="primary"
        :loading-label="tc('notifyLoading')"
        :no-data-label="tc('noData')"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
<!--        <template v-slot:header="props">-->
<!--          <q-tr :props="props">-->
<!--            <q-th-->
<!--              v-for="col in props.cols"-->
<!--              :key="col.name"-->
<!--              :props="props"-->
<!--              class="no-padding"-->
<!--            >-->
<!--              {{ col.label }}-->
<!--            </q-th>-->
<!--          </q-tr>-->
<!--        </template>-->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td class="no-padding" key="server_id" :props="props">
              <q-btn @click="goToDetail(props.row.server_id, props.row.server.ipv4, props.row.server.vcpus, props.row.server.ram)"
                class="q-ma-none" color="primary" padding="xs" flat dense unelevated>
                <div class="text">{{ props.row.server_id === '' ? tc('no_yet') : props.row.server_id }}</div>
              </q-btn>
              <q-btn class="col-shrink q-px-xs q-ma-none" flat dense icon="content_copy" size="xs" color="primary"
                     @click="clickToCopy(props.row.server_id)">
                <q-tooltip>
                  {{ tc('copyToClipboard') }}
                </q-tooltip>
              </q-btn>
            </q-td>
            <q-td class="no-padding" key="ipv4" :props="props">{{ props.row.server !== null ? props.row.server.ipv4 : tc('no_yet') }}</q-td>
            <q-td class="no-padding" key="service_name" :props="props">{{props.row.service_name === null ? tc('no_yet') : props.row.service_name }}</q-td>
            <q-td class="no-padding" key="configuration" :props="props">{{props.row.server !== null ? props.row.server.vcpus + ' ' + tc('core') + ' ' + Math.round(props.row.server.ram / 1024) + ' GB' : tc('no_yet') }}</q-td>
            <q-td class="no-padding" key="total_public_ip_hours" :props="props">{{Math.round(props.row.total_public_ip_hours / 24) + ' ' + tc('pieceDays') }}</q-td>
            <q-td class="no-padding" key="total_cpu_hours" :props="props">{{ Math.round(props.row.total_cpu_hours / 24) + ' ' + tc('coreDay') }}</q-td>
            <q-td class="no-padding" key="total_ram_hours" :props="props">{{ Math.round(props.row.total_ram_hours / 24) + ' ' + tc('gbDays') }}</q-td>
            <q-td class="no-padding" key="total_disk_hours" :props="props">{{ Math.round(props.row.total_disk_hours / 24) + ' ' + tc('gbDays') }}</q-td>
            <q-td class="no-padding" key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
            <q-td class="no-padding" key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
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
          <span>/{{ tc('page') }}</span>
        </div>
        <q-pagination
          v-model="paginationTable.page"
          :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
          :max-pages="9"
          direction-links
          outline
          :ripple="false"
          @click="changePagination"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ServerAggregationList {
  .text {
    width: 80px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
  }
}
</style>
