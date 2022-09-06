<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, Ref, computed } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import emitter from 'boot/mitt'
import useCopyToClipboard from 'src/hooks/useCopyToClipboard'
import { getNowFormatDate } from 'src/hooks/processTime'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'

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
const serverColumns = computed(() => [
  { name: 'server_id', label: (() => tc('云主机uuid'))(), align: 'center' },
  { name: 'ipv4', align: 'center', label: (() => tc('ip地址'))() },
  { name: 'service_name', label: (() => tc('服务单元'))(), align: 'center' },
  { name: 'configuration', label: (() => tc('初始配置'))(), align: 'center' },
  { name: 'total_public_ip_hours', label: (() => tc('公网IP(个*天)'))(), align: 'center' },
  { name: 'total_cpu_hours', label: (() => tc('vCPU(核*天）'))(), align: 'center' },
  { name: 'total_ram_hours', label: (() => tc('内存(GB*天)'))(), align: 'center' },
  { name: 'total_disk_hours', label: (() => tc('本地硬盘(GB*天)'))(), align: 'center' },
  { name: 'total_original_amount', label: (() => tc('计费金额(总)'))(), align: 'center' },
  { name: 'total_trade_amount', label: (() => tc('实际扣费金额(总)'))(), align: 'center' }
])
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
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
const clickToCopy = useCopyToClipboard()
emitter.on('server', async (value) => {
  query.value = value
  await getServerAggregationData()
})
const getServerAggregationData = async () => {
  isLoading.value = true
  const data = await store.getServerMetering(query.value)
  serverTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
  isLoading.value = false
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getServerAggregationData()
}
const changePagination = async (val: number) => {
  isLoading.value = true
  query.value.page = val
  const data = await store.getServerMetering(query.value)
  serverTableRow.value = data.data.results
  isLoading.value = false
}
const goToDetail = (serverId: string, serviceName: string, ipv4: string, vcpus: string, ram: string) => {
  navigateToUrl(`/my/stats/statistic/list/server/${serverId}?service=${serviceName}&ipv4=${ipv4}&vcpus=${vcpus}&ram=${ram}`)
}
onMounted(async () => {
  await getServerAggregationData()
})
onBeforeUnmount(() => {
  emitter.off('server')
})
</script>

<template>
  <div class="ServerAggregationList">
    <div class="q-ml-md">
      <q-separator/>
      <q-table
        flat
        id="status"
        :loading="isLoading"
        table-header-class="bg-grey-1 text-grey"
        :rows="serverTableRow"
        :columns="serverColumns"
        row-key="name"
        color="primary"
        :loading-label="tc('网络请求中，请稍候...')"
        :no-data-label="tc('暂无数据')"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="server_id" :props="props">
              <q-btn
                @click="goToDetail(props.row.server_id, props.row.service_name, props.row.server.ipv4, props.row.server.vcpus, props.row.server.ram)"
                class="q-ma-none" color="primary" padding="xs" flat dense unelevated>
                <div class="text">{{ props.row.server_id === '' ? tc('暂无') : props.row.server_id }}</div>
              </q-btn>
              <q-btn class="col-shrink q-px-xs q-ma-none" flat dense icon="content_copy" size="xs" color="primary"
                     @click="clickToCopy(props.row.server_id)">
                <q-tooltip>
                  {{ tc('复制到剪切板') }}
                </q-tooltip>
              </q-btn>
            </q-td>
            <q-td key="ipv4" :props="props">{{ props.row.server !== null ? props.row.server.ipv4 : tc('暂无') }}</q-td>
            <q-td key="service_name" :props="props">{{
                props.row.service_name === null ? tc('暂无') : props.row.service_name
              }}
            </q-td>
            <q-td key="configuration" :props="props">{{
                props.row.server !== null ? props.row.server.vcpus + tc('核') + Math.round(props.row.server.ram / 1024) + 'GB' + ' ' + tc('内存') : tc('暂无')
              }}
            </q-td>
            <q-td key="total_public_ip_hours" :props="props">{{
                Math.round(props.row.total_public_ip_hours / 24)
              }}
            </q-td>
            <q-td key="total_cpu_hours" :props="props">{{ Math.round(props.row.total_cpu_hours / 24) }}</q-td>
            <q-td key="total_ram_hours" :props="props">{{ Math.round(props.row.total_ram_hours / 24) }}</q-td>
            <q-td key="total_disk_hours" :props="props">{{ Math.round(props.row.total_disk_hours / 24) }}</q-td>
            <q-td key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
            <q-td key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
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
          <span>/{{ tc('页') }}</span>
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
.ServerAggregationList {
  .text {
    width: 80px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
  }
}
</style>
