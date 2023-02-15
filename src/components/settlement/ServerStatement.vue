<script setup lang="ts">
import { navigateToUrl } from 'single-spa'
import { usePaymentStatusExpress } from 'src/hooks/statementKeyToRead'
const PaymentStatusExpress = usePaymentStatusExpress()
import { ref } from 'vue'
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
interface TableDataInterface {
  id: string,
  original_amount: string,
  payable_amount: string,
  trade_amount: string,
  payment_status: string,
  payment_history_id: string,
  date?: string,
  creation_time: string,
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
  {
    // label: 'Dessert (100g serving)',
    // align: 'left',
    field: row => row.name,
    format: val => `${val}`
  },
  { name: 'id', align: 'center', label: '日计量单编号', field: 'id' },
  { name: 'username', label: '用户', field: 'username', align: 'center' },
  { name: 'service_name', label: '服务单元', field: 'service_name', align: 'center' },
  { name: 'service_type', label: '资源类型', field: 'service_type', align: 'center' },
  { name: 'payment_period', label: '结算周期', field: 'payment_period', align: 'center' },
  { name: 'creation_time', label: '下单时间', field: 'creation_time', align: 'center' },
  { name: 'payable_amount', label: '计费金额', field: 'payable_amount', align: 'center' },
  { name: 'trade_amount', label: '日结单金额', field: 'trade_amount', align: 'center' },
  { name: 'payment_status', label: '状态', field: 'payment_status', align: 'center' },
  { name: 'operate', label: '操作', field: 'operate', align: 'center' }
]
// const columns = [
//
//   { name: 'id', align: 'center', label: '日计量单编号', field: row => row.name, format: val=> `${val}` },
//   { name: 'username', label: '用户', align: 'center' },
//   { name: 'vo_name', label: '服务单元', align: 'center' },
//   { name: 'service_type', label: '资源类型', align: 'center' },
//   { name: 'payment_period', label: '结算周期', align: 'center' },
//   { name: 'creation_time', label: '下单时间', align: 'center' },
//   { name: 'payable_amount', label: '计费金额', align: 'center' },
//   { name: 'trade_amount', label: '日结单金额', align: 'center' },
//   { name: 'payment_status', label: '状态', align: 'center' },
//   { name: 'operate', label: '操作', align: 'center' }
// ]

const goToDetail = (id: string, targetType: string) => {
  const target = ref<string>('')
  if (targetType === 'evcloud' || targetType === 'openstack') {
    target.value = 'server'
  }
  if (targetType === 'iharbor') {
    target.value = 'storage'
  }
  navigateToUrl(`/my/stats/settlement/detail/${id}/${target.value}/`)
}

const searchFilter = (rows: TableDataInterface[], content: string): TableDataInterface[] => rows.filter(group =>
  group?.id.toLowerCase().includes(content) || group.service?.id?.toLowerCase().includes(content) || group.service?.name?.toLowerCase().includes(content) || group.service?.service_type?.toLowerCase().includes(content) || group.username?.toLowerCase().includes(content) || group.vo_name?.toLowerCase().includes(content))

import { exportFile, useQuasar } from 'quasar'
// import { exportExcel} from "src/hooks/exportExcel";
// import {i18n} from "boot/i18n";
const $q = useQuasar()

function wrapCsvValue (val: any, formatFn?: any, row?: any) { // todo
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */

  return `"${formatted}"`
}
function exportTable () {
  // todo 导出数据有两列失败需要处理
  // naive encoding to csv format
  const content: any = [columns.map(col => wrapCsvValue(col.label))].concat(props.tableRow.map(row => columns.map(col => wrapCsvValue(
    typeof col.field === 'function'
      ? col.field(row)
      : row[col.field === void 0 ? col.name : col.field],
    col.format,
    row)).join(','))
  ).join('\r\n')
  console.log('props.tableRow', content)
  const status = exportFile(
    'table-export.csv',
    content,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}
</script>

<template>
  <div class="ServerUsageTable">
    <div class="q-mt-lg">
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
        <template v-slot:top-right>
          <q-btn
            color="primary"
            icon-right="archive"
            label="导出当页数据"
            no-caps
            @click="exportTable"
          />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props" class="text-subtitle1 text-center wrapper"   style="width: 250px;">
              <q-btn class="q-ma-none " :label="props.row.id" color="primary" padding="xs"
                     style="width: 100%;white-space:normal;word-break:break-all;word-wrap:break-word;"
                     @click="goToDetail(props.row.id, props.row.service.service_type)"
                     flat dense unelevated></q-btn>
            </q-td>
            <q-td key="username" :props="props" v-if="props.row.username">{{ props.row.username}}</q-td>
<!--            <q-td key="username" :props="props" v-else>{{ props.row.vo_name}}</q-td>-->
            <q-td key="service_name" :props="props" >{{ props.row.service.name}}</q-td>
            <q-td key="service_type" :props="props">{{ props.row.service.service_type}}</q-td>
            <q-td key="payment_period" :props="props">{{props.row.date + "  00:00 - 24:00"}}</q-td>
            <q-td key="creation_time" :props="props">{{new Date(props.row.creation_time).toLocaleString()}}</q-td>
            <q-td key="payable_amount" :props="props">{{props.row.payable_amount}} </q-td>
            <q-td key="trade_amount" :props="props">{{props.row.trade_amount}} </q-td>
            <q-td key="payment_status" :props="props">{{PaymentStatusExpress(props.row.payment_status)}} </q-td>
            <q-td key="operate" :props="props" class="text-subtitle1 text-center wrapper" > <q-btn @click="goToDetail(props.row.id, props.row.service.service_type)" color="primary" > 详情 </q-btn></q-td>
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
