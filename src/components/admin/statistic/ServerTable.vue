<script setup lang="ts">
// import { ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import dateFormat from 'src/utils'
const props = defineProps({
  tableRow: {
    type: Array,
    required: false
  }
})
// const emits = defineEmits(['change', 'delete'])

// const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const columnsTwo = [
  { name: 'creation_time', align: 'center', label: '每日统计时间' },
  { name: 'public_ip_hours', label: '公网IP(个*天)', align: 'center' },
  { name: 'cpu_hours', label: 'vCPU(核*天）', align: 'center' },
  { name: 'ram_hours', label: '内存(GB*天)', align: 'center' },
  { name: 'disk_hours', label: '本地硬盘(GB*天)', align: 'center' },
  { name: 'original_amount', label: '计费金额合计', align: 'center' },
  { name: 'trade_amount', label: '实际扣费金额合计', align: 'center' }
]

</script>

<template>
  <div class="ServerTable">
    <div class="q-px-lg q-mt-md">
      <q-table
        flat
        id="serverTable"
        table-header-class="bg-grey-1 text-grey"
        :rows="props.tableRow"
        :columns="columnsTwo"
        row-key="name"
        color="primary"
        loading-label="网络请求中，请稍候..."
        no-data-label="暂无数据"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="creation_time" :props="props">{{ dateFormat(props.row.creation_time) }}</q-td>
            <q-td key="public_ip_hours" :props="props">{{ Math.round(props.row.public_ip_hours / 24) }}</q-td>
            <q-td key="cpu_hours" :props="props">{{ Math.round(props.row.cpu_hours / 24) }}</q-td>
            <q-td key="ram_hours" :props="props">{{ Math.round(props.row.ram_hours / 24) }}</q-td>
            <q-td key="disk_hours" :props="props">{{ Math.round(props.row.disk_hours / 24) }}</q-td>
            <q-td key="original_amount" :props="props">{{ props.row.original_amount }}</q-td>
            <q-td key="trade_amount" :props="props">{{ props.row.trade_amount }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ServerTable {
}
</style>
