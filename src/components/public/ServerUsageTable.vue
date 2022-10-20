<script setup lang="ts">
import { computed } from 'vue'
import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
import { useRoute } from 'vue-router'
import { i18n } from 'boot/i18n'

const props = defineProps({
  tableRow: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: false
  }
})
// const emits = defineEmits(['change', 'delete'])
// const store = useStore()
const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const columns = computed(() => [
  {
    name: 'ipv4',
    align: 'center',
    label: (() => tc('ip'))()
  },
  {
    name: 'service_name',
    label: (() => tc('serviceUnit'))(),
    align: 'center'
  },
  {
    name: 'configuration',
    label: (() => tc('initialConfiguration'))(),
    align: 'center'
  },
  {
    name: 'total_public_ip_hours',
    label: (() => tc('publicIp'))(),
    align: 'center'
  },
  {
    name: 'total_cpu_hours',
    label: (() => tc('vCPU'))(),
    align: 'center'
  },
  {
    name: 'total_ram_hours',
    label: (() => tc('memory'))(),
    align: 'center'
  },
  {
    name: 'total_disk_hours',
    label: (() => tc('localDisk'))(),
    align: 'center'
  },
  {
    name: 'total_original_amount',
    label: (() => tc('billingAmount'))(),
    align: 'center'
  },
  {
    name: 'total_trade_amount',
    label: (() => tc('actualDeductionAmount'))(),
    align: 'center'
  }
])
const goToDetail = (serverId: string, ipv4: string, vcpus: string, ram: string) => {
  if (route.meta.isPersonal) {
    navigateToUrl(`/my/stats/consumption/personal/server/${serverId}?ipv4=${ipv4}&vcpus=${vcpus}&ram=${ram}`)
  } else {
    if (route.meta.type === 'group') {
      navigateToUrl(`/my/stats/statistic/list/detail/${serverId}?ipv4=${ipv4}&vcpus=${vcpus}&ram=${ram}`)
    } else {
      navigateToUrl(`/my/stats/statistic/list/details/${serverId}?ipv4=${ipv4}&vcpus=${vcpus}&ram=${ram}`)
    }
  }
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
      :loading="props.isLoading"
      row-key="name"
      color="primary"
      :loading-label="tc('notifyLoading')"
      :no-data-label="tc('noData')"
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td class="no-padding" key="ipv4" :props="props">
            <q-btn class="q-ma-none" :label="props.row.server.ipv4" color="primary"
                   padding="xs"
                   @click="goToDetail(props.row.server_id, props.row.server.ipv4, props.row.server.vcpus, props.row.server.ram)"
                   flat dense unelevated></q-btn>
          </q-td>
          <q-td key="service_name" :props="props">{{ props.row.service_name }}</q-td>
          <q-td class="no-padding" key="configuration" :props="props">{{props.row.server.vcpus + ' ' + tc('core') + ' ' + Math.round(props.row.server.ram / 1024) + ' GB' }}</q-td>
          <q-td key="total_public_ip_hours" :props="props">{{ Math.round(props.row.total_public_ip_hours / 24) + ' ' + tc('pieceDays') }}</q-td>
          <q-td key="total_cpu_hours" :props="props">{{ Math.round(props.row.total_cpu_hours / 24) + ' ' + tc('coreDay') }}</q-td>
          <q-td key="total_ram_hours" :props="props">{{ Math.round(props.row.total_ram_hours / 24) + ' ' + tc('gbDays') }}</q-td>
          <q-td key="total_disk_hours" :props="props">{{ Math.round(props.row.total_disk_hours / 24) + ' ' + tc('gbDays') }}</q-td>
          <q-td class="no-padding" key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
          <q-td class="no-padding" key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
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
