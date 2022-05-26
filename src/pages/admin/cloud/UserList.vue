<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import emitter from 'boot/mitt'
import { loadingShow, loadingHide } from 'src/hooks/loadingPluugins'
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
const userColumns = [
  {
    name: 'user_id',
    label: 'ID',
    align: 'center'
  },
  {
    name: 'username',
    align: 'center',
    label: '用户'
  },
  {
    name: 'company',
    label: '单位',
    align: 'center'
  },
  {
    name: 'total_original_amount',
    label: '计费金额合计',
    align: 'center'
  },
  {
    name: 'total_trade_amount',
    label: '实际扣费金额合计',
    align: 'center'
  },
  {
    name: 'total_server',
    label: '云主机数量合计',
    align: 'center'
  }
]
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const myDate = new Date()
const year = myDate.getFullYear()
let monthNew: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const userTableRow = ref([])
const getNowFormatDate = () => {
  const seperator1 = '-'
  if (monthNew >= 1 && monthNew <= 9) {
    monthNew = '0' + monthNew
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return year + seperator1 + monthNew + seperator1 + strDate
}
const currentDate = getNowFormatDate()
const query: Record<string, any> = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
emitter.on('user', (value) => {
  query.value = value
  getUserData()
})
const getUserData = async () => {
  loadingShow()
  const data = await store.getUserMachineData(query.value)
  userTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
  loadingHide()
}
const changePageSize = async () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  await getUserData()
}
const changePagination = async (val: number) => {
  loadingShow()
  query.value.page = val
  const data = await store.getUserMachineData(query.value)
  userTableRow.value = data.data.results
  loadingHide()
}
const goToDetail = (userid: string, username: string, count: any) => {
  navigateToUrl(`/my/stats/cloud/user/${userid}`)
  sessionStorage.setItem('username', username)
  sessionStorage.setItem('userCount', count)
}
onMounted(async () => {
  await getUserData()
})
onBeforeUnmount(() => {
  emitter.off('user')
})

</script>
<template>
  <div class="UserList">
    <div class="q-px-sm q-mt-md">
    <q-separator/>
    <q-table
      flat
      id="userTable"
      table-header-class="bg-grey-1 text-grey"
      :rows="userTableRow"
      :columns="userColumns"
      row-key="name"
      color="primary"
      loading-label="网络请求中，请稍候..."
      no-data-label="暂无数据"
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="user_id" :props="props">
            <div class="text">{{ props.row.user_id }}</div>
          </q-td>
          <q-td key="username" :props="props">
            <q-btn
              @click="goToDetail(props.row.user_id, props.row.user.username, props.row.total_server)"
              class="q-ma-none" :label="props.row.user.username" color="primary" padding="xs" flat dense
              unelevated>
            </q-btn>
          </q-td>
          <q-td key="company" :props="props">{{ props.row.user.company === '' ? '暂无' : props.row.user.company }}</q-td>
          <q-td key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
          <q-td key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
          <q-td key="total_server" :props="props">{{ props.row.total_server }}</q-td>
        </q-tr>
      </template>
    </q-table>
    <q-separator/>
    <div class="row q-pa-sm text-grey justify-between items-center">
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
.UserList {
}
</style>
