<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['title'])

const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const activeItem = ref('id')
const userColumns = [
  { name: 'user_id', label: 'ID', align: 'center' },
  { name: 'username', align: 'center', label: '用户' },
  { name: 'company', label: '单位', align: 'center' },
  { name: 'total_original_amount', label: '计费金额合计', align: 'center' },
  { name: 'total_trade_amount', label: '实际扣费金额合计', align: 'center' },
  { name: 'total_server', label: '云主机数量合计', align: 'center' }
]
const groupColumns = [
  { name: 'vo_id', label: 'ID', align: 'center' },
  { name: 'name', align: 'center', label: '项目组名称' },
  { name: 'company', label: '单位', align: 'center' },
  { name: 'total_original_amount', label: '计费金额合计', align: 'center' },
  { name: 'total_trade_amount', label: '实际扣费金额合计', align: 'center' },
  { name: 'total_server', label: '云主机数量合计', align: 'center' }
]
const serverColumns = [
  { name: 'server_id', label: '云主机uuid', align: 'center' },
  { name: 'ipv4', align: 'center', label: 'ip地址' },
  { name: 'service_name', label: '服务节点', align: 'center' },
  { name: 'configuration', label: '初始配置', align: 'center' },
  { name: 'total_public_ip_hours', label: '公网IP(个)', align: 'center' },
  { name: 'total_cpu_hours', label: 'vCPU(核*天）', align: 'center' },
  { name: 'total_ram_hours', label: '内存(GB*天)', align: 'center' },
  { name: 'total_disk_hours', label: '本地硬盘(GB*天)', align: 'center' },
  { name: 'total_original_amount', label: '计费金额(总)', align: 'center' }
]
const serviceColumns = [
  { name: 'service_id', label: 'ID', align: 'center' },
  { name: 'name', align: 'center', label: '服务节点' },
  { name: 'total_original_amount', label: '计费金额合计', align: 'center' },
  { name: 'total_trade_amount', label: '实际扣费金额合计', align: 'center' },
  { name: 'total_server', label: '云主机数量合计', align: 'center' }
]
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
const myDate = new Date()
const year = myDate.getFullYear()
const month = myDate.getMonth() + 1
let monthNew: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const searchName = ref('')
const serverTableRow = ref([])
const userTableRow = ref([])
const groupTableRow = ref([])
const serviceTableRow = ref([])
const searchQuery = ref({
  year: {
    label: year,
    value: year
  },
  month: {
    label: '全年',
    value: 0
  }
})
const monthOptions: any = ref([])
const yearOptions: any = ref([])
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
const initSelectYear = () => {
  monthOptions.value.push({
    value: 0,
    label: '全年'
  })
  for (let i = 2021; i <= year; i++) {
    yearOptions.value.push({
      value: i,
      label: i
    })
  }
  for (let i = 1; i <= month; i++) {
    monthOptions.value.push({
      value: i,
      label: i + '月'
    })
  }
}
const changeYear = (val: any) => {
  monthOptions.value = []
  searchQuery.value.month = {
    label: '全年',
    value: 0
  }
  monthOptions.value.push({
    value: 0,
    label: '全年'
  })
  if (val.value === year) {
    for (let i = 1; i <= month; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月'
      })
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月'
      })
    }
  }
}
const initQuery = () => {
  query.value.page = 1
  let dateStart = ''
  let dateEnd = ''
  if (searchQuery.value.year.value === year) {
    if (searchQuery.value.month.value === 0) {
      dateStart = year + '-' + '01-01'
      dateEnd = currentDate
    } else if (searchQuery.value.month.value === month) {
      dateStart = year + '-' + monthNew + '-' + '01'
      dateEnd = currentDate
    } else {
      const day = new Date(searchQuery.value.year.value, searchQuery.value.month.value, 0).getDate()
      if (searchQuery.value.month.value < 10) {
        dateStart = year + '-' + '0' + searchQuery.value.month.value + '-' + '01'
        dateEnd = year + '-' + '0' + searchQuery.value.month.value + '-' + day
      } else {
        dateStart = year + '-' + searchQuery.value.month.value + '-' + '01'
        dateEnd = year + '-' + searchQuery.value.month.value + '-' + day
      }
    }
  } else {
    if (searchQuery.value.month.value === 0) {
      dateStart = searchQuery.value.year.value + '-' + '01-01'
      dateEnd = searchQuery.value.year.value + '-' + '12-31'
    } else {
      const day = new Date(searchQuery.value.year.value, searchQuery.value.month.value, 0).getDate()
      if (searchQuery.value.month.value < 10) {
        dateStart = searchQuery.value.year.value + '-' + '0' + searchQuery.value.month.value + '-' + '01'
        dateEnd = searchQuery.value.year.value + '-' + '0' + searchQuery.value.month.value + '-' + day
      } else {
        dateStart = searchQuery.value.year.value + '-' + searchQuery.value.month.value + '-' + '01'
        dateEnd = searchQuery.value.year.value + '-' + searchQuery.value.month.value + '-' + day
      }
    }
  }
  query.value.date_start = dateStart
  query.value.date_end = dateEnd
  if (searchName.value !== '' && searchName.value !== null) {
    query.value.service_id = searchName.value
  } else {
    delete query.value.service_id
  }
}
const getUserData = async () => {
  const data = await store.getUserMachineData(query.value)
  userTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
}
const getGroupData = async () => {
  const data = await store.getVoMachineData(query.value)
  groupTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
}
const getServerData = async () => {
  const data = await store.getUUMachineData(query.value)
  serverTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
}
const getServiceData = async () => {
  const data = await store.getServiceData(query.value)
  serviceTableRow.value = data.data.results
  paginationTable.value.page = 1
  paginationTable.value.count = data.data.count
}
const changeTab = async (name: string) => {
  activeItem.value = name
  searchQuery.value = {
    year: {
      label: year,
      value: year
    },
    month: {
      label: '全年',
      value: 0
    }
  }
  searchName.value = ''
  query.value.date_start = searchQuery.value.year.value + '-' + monthNew + '-' + '01'
  query.value.date_end = currentDate
  changeYear(searchQuery.value.year)
  if (name === 'id') {
    await getUserData()
  } else if (name === 'group') {
    await getGroupData()
  } else if (name === 'uuid') {
    await getServerData()
  } else if (name === 'node') {
    await getServiceData()
  }
}
const search = async () => {
  if (activeItem.value === 'id') {
    initQuery()
    await getUserData()
  }
  if (activeItem.value === 'group') {
    initQuery()
    await getGroupData()
  }
  if (activeItem.value === 'uuid') {
    initQuery()
    await getServerData()
  }
  if (activeItem.value === 'node') {
    initQuery()
    await getServiceData()
  }
}
// const changePageSize = async () => {
//   query.value.page_size = paginationTable.value.rowsPerPage
//   query.value.page = 1
//   paginationTable.value.page = 1
//   const data = await store.getUUMachineData(query.value)
//   serverTableRow.value = data.data.results
// }
const changePagination = async (val: number) => {
  if (activeItem.value === 'uuid') {
    query.value.page = val
    const data = await store.getUUMachineData(query.value)
    serverTableRow.value = data.data.results
  } else if (activeItem.value === 'id') {
    query.value.page = val
    const data = await store.getUserMachineData(query.value)
    userTableRow.value = data.data.results
  } else if (activeItem.value === 'group') {
    query.value.page = val
    const data = await store.getVoMachineData(query.value)
    groupTableRow.value = data.data.results
  } else if (activeItem.value === 'node') {
    query.value.page = val
    const data = await store.getServiceData(query.value)
    serviceTableRow.value = data.data.results
  }
}
const exportExcel = (name: string) => {
  // name表示生成excel的文件名     tableName表示表格的id
  let id = ''
  if (activeItem.value === 'id') {
    id = '#userTable'
  } else if (activeItem.value === 'group') {
    id = '#groupTable'
  } else if (activeItem.value === 'uuid') {
    id = '#uuTable'
  } else if (activeItem.value === 'node') {
    id = '#nodeTable'
  }
  const sel = XLSX.utils.table_to_book(document.querySelector(id))
  const selIn = XLSX.write(sel, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(new Blob([selIn], { type: 'application/octet-stream' }), name)
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, selIn)
  }
  return selIn
}
onMounted(async () => {
  initSelectYear()
  const data = await store.getUserMachineData(query.value)
  userTableRow.value = data.data.results
  paginationTable.value.count = data.data.count
})
</script>

<template>
  <div class="ServiceList">
    <div class="row q-px-lg q-mt-md q-gutter-x-sm">
      <div class="col-1">
        <q-select outlined dense v-model="searchQuery.year" :options="yearOptions" label="请选择" @update:model-value="changeYear"/>
      </div>
      <div class="col-1">
        <q-select outlined dense v-model="searchQuery.month" :options="monthOptions" label="请选择"/>
      </div>
      <div class="col-2">
        <q-input outlined dense clearable v-model="searchName" label="请输入"/>
      </div>
      <div class="col-3 row q-gutter-x-xs">
        <q-btn outline text-color="black" label="搜索" class="q-px-xl" @click="search"/>
        <q-btn outline text-color="black" label="导出Excel" class="q-px-lg" @click="exportExcel('用量列表.xlsx')"/>
      </div>
    </div>
    <div class="q-px-lg q-mt-md items-center">
      <q-tabs
        v-model="activeItem"
        inline-label
        :breakpoint="0"
        align="justify"
        indicator-color="blue-grey"
        class="shadow-2"
        style="width: 65%"
      >
        <q-tab name="id" @click="changeTab('id')" :class="activeItem === 'id' ? 'bg-blue-4' : 'bg-grey-4'">
          按用户id显示
        </q-tab>
        <q-tab name="group" @click="changeTab('group')" :class="activeItem === 'group' ? 'bg-blue-4' : 'bg-grey-4'">
          按项目组id显示
        </q-tab>
        <q-tab name="uuid" @click="changeTab('uuid')" :class="activeItem === 'uuid' ? 'bg-blue-4' : 'bg-grey-4'">
          按云主机uuid显示
        </q-tab>
        <q-tab name="node" @click="changeTab('node')" :class="activeItem === 'node' ? 'bg-blue-4' : 'bg-grey-4'">
          按服务节点显示
        </q-tab>
      </q-tabs>
      <q-tab-panels v-model="activeItem" animated>
        <q-tab-panel name="id">
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
                <q-td key="user_id" :props="props">{{ props.row.user_id }}</q-td>
                <q-td key="username" :props="props">
                  <q-btn
                    @click="navigateToUrl(`/my/stats/cloud/userUsage/${props.row.user_id}`)"
                    class="q-ma-none" :label="props.row.user.username" color="primary" padding="xs" flat dense
                    unelevated>
                  </q-btn>
                </q-td>
                <q-td key="company" :props="props">{{ props.row.user.company }}</q-td>
                <q-td key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
                <q-td key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
                <q-td key="total_server" :props="props">{{ props.row.total_server }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="group">
          <q-table
            flat
            id="groupTable"
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
                    @click="navigateToUrl(`/my/stats/cloud/groupUsage/${props.row.vo_id}`)"
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
        </q-tab-panel>
        <q-tab-panel name="uuid">
          <q-separator/>
          <q-table
            flat
            id="uuTable"
            table-header-class="bg-grey-1 text-grey"
            :rows="serverTableRow"
            :columns="serverColumns"
            row-key="name"
            color="primary"
            loading-label="网络请求中，请稍候..."
            no-data-label="暂无数据"
            hide-pagination
            :pagination="{ rowsPerPage: 0 }"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="server_id" :props="props">
                  <div class="text-center">
                    <q-btn
                      @click="navigateToUrl(`/my/stats/cloud/uuUsage/${props.row.server_id}`)"
                      class="q-ma-none" :label="props.row.server_id" color="primary" padding="xs" flat dense unelevated>
                    </q-btn>
                  </div>
                </q-td>
                <q-td key="ipv4" :props="props">
                  <div class="text-center">{{ props.row.server.ipv4 }}</div>
                </q-td>
                <q-td key="service_name" :props="props">
                  <div class="text-center">{{ props.row.service_name }}</div>
                </q-td>
                <q-td key="configuration" :props="props">
                  <div class="text-center">{{
                      props.row.server.vcpus + '核' + props.row.server.ram / 1024 + 'GB内存'
                    }}
                  </div>
                </q-td>
                <!--              <q-td key="state" :props="props">-->
                <!--                <div class="text-center">{{ props.row.state }}</div>-->
                <!--              </q-td>-->
                <!--              <q-td key="settlementType" :props="props">-->
                <!--                <div class="text-center">{{ props.row.settlementType }}</div>-->
                <!--              </q-td>-->
                <!--              <q-td key="user" :props="props">-->
                <!--                <div class="text-center">{{ props.row.user }}</div>-->
                <!--              </q-td>-->
                <!--                    <q-td class="text-left text-justify" key="totalUseTime" :props="props">-->
                <!--                      <div class="text-center">{{ (props.row.total_public_ip_hours + props.row.total_cpu_hours + props.row.total_ram_hours + props.row.total_disk_hours + props.row.total_original_amount) / 24 }}</div>-->
                <!--                    </q-td>-->
                <q-td class="text-right" key="total_public_ip_hours" :props="props">
                  <div class="text-center">{{ props.row.total_public_ip_hours / 24 }}</div>
                </q-td>
                <q-td class="text-left" key="total_cpu_hours" :props="props">
                  <div class="text-center">{{ props.row.total_cpu_hours / 24 }}</div>
                </q-td>
                <q-td key="total_ram_hours" :props="props">
                  <div class="text-center">{{ props.row.total_ram_hours / 24 }}</div>
                </q-td>
                <q-td key="total_disk_hours" :props="props">
                  <div class="text-center">{{ props.row.total_disk_hours / 24 }}</div>
                </q-td>
                <q-td key="total_original_amount" :props="props">
                  <div class="text-center">{{ props.row.total_original_amount }}</div>
                </q-td>
                <!--              <q-td key="billAmount" :props="props">-->
                <!--                <div class="text-center">{{ props.row.billAmount }}</div>-->
                <!--              </q-td>-->
                <!--              <q-td key="totalActualDeductionAmount" :props="props">-->
                <!--                <div class="text-center">{{ props.row.totalActualDeductionAmount }}</div>-->
                <!--              </q-td>-->
              </q-tr>
            </template>
          </q-table>
          <q-separator/>
        </q-tab-panel>
        <q-tab-panel name="node">
          <q-table
            flat
            id="nodeTable"
            table-header-class="bg-grey-1 text-grey"
            :rows="serviceTableRow"
            :columns="serviceColumns"
            row-key="name"
            color="primary"
            loading-label="网络请求中，请稍候..."
            no-data-label="暂无数据"
            hide-pagination
            :pagination="{ rowsPerPage: 0 }"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="service_id" :props="props">{{ props.row.service_id }}</q-td>
                <q-td key="name" :props="props">
                  <q-btn
                    @click="navigateToUrl(`/my/stats/cloud/nodeUsage/${props.row.service_id}`)"
                    class="q-ma-none" :label="props.row.service.name" color="primary" padding="xs" flat dense unelevated>
                  </q-btn>
                </q-td>
                <q-td key="total_original_amount" :props="props">{{ props.row.total_original_amount }}</q-td>
                <q-td key="total_trade_amount" :props="props">{{ props.row.total_trade_amount }}</q-td>
                <q-td key="total_server" :props="props">{{ props.row.total_server }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
      <div class="row q-pa-sm text-grey justify-between items-center">
        <div class="row items-center">
          <span class="q-pr-md">共{{ paginationTable.count }}条数据</span>
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
.ServiceList {
}
</style>
