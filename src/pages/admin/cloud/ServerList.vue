<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import emitter from 'boot/mitt'
// import { useRoute, useRouter } from 'vue-router'
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
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc

const serverColumns = [
  { name: 'server_id', label: '云主机uuid', align: 'center' },
  { name: 'ipv4', align: 'center', label: 'ip地址' },
  { name: 'service_name', label: '服务节点', align: 'center' },
  { name: 'configuration', label: '初始配置', align: 'center' },
  { name: 'total_public_ip_hours', label: '公网IP(个)', align: 'center' },
  { name: 'total_cpu_hours', label: 'vCPU(核*天）', align: 'center' },
  { name: 'total_ram_hours', label: '内存(GB*天)', align: 'center' },
  { name: 'total_disk_hours', label: '本地硬盘(GB*天)', align: 'center' },
  { name: 'total_original_amount', label: '计费金额(总)', align: 'center' },
  { name: 'total_trade_amount', label: '实际扣费金额(总)', align: 'center' }
]
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const myDate = new Date()
const year = myDate.getFullYear()
let monthNew: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const serverTableRow = ref([])
const getNowFormatDate = () => {
  const seperator1 = '-'
  if (monthNew >= 1 && monthNew <= 9) {
    monthNew = '0' + monthNew
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return year + seperator1 + monthNew + seperator1 + strDate
}
const currentDate = getNowFormatDate()
const query: Record<string, any> = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
emitter.on('server', (value) => {
  query.value = value
  getServerData()
})
const getServerData = async () => {
  const data = await store.getUUMachineData(query.value)
  serverTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getServerData()
}
const changePagination = async (val: number) => {
  query.value.page = val
  await getServerData()
}
const goToDetail = (serverId: string, serviceName: string, ipv4: string, vcpus: string, ram: string) => {
  navigateToUrl(`/my/stats/cloud/server/${serverId}`)
  sessionStorage.setItem('serviceName', serviceName)
  sessionStorage.setItem('ipv4', ipv4)
  sessionStorage.setItem('vcpus', vcpus)
  sessionStorage.setItem('ram', ram)
}
onMounted(async () => {
  await getServerData()
})
onBeforeUnmount(() => {
  emitter.off('server')
})
</script>

<template>
  <div class="ServerList">
    <div class="q-px-sm q-mt-md">
      <q-separator/>
      <q-table
        flat
        id="uuTable"
        table-header-class="bg-grey-1 text-grey"
        :rows="serverTableRow"
        :columns="serverColumns"
        row-key="name"
        color="primary"
        loading-label="网络请求中，请稍候..."
        no-data-label="暂无数据"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="server_id" :props="props">
              <div class="text-center">
                <q-btn
                  @click="goToDetail(props.row.server_id, props.row.service_name, props.row.server.ipv4, props.row.server.vcpus, props.row.server.ram)"
                  class="q-ma-none" :label="props.row.server_id" color="primary" padding="xs" flat dense unelevated>
                </q-btn>
              </div>
            </q-td>
            <q-td key="ipv4" :props="props">{{ props.row.server.ipv4 }}</q-td>
            <q-td key="service_name" :props="props">{{ props.row.service_name }}
            </q-td>
            <q-td key="configuration" :props="props">{{props.row.server.vcpus + '核' + props.row.server.ram / 1024 + 'GB内存' }}
            </q-td>
            <q-td class="text-right" key="total_public_ip_hours" :props="props">{{ props.row.total_public_ip_hours / 24 }}
            </q-td>
            <q-td class="text-left" key="total_cpu_hours" :props="props">{{ props.row.total_cpu_hours / 24 }}
            </q-td>
            <q-td key="total_ram_hours" :props="props">{{ props.row.total_ram_hours / 24 }}</q-td>
            <q-td key="total_disk_hours" :props="props">{{ props.row.total_disk_hours / 24 }}</q-td>
            <q-td key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
            <q-td key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator/>
      <div class="row q-pa-sm text-grey justify-between items-center">
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
.ServerList {
}
</style>
