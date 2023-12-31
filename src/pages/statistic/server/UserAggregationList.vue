<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount, Ref, computed } from 'vue'
// import { useStore } from 'stores/store'
import { navigateToUrl } from 'single-spa'
// import { useRoute, useRouter } from 'vue-router'
import { getNowFormatDate } from 'src/hooks/processTime'
import { i18n } from 'boot/i18n'
import stats from 'src/api'
import emitter from 'boot/mitt'
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
const { tc } = i18n.global
const userColumns = computed(() => [
  // {
  //   name: 'user_id',
  //   label: 'ID',
  //   align: 'center'
  // },
  {
    name: 'username',
    align: 'center',
    label: (() => tc('user'))()
  },
  {
    name: 'company',
    label: (() => tc('company'))(),
    align: 'center'
  },
  {
    name: 'total_original_amount',
    label: (() => tc('totalBillingAmount'))(),
    align: 'center'
  },
  {
    name: 'total_trade_amount',
    label: (() => tc('totalAmountOfActualDeduction'))(),
    align: 'center'
  },
  {
    name: 'total_server',
    label: (() => tc('totalNumberOfServers'))(),
    align: 'center'
  }
])
const isLoading = ref(false)
const myDate = new Date()
const year = myDate.getFullYear()
const userTableRow = ref([])
const currentDate = getNowFormatDate(1)
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
emitter.on('user', async (value) => {
  query.value = value
  paginationTable.value.page = 1
  await getUserAggregationData()
})
const getUserAggregationData = async () => {
  isLoading.value = true
  const respUserMetering = await stats.stats.metering.getAggregationUser({ query: query.value })
  userTableRow.value = respUserMetering.data.results
  paginationTable.value.count = respUserMetering.data.count
  isLoading.value = false
}
const changePageSize = () => {
  query.value.page_size = paginationTable.value.rowsPerPage
  query.value.page = 1
  paginationTable.value.page = 1
  getUserAggregationData()
}
const changePagination = () => {
  query.value.page = paginationTable.value.page
  getUserAggregationData()
}
const goToDetail = (userid: string, username: string, count: string) => {
  navigateToUrl(`/my/stats/statistic/list/user/${userid}?name=${username}&count=${count}`)
}
onBeforeMount(() => {
  getUserAggregationData()
})
onBeforeUnmount(() => {
  emitter.off('user')
})

</script>
<template>
  <div class="UserAggregationList">
    <div class="q-ml-md">
      <q-table
        flat
        id="userTable"
        :loading="isLoading"
        table-header-class="bg-grey-1 text-grey"
        :rows="userTableRow"
        :columns="userColumns"
        row-key="name"
        color="primary"
        :loading-label="tc('notifyLoading')"
        :no-data-label="tc('noData')"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
<!--            <q-td key="user_id" :props="props">-->
<!--              <div class="text">{{ props.row.user_id }}</div>-->
<!--            </q-td>-->
            <q-td key="username" :props="props">
              <q-btn
                @click="goToDetail(props.row.user_id, props.row.user.username, props.row.total_server)"
                class="q-ma-none" :label="props.row.user.username" color="primary" padding="xs" flat dense
                unelevated no-caps>
              </q-btn>
            </q-td>
            <q-td key="company" :props="props">{{
                props.row.user.company === '' ? tc('no_yet') : props.row.user.company
              }}
            </q-td>
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
.UserAggregationList {
}
</style>
