<script setup lang="ts">
import { ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
const props = defineProps({
  topRow: {
    type: Array,
    required: false
  },
  bottomRow: {
    type: Array,
    required: false
  }
})
// console.log(props.bottomRow)
// const emits = defineEmits(['change', 'delete'])

const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const columns = [
  { name: 'server_id', align: 'center', label: 'UUID' },
  { name: 'service_id', label: '服务节点', align: 'center' },
  { name: 'owner_type', label: '用户类型', align: 'center' },
  { name: 'pay_type', label: '结算类型', align: 'center' },
  { name: 'payment_status', label: '状态', align: 'center' }
  // { name: 'user', label: '用户', align: 'center' },
  // { name: 'time', label: '到期时间', align: 'center' }
]
const columnsTwo = [
  { name: 'creation_time', align: 'center', label: '每日统计时间' },
  { name: 'public_ip_hours', label: '公网IP(个)', align: 'center' },
  { name: 'cpu_hours', label: 'vCPU(核*天）', align: 'center' },
  { name: 'ram_hours', label: '内存(GB*天)', align: 'center' },
  { name: 'disk_hours', label: '本地硬盘(GB*天)', align: 'center' },
  { name: 'original_amount', label: '计费金额合计', align: 'center' },
  { name: 'trade_amount', label: '实际扣费金额合计', align: 'center' }
]
const current = ref(3)
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
</script>

<template>
  <div class="UUTable">
    <div class="q-px-lg">
      <q-table
        flat
        table-header-class="bg-grey-1 text-grey"
        :rows="props.topRow"
        :columns="columns"
        row-key="name"
        color="primary"
        loading-label="网络请求中，请稍候..."
        no-data-label="暂无数据"
        hide-pagination
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="server_id" :props="props">{{ props.row.server_id }}</q-td>
            <q-td key="service_id" :props="props">{{ store.tables.serviceTable.byId[props.row.service_id]?.name }}</q-td>
            <q-td key="owner_type" :props="props">{{ props.row.owner_type === 'user' ? '普通用户' : '管理员' }}</q-td>
            <q-td key="pay_type" :props="props">{{ props.row.pay_type === 'postpaid' ? '后付费' : '先付费' }}</q-td>
            <q-td key="payment_status" :props="props">{{ props.row.payment_status === 'paid' ? '已付款' : '未付款' }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator/>
    </div>
    <div class="row">
    <div class="col-12 q-px-lg q-mt-xl">
      <q-table
        flat
        table-header-class="bg-grey-1 text-grey"
        :rows="props.bottomRow"
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
            <q-td key="creation_time" :props="props">{{ props.row.creation_time }}</q-td>
            <q-td key="public_ip_hours" :props="props">{{ props.row.public_ip_hours }}</q-td>
            <q-td key="cpu_hours" :props="props">{{ props.row.cpu_hours }}</q-td>
            <q-td key="ram_hours" :props="props">{{ props.row.ram_hours }}</q-td>
            <q-td key="disk_hours" :props="props">{{ props.row.disk_hours }}</q-td>
            <q-td key="original_amount" :props="props">{{ props.row.original_amount }}</q-td>
            <q-td key="trade_amount" :props="props">{{ props.row.trade_amount }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="row q-pa-sm text-grey justify-between items-center">
        <div class="row items-center">
          <span class="q-pr-md">共{{ paginationTable.count }}条数据</span>
          <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense
                    options-dense
                    borderless @update:model-value="changePageSize">
          </q-select>
          <span>/页</span>
        </div>
        <div class="q-pa-lg flex flex-center">
          <q-pagination
            v-model="current"
            :max="5"
            direction-links
            boundary-links
            icon-first="skip_previous"
            icon-last="skip_next"
            icon-prev="fast_rewind"
            icon-next="fast_forward"
          />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.UUTable {
}
</style>
