<script setup lang="ts">
import { navigateToUrl } from 'single-spa'
import { usePaymentStatusExpress } from 'src/hooks/statementKeyToRead'
const PaymentStatusExpress = usePaymentStatusExpress()

const props = defineProps({
  tableRow: {
    type: Array,
    required: true
  },
  search: {
    type: String,
    required: false
  }
})
interface TableDataProps {
  id: string,
  original_amount?: string,
  payable_amount?: string,
  trade_amount?: string,
  payment_status?: string,
  payment_history_id?: string,
  date?: string,
  creation_time?: string,
  user_id?: string,
  username?: string,
  vo_id?: string,
  vo_name?: string,
  owner_type?: string,
  service?: {
    id?:string,
    name?: string,
    name_en?: string,
    service_type?: string
  }
}
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

const searchFilter = (rows: TableDataProps[], content: string): TableDataProps[] => rows.filter(group =>
  group?.id.toLowerCase().includes(content) || group.service?.id?.toLowerCase().includes(content) || group.service?.name?.toLowerCase().includes(content) || group.service?.service_type?.toLowerCase().includes(content) || group.username?.toLowerCase().includes(content) || group.vo_name?.toLowerCase().includes(content))
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
        :filter="search"
        :filter-method="searchFilter"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props" class="text-subtitle1 text-center wrapper"   style="width: 250px;">
              <q-btn class="q-ma-none " :label="props.row.id" color="primary" padding="xs"
                     style="width: 100%;white-space:normal;word-break:break-all;word-wrap:break-word;"
                     @click="goToDetail(props.row.id)"
                     flat dense unelevated></q-btn>
            </q-td>
            <q-td key="username" :props="props" v-if="props.row.username">{{ props.row.username}}</q-td>
            <q-td key="vo_name" :props="props" v-else>{{ props.row.vo_name}}</q-td>
            <q-td key="vo_name" :props="props" >{{ props.row.service.name}}</q-td>
            <q-td key="service_type" :props="props">{{ props.row.service.service_type}}</q-td>
            <q-td key="payment_period" :props="props">{{props.row.date + "  00:00 - 24:00"}}</q-td>
            <q-td key="creation_time" :props="props">{{new Date(props.row.creation_time).toLocaleString()}}</q-td>
            <q-td key="payable_amount" :props="props">{{props.row.payable_amount}} </q-td>
            <q-td key="trade_amount" :props="props">{{props.row.trade_amount}} </q-td>
            <q-td key="payment_status" :props="props">{{PaymentStatusExpress(props.row.payment_status)}} </q-td>
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
