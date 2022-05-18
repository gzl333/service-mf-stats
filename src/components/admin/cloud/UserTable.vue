<script setup lang="ts">
// import { ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'

const props = defineProps({
  tableRow: {
    type: Array,
    required: true
  }
})
// const emits = defineEmits(['change', 'delete'])

const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const columns = [
  { name: 'service_id', label: '服务节点', style: 'width: 10px', align: 'center' },
  { name: 'payment_status', label: '状态', align: 'center' },
  { name: 'pay_type', label: '结算类型', align: 'center' },
  { name: 'public_ip_hours', label: '公网IP(个)', align: 'center' },
  { name: 'cpu_hours', label: 'vCPU(核*天）', align: 'center' },
  { name: 'ram_hours', label: '内存(GB*天)', align: 'center' },
  { name: 'disk_hours', label: '本地硬盘(GB*天)', align: 'center' },
  { name: 'original_amount', label: '计费金额(总)', align: 'center' },
  { name: 'trade_amount', label: '实际扣费金额合计(总)', align: 'center' }
]
</script>

<template>
  <div class="UserUsageTable">
    <div class="row q-px-lg text-h6 text-bold q-gutter-x-lg">
<!--      <div class="col-2">用户：duyukuan@cnic.cn</div>-->
<!--      <div class="col-2">云主机数量合计：5</div>-->
<!--      <div class="col-2">计费周期：2022.3.1&#45;&#45;至今</div>-->
<!--      <div class="col-2">计费金额合计：2225点</div>-->
<!--      <div class="col-2">实际扣费金额合计：2000点</div>-->
    </div>
    <div class="q-px-lg q-mt-lg">
      <q-table
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
            <q-td key="service_id" :props="props">
              <div class="text-pre-wrap">{{ store.tables.serviceTable.byId[props.row.service_id]?.name }}</div>
            </q-td>
            <q-td key="payment_status" :props="props">{{ props.row.payment_status === 'paid' ? '已付款' : '未付款' }}</q-td>
            <q-td key="pay_type" :props="props">{{ props.row.pay_type === 'postpaid' ? '后付费' : '先付费' }}</q-td>
            <q-td key="public_ip_hours" :props="props">{{ props.row.public_ip_hours }}</q-td>
            <q-td key="cpu_hours" :props="props">{{ props.row.cpu_hours }}</q-td>
            <q-td key="ram_hours" :props="props">{{ props.row.ram_hours }}</q-td>
            <q-td key="disk_hours" :props="props">{{ props.row.disk_hours }}</q-td>
            <q-td key="original_amount" :props="props">{{ props.row.original_amount }}</q-td>
            <q-td key="trade_amount" :props="props">{{ props.row.trade_amount }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.UserUsageTable {
}
</style>
