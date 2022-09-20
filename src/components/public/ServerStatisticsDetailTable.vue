<script setup lang="ts">
// import { ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
import { useRoute } from 'vue-router'
import { i18n } from 'boot/i18n'
// import PayStatusChip from '../statistic/PayStatusChip.vue'
import { computed } from 'vue'
const props = defineProps({
  tableRow: {
    type: Array,
    required: false
  }
})
// const emits = defineEmits(['change', 'delete'])
// const store = useStore()
const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const columns = computed(() => [
  { name: 'date', align: 'center', label: (() => tc('components.public.ServerStatisticsDetailTable.billing_date'))() },
  // { name: 'payment_status', label: (() => tc('components.public.ServerStatisticsDetailTable.deduction_ststus'))(), align: 'center' },
  { name: 'pay_type', label: (() => tc('components.public.ServerStatisticsDetailTable.payment_method'))(), align: 'center' },
  { name: route.meta.isGroup ? 'vo_name' : 'username', label: route.meta.isGroup ? (() => tc('components.public.ServerStatisticsDetailTable.group'))() : (() => tc('pages.statistic.cloud.ServerUsageDetailList.user'))(), align: 'center' },
  { name: 'public_ip_hours', label: (() => tc('pages.public.ServerUsageDetailList.public_ip'))(), align: 'center' },
  { name: 'cpu_hours', label: (() => tc('vCPU'))(), align: 'center' },
  { name: 'ram_hours', label: (() => tc('components.public.ServerUsageTable.memory'))(), align: 'center' },
  { name: 'disk_hours', label: (() => tc('components.public.ServerUsageTable.local_disk'))(), align: 'center' },
  { name: 'snapshot_hours', label: (() => tc('components.public.ServerStatisticsDetailTable.snapshot'))(), align: 'center' },
  { name: 'original_amount', label: (() => tc('components.public.ServerStatisticsDetailTable.total_billing_amount'))(), align: 'center' },
  { name: 'trade_amount', label: (() => tc('components.public.ServerStatisticsDetailTable.total_amount_of_actual_deduction'))(), align: 'center' }
])
</script>

<template>
  <div class="ServerStatisticsDetailTable">
      <q-table
        flat
        id="serverTable"
        table-header-class="bg-grey-1 text-grey"
        :rows="props.tableRow"
        :columns="columns"
        row-key="name"
        color="primary"
        :loading-label="tc('components.group.GroupTable.notify_loading')"
        :no-data-label="tc('pages.personal.CurrentMonthList.no_data')"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="date" :props="props">{{ props.row.date }}</q-td>
<!--            <q-td key="payment_status" :props="props">-->
<!--              <pay-status-chip class="non-selectable" :status="props.row.payment_status"/>-->
<!--            </q-td>-->
            <q-td key="pay_type" :props="props">{{ props.row.pay_type }}</q-td>
            <q-td v-if="props.row.owner_type === 'user'"  key="username" :props="props">{{ props.row.username }}</q-td>
            <q-td v-if="props.row.owner_type === 'vo'" key="vo_name" :props="props">{{ props.row.vo_name }}</q-td>
            <q-td key="public_ip_hours" :props="props">{{ Math.round(props.row.public_ip_hours / 24) + ' ' + tc('components.public.ServerUsageTable.piece_days') }}</q-td>
            <q-td key="cpu_hours" :props="props">{{ Math.round(props.row.cpu_hours / 24) + ' ' +  tc('components.public.ServerUsageTable.core_day') }}</q-td>
            <q-td key="ram_hours" :props="props">{{ Math.round(props.row.ram_hours / 24) + ' ' + tc('components.public.ServerUsageTable.gb_days') }}</q-td>
            <q-td key="disk_hours" :props="props">{{ Math.round(props.row.disk_hours / 24) + ' ' + tc('components.public.ServerUsageTable.gb_days') }}</q-td>
            <q-td key="snapshot_hours" :props="props">{{ Math.round(props.row.snapshot_hours / 24) + ' ' + tc('components.public.ServerUsageTable.gb_days') }}</q-td>
            <q-td key="original_amount" :props="props">{{ props.row.original_amount }}</q-td>
            <q-td key="trade_amount" :props="props">{{ props.row.trade_amount }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator/>
    </div>
</template>

<style lang="scss" scoped>
.ServerStatisticsDetailTable {
}
</style>
