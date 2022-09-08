<script setup lang="ts">
import { computed } from 'vue'
import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute } from 'vue-router'
import { i18n } from 'boot/i18n'

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
const { tc } = i18n.global
const columns = computed(() => [
  {
    name: 'ipv4',
    align: 'center',
    label: (() => tc('ip地址'))()
  },
  {
    name: 'service_name',
    label: (() => tc('服务单元'))(),
    align: 'center'
  },
  {
    name: 'configuration',
    label: (() => tc('初始配置'))(),
    align: 'center'
  },
  {
    name: 'total_public_ip_hours',
    label: (() => tc('公网IP'))(),
    align: 'center'
  },
  {
    name: 'total_cpu_hours',
    label: (() => tc('vCPU'))(),
    align: 'center'
  },
  {
    name: 'total_ram_hours',
    label: (() => tc('内存'))(),
    align: 'center'
  },
  {
    name: 'total_disk_hours',
    label: (() => tc('本地硬盘'))(),
    align: 'center'
  },
  {
    name: 'total_original_amount',
    label: (() => tc('计费金额'))(),
    align: 'center'
  },
  {
    name: 'total_trade_amount',
    label: (() => tc('实际扣费金额'))(),
    align: 'center'
  }
])
const goToDetail = (serverId: string, serviceName: string, ipv4: string, vcpus: string, ram: string) => {
  navigateToUrl(`/my/stats/personal/detail/${serverId}?service=${serviceName}&ipv4=${ipv4}&vcpus=${vcpus}&ram=${ram}`)
}
</script>

<template>
  <div class="ServerUsageTable">
    <q-table
      id="ServerUsageTable"
      flat
      table-header-class="bg-grey-1 text-grey"
      :rows="props.tableRow"
      :columns="columns"
      row-key="name"
      color="primary"
      :loading-label="tc('网络请求中，请稍候...')"
      :no-data-label="tc('暂无数据')"
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="ipv4" :props="props">
            <q-btn class="q-ma-none" :label="props.row.server.ipv4" color="primary"
                   padding="xs"
                   @click="goToDetail(props.row.server_id, props.row.service_name, props.row.server.ipv4, props.row.server.vcpus, props.row.server.ram)"
                   flat dense unelevated></q-btn>
          </q-td>
          <q-td key="service_name" :props="props">{{ props.row.service_name }}</q-td>
          <q-td key="configuration" :props="props">{{
              props.row.server.vcpus + ' ' + tc('核') + ' ' + Math.round(props.row.server.ram / 1024) + ' GB'
            }}
          </q-td>
          <q-td key="total_public_ip_hours" :props="props">{{ Math.round(props.row.total_public_ip_hours / 24) + ' ' + tc('(个*天)') }}</q-td>
          <q-td key="total_cpu_hours" :props="props">{{ Math.round(props.row.total_cpu_hours / 24) + ' ' + tc('(核*天）') }}</q-td>
          <q-td key="total_ram_hours" :props="props">{{ Math.round(props.row.total_ram_hours / 24) + ' ' + tc('(GB*天)') }}</q-td>
          <q-td key="total_disk_hours" :props="props">{{ Math.round(props.row.total_disk_hours / 24) + ' ' + tc('(GB*天)') }}</q-td>
          <q-td key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
          <q-td key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
        </q-tr>
      </template>
    </q-table>
    <q-separator/>
  </div>
</template>

<style lang="scss" scoped>
.ServerUsageTable {
}
</style>
