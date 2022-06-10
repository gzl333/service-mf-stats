<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, Ref } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
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
// const tc = i18n.global.tc
const groupColumns = [
  { name: 'vo_id', label: 'ID', align: 'center' },
  { name: 'name', align: 'center', label: '项目组名称' },
  { name: 'company', label: '单位', align: 'center' },
  { name: 'total_original_amount', label: '计费金额合计', align: 'center' },
  { name: 'total_trade_amount', label: '实际扣费金额合计', align: 'center' },
  { name: 'total_server', label: '云主机数量合计', align: 'center' }
]
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
  await getGroupData()
})
const getGroupData = async () => {
  isLoading.value = true
  const data = await store.getGroupHostData(query.value)
  groupTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
  isLoading.value = false
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getGroupData()
}
const changePagination = async (val: number) => {
  isLoading.value = true
  query.value.page = val
  const data = await store.getGroupHostData(query.value)
  groupTableRow.value = data.data.results
  isLoading.value = false
}
const goToDetail = (userid: string, voName: string, count: string) => {
  navigateToUrl(`/my/stats/statistic/group/${userid}`)
  sessionStorage.setItem('voName', voName)
  sessionStorage.setItem('groupCount', count)
}
onMounted(async () => {
  await getGroupData()
})
onBeforeUnmount(() => {
  emitter.off('group')
})

</script>

<template>
  <div class="GroupList">
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
        loading-label="网络请求中，请稍候..."
        no-data-label="暂无数据"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="vo_id" :props="props">{{ props.row.vo_id }}</q-td>
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
          <span class="q-pr-md">共{{ paginationTable.count }}条数据</span>
          <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense options-dense
                    borderless @update:model-value="changePageSize">
          </q-select>
          <span>/页</span>
        </div>
        <q-pagination
          v-model="paginationTable.page"
          :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
          :max-pages="9"
          direction-links
          outline
          :ripple="false"
          @update:model-value="changePagination"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.GroupList {
}
</style>
