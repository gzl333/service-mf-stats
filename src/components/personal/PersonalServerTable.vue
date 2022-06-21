<script setup lang="ts">
// import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'

const props = defineProps({
  tableRow: {
    type: Array,
    required: true
  }
})
// const emits = defineEmits(['change', 'delete'])

// const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const columns = [
  { name: 'ipv4', align: 'center', label: 'ip地址' },
  { name: 'service_name', label: '服务节点', align: 'center' },
  { name: 'configuration', label: '初始配置', align: 'center' },
  { name: 'total_public_ip_hours', label: '公网IP(个)', align: 'center' },
  { name: 'total_cpu_hours', label: 'vCPU(核*天）', align: 'center' },
  { name: 'total_ram_hours', label: '内存(GB*天)', align: 'center' },
  { name: 'total_disk_hours', label: '本地硬盘(GB*天)', align: 'center' },
  { name: 'total_original_amount', label: '计费金额(本月)', align: 'center' },
  { name: 'total_trade_amount', label: '实际扣费金额(本月)', align: 'center' }
]
console.log(props)
const goToDetail = (serverId: string, serviceName: string, ipv4: string, vcpus: string, ram: string) => {
  navigateToUrl(`/my/stats/personal/detail/${serverId}`)
  sessionStorage.setItem('serviceName', serviceName)
  sessionStorage.setItem('ipv4', ipv4)
  sessionStorage.setItem('vcpus', vcpus)
  sessionStorage.setItem('ram', ram)
}
</script>

<template>
  <div class="PersonalServerTable">
    <div class="q-mt-xl">
      <q-table
        id="personalServerTable"
        flat
        table-header-class="bg-grey-1 text-grey"
        :rows="props.tableRow"
        :columns="columns"
        row-key="name"
        color="primary"
        loading-label="网络请求中，请稍候..."
        no-data-label="暂无数据"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="ipv4" :props="props">
              <q-btn class="q-ma-none" :label="props.row.ipv4" color="primary" padding="xs"
                     @click="goToDetail(props.row.server_id, props.row.service_name, props.row.ipv4, props.row.vcpus, props.row.ram)"
                     flat dense unelevated></q-btn>
            </q-td>
            <q-td key="service_name" :props="props">{{ props.row.service_name }}</q-td>
            <q-td key="configuration" :props="props">
              {{ props.row.vcpus + '核' + Math.round(props.row.ram / 1024) + 'GB内存' }}
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PersonalServerTable {
}
</style>
