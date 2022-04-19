<script setup lang="ts">
import { ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'

// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

// const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const columns2 = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'center'
  },
  { name: 'teamName', align: 'center', label: '项目组名称' },
  { name: 'company', label: '单位', style: 'width: 10px', align: 'center' },
  { name: 'department', label: '部门', align: 'center' },
  { name: 'totalBillAount', label: '计费金额合计', align: 'center' },
  { name: 'totalActualDeductionAmount', label: '实际扣费金额合计', align: 'center' },
  { name: 'totalvirtualMachines', label: '云主机数量合计', align: 'center' },
  { name: 'operation', label: '操作', align: 'center' }
]
const rows2 = [
  {
    id: 'Frozen Yogurt',
    teamName: 159,
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Ice cream sandwich',
    teamName: 237,
    company: 9.0,
    department: 37,
    totalBillAount: 4.3,
    totalActualDeductionAmount: 129,
    totalvirtualMachines: '8%',
    operation: '1%'
  },
  {
    id: 'Eclair',
    teamName: 262,
    company: 16.0,
    department: 23,
    totalBillAount: 6.0,
    totalActualDeductionAmount: 337,
    totalvirtualMachines: '6%',
    operation: '7%'
  },
  {
    id: 'Cupcake',
    teamName: 305,
    company: 3.7,
    department: 67,
    totalBillAount: 4.3,
    totalActualDeductionAmount: 413,
    totalvirtualMachines: '3%',
    operation: '8%'
  },
  {
    id: 'Gingerbread',
    teamName: 356,
    company: 16.0,
    department: 49,
    totalBillAount: 3.9,
    totalActualDeductionAmount: 327,
    totalvirtualMachines: '7%',
    operation: '16%'
  },
  {
    id: 'Frozen Yogurt',
    teamName: 159,
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Frozen Yogurt',
    teamName: 159,
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Frozen Yogurt',
    teamName: 159,
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Frozen Yogurt',
    teamName: 159,
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  },
  {
    id: 'Frozen Yogurt',
    teamName: 159,
    company: 6.0,
    department: 24,
    totalBillAount: 4.0,
    totalActualDeductionAmount: 87,
    totalvirtualMachines: '14%',
    operation: '1%'
  }
]
const current = ref(3)
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
</script>

<template>
  <div class="ServiceListByGroupId">
    <div class="q-px-lg q-mt-md">
      <div>
        <q-table
          flat
          table-header-class="bg-grey-1 text-grey"
          :rows="rows2"
          :columns="columns2"
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
                {{ props.row.id }}
              </q-td>
              <q-td key="teamName" :props="props">
                {{ props.row.teamName }}
              </q-td>
              <q-td key="company" :props="props">
                <div class="text-pre-wrap">{{ props.row.company }}</div>
              </q-td>
              <q-td key="department" :props="props">
                {{ props.row.department }}
              </q-td>
              <q-td key="totalBillAount" :props="props">{{ props.row.totalBillAount }}</q-td>
              <q-td key="totalActualDeductionAmount" :props="props">{{ props.row.totalActualDeductionAmount }}</q-td>
              <q-td key="totalvirtualMachines" :props="props">{{ props.row.totalvirtualMachines }}</q-td>
              <q-td key="operation" :props="props">{{ props.row.operation }}</q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="row q-pa-sm text-grey justify-between items-center">
          <div class="row items-center">
            <span class="q-pr-md">共{{ paginationTable.count }}台云主机</span>
            <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[5,10,15,20,25,30]" dense
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
.ServiceListByGroupId {
}
</style>
