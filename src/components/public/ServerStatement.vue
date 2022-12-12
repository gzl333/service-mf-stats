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
  { name: 'id', align: 'center', label: '日计量单编号' },
  { name: 'username', label: '用户', align: 'center' },
  { name: 'vo_name', label: '服务单元', align: 'center' },
  { name: 'service_type', label: '资源类型', align: 'center' },
  { name: 'payment_period', label: '结算周期', align: 'center' },
  { name: 'creation_time', label: '下单时间', align: 'center' },
  { name: 'payable_amount', label: '计费金额', align: 'center' },
  { name: 'trade_amount', label: '日结单金额', align: 'center' },
  { name: 'payment_status', label: '状态', align: 'center' },
  { name: 'operate', label: '操作', align: 'center' }
]
const goToDetail = (id: string) => {
  navigateToUrl(`/my/stats/settlement/detail/${id}`)
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
            <q-td key="id" :props="props" class="text-subtitle1 text-center wrapper"   style="width: 250px;">
              <q-btn class="q-ma-none " :label="props.row.id" color="primary" padding="xs"
                     style="width: 100%;white-space:normal;word-break:break-all;word-wrap:break-word;"
                     @click="goToDetail(props.row.id)"
                     flat dense unelevated></q-btn>
            </q-td>
            <q-td key="username" :props="props">{{ props.row.username}}</q-td>
            <q-td key="vo_name" :props="props">{{ props.row.service.name}}</q-td>
            <q-td key="service_type" :props="props">{{ props.row.service.service_type}}</q-td>
            <q-td key="payment_period" :props="props">{{props.row.date + "  00:00 - 24:00"}}</q-td>
            <q-td key="creation_time" :props="props">{{new Date(props.row.creation_time).toLocaleString()}}</q-td>
            <q-td key="payable_amount" :props="props">{{props.row.payable_amount}} </q-td>
            <q-td key="trade_amount" :props="props">{{props.row.trade_amount}} </q-td>
            <q-td key="payment_status" :props="props">{{props.row.payment_status}} </q-td>
            <q-td key="operate" :props="props" class="text-subtitle1 text-center wrapper" > <q-btn @click="goToDetail(props.row.id)" color="primary"> 详情 </q-btn></q-td>
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
