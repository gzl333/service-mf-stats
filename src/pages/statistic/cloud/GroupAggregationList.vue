<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount, Ref, computed } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
import emitter from 'boot/mitt'
import { getNowFormatDate } from 'src/hooks/processTime'
// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

const store = useStore()
// const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const groupColumns = computed(() => [
  // { name: 'vo_id', label: 'ID', align: 'center' },
  { name: 'name', align: 'center', label: (() => tc('groupName'))() },
  { name: 'company', label: (() => tc('company'))(), align: 'center' },
  { name: 'total_original_amount', label: (() => tc('totalBillingAmount'))(), align: 'center' },
  { name: 'total_trade_amount', label: (() => tc('totalAmountOfActualDeduction'))(), align: 'center' },
  { name: 'total_server', label: (() => tc('totalNumberOfServers'))(), align: 'center' }
])
const isLoading = ref(false)
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const myDate = new Date()
const year = myDate.getFullYear()
const groupTableRow = ref([])
const currentDate = getNowFormatDate(1)
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
emitter.on('group', async (value) => {
  query.value = value
  paginationTable.value.page = 1
  await getGroupAggregationData()
})
const getGroupAggregationData = async () => {
  isLoading.value = true
  const data = await store.getGroupMetering(query.value)
  groupTableRow.value = data.data.results
  paginationTable.value.count = data.data.count
  isLoading.value = false
}
const changePageSize = () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  getGroupAggregationData()
}
const changePagination = () => {
  query.value.page = paginationTable.value.page
  getGroupAggregationData()
}
const goToDetail = (userid: string, voName: string, count: string) => {
  navigateToUrl(`/my/stats/statistic/list/group/${userid}?name=${voName}&count=${count}`)
}
onBeforeMount(() => {
  getGroupAggregationData()
})
onBeforeUnmount(() => {
  emitter.off('group')
})

</script>

<template>
  <div class="GroupAggregationList">
    <div class="q-ml-md">
      <q-separator/>
      <q-table
        flat
        id="groupTable"
        :loading="isLoading"
        table-header-class="bg-grey-1 text-grey"
        :rows="groupTableRow"
        :columns="groupColumns"
        row-key="name"
        color="primary"
        :loading-label="tc('notifyLoading')"
        :no-data-label="tc('noData')"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
<!--            <q-td key="vo_id" :props="props">{{ props.row.vo_id }}</q-td>-->
            <q-td key="name" :props="props">
              <q-btn
                @click="goToDetail(props.row.vo_id, props.row.vo.name, props.row.total_server)"
                class="q-ma-none" :label="props.row.vo.name" color="primary" padding="xs" flat dense unelevated>
              </q-btn>
            </q-td>
            <q-td key="company" :props="props">{{ props.row.vo.company }}</q-td>
            <q-td key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
            <q-td key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
            <q-td key="total_server" :props="props">{{ props.row.total_server }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-separator/>
      <div class="row text-grey justify-between items-center q-mt-md">
        <div class="row items-center">
          <span class="q-pr-md" v-if="i18n.global.locale === 'zh'">共{{ paginationTable.count }}条数据</span>
          <span class="q-pr-md" v-else>{{ paginationTable.count }} pieces of data in total</span>
          <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense options-dense
                    borderless @update:model-value="changePageSize">
          </q-select>
          <span>/{{ tc('page') }}</span>
        </div>
        <q-pagination
          v-model="paginationTable.page"
          :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
          :max-pages="9"
          direction-links
          outline
          :ripple="false"
          @click="changePagination"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.GroupAggregationList {
}
</style>
