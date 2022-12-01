<script setup lang="ts">
import { navigateToUrl } from 'single-spa'
import { serverPayRecordUtcToBeijing } from 'src/hooks/processTime'

const props = defineProps({
  tableRow: {
    type: Array,
    required: true
  }
})

const columns = [
  { name: 'id', align: 'center', label: '支付记录编号' },
  { name: 'amounts', label: '支付金额', align: 'center' },
  { name: 'remark', label: '支付类型', align: 'center' },
  { name: 'subject', label: '支付资源类型', align: 'center' },
  { name: 'payment_method', label: '支付方式', align: 'center' },
  { name: 'payment_time', label: '支付时间', align: 'center' },
  { name: 'order_id', label: '关联订单', align: 'center' }
]
const goToDetail = (id: string, orderId: string) => {
  navigateToUrl(`/my/stats/payment/detail/${id}?order_id=${orderId}`)
}
</script>

<template>
  <div class="ServerUsageTable">
    <div class="q-mt-xl">
      <q-table
        id="ServerUsageTable"
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
            <q-td key="id" :props="props">
              <q-btn class="q-ma-none" :label="props.row.id" color="primary" padding="xs"
                     @click="goToDetail(props.row.id,props.row.order_id)"
                     flat dense unelevated></q-btn>
            </q-td>
            <q-td key="amounts" :props="props">{{ props.row.coupon_amount+"点"}}</q-td>
            <q-td key="remark" :props="props">{{props.row.remark}}</q-td>
            <q-td key="subject" :props="props">{{ props.row.resource_type === 'vm' ? '云主机' : ''}}</q-td>
            <q-td key="payment_method" :props="props">{{ props.row.payment_method === 'coupon' ? '代金卷支付' : '余额支付'}}</q-td>
            <q-td key="payment_time" :props="props">{{ serverPayRecordUtcToBeijing(props.row.payment_time) }}</q-td>
            <q-td key="order_id" :props="props">{{props.row.order_id}} </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ServerUsageTable {
}
</style>
