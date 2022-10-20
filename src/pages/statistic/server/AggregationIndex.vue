<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { useStore, DateInterface } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import { navigateToUrl } from 'single-spa'
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

const store = useStore()
// const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const serviceOptions = computed(() => store.getServices('all'))
const activeItem = ref(store.items.currentPath[3])
const isDisable = ref(false)
const searchName = ref('')
const myDate = new Date()
const year = myDate.getFullYear()
// 该变量用于作比较判断
const month = myDate.getMonth() + 1
let currentMonth: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const monthOptions = ref<DateInterface[]>([])
const yearOptions = ref<DateInterface[]>([])
const getNowFormatDate = () => {
  const seperator1 = '-'
  if (currentMonth >= 1 && currentMonth <= 9) {
    currentMonth = '0' + currentMonth
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return year + seperator1 + currentMonth + seperator1 + strDate
}
const currentDate = getNowFormatDate()
const serviceId = ref({
  label: '全部服务',
  labelEn: 'All Services',
  value: ''
})
const dateQuery = ref({
  year: {
    label: year,
    value: year
  },
  month: {
    label: '全年',
    labelEn: 'Annual',
    value: 0
  }
})
const searchQuery = ref<Record<string, string | number | boolean>>({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
const exportQuery = ref<Record<string, string | boolean>>({
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true,
  download: true
})
const monthArray = ['January', 'february', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const initSelectYear = () => {
  monthOptions.value.push({
    value: 0,
    label: '全年',
    labelEn: 'Annual'
  })
  for (let i = 2021; i <= year; i++) {
    yearOptions.value.unshift({
      value: i,
      label: i
    })
  }
  for (let i = 1; i <= month; i++) {
    monthOptions.value.push({
      value: i,
      label: i + '月',
      labelEn: monthArray[i - 1]
    })
  }
}
const changeYear = (val: Record<string, number>) => {
  monthOptions.value = []
  dateQuery.value.month = {
    label: '全年',
    labelEn: 'Annual',
    value: 0
  }
  monthOptions.value.push({
    value: 0,
    label: '全年',
    labelEn: 'Annual'
  })
  if (val.value === year) {
    for (let i = 1; i <= month; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月',
        labelEn: monthArray[i - 1]
      })
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      monthOptions.value.push({
        value: i,
        label: i + '月',
        labelEn: monthArray[i - 1]
      })
    }
  }
}
const initQuery = () => {
  searchQuery.value.page = 1
  let dateStart = ''
  let dateEnd = ''
  if (dateQuery.value.year.value === year) {
    if (dateQuery.value.month.value === 0) {
      dateStart = year + '-' + '01-01'
      dateEnd = currentDate
    } else if (dateQuery.value.month.value === month) {
      dateStart = year + '-' + currentMonth + '-' + '01'
      dateEnd = currentDate
    } else {
      const day = new Date(dateQuery.value.year.value, dateQuery.value.month.value, 0).getDate()
      if (dateQuery.value.month.value < 10) {
        dateStart = year + '-' + '0' + dateQuery.value.month.value + '-' + '01'
        dateEnd = year + '-' + '0' + dateQuery.value.month.value + '-' + day
      } else {
        dateStart = year + '-' + dateQuery.value.month.value + '-' + '01'
        dateEnd = year + '-' + dateQuery.value.month.value + '-' + day
      }
    }
  } else {
    if (dateQuery.value.month.value === 0) {
      dateStart = dateQuery.value.year.value + '-' + '01-01'
      dateEnd = dateQuery.value.year.value + '-' + '12-31'
    } else {
      const day = new Date(dateQuery.value.year.value, dateQuery.value.month.value, 0).getDate()
      if (dateQuery.value.month.value < 10) {
        dateStart = dateQuery.value.year.value + '-' + '0' + dateQuery.value.month.value + '-' + '01'
        dateEnd = dateQuery.value.year.value + '-' + '0' + dateQuery.value.month.value + '-' + day
      } else {
        dateStart = dateQuery.value.year.value + '-' + dateQuery.value.month.value + '-' + '01'
        dateEnd = dateQuery.value.year.value + '-' + dateQuery.value.month.value + '-' + day
      }
    }
  }
  searchQuery.value.date_start = dateStart
  searchQuery.value.date_end = dateEnd
  exportQuery.value.date_start = dateStart
  exportQuery.value.date_end = dateEnd
}
const selectService = (val: Record<string, string>) => {
  if (val.value !== '') {
    searchQuery.value.service_id = val.value
    exportQuery.value.service_id = val.value
  } else {
    delete searchQuery.value.service_id
    delete exportQuery.value.service_id
  }
}
const search = async () => {
  if (activeItem.value === 'user') {
    initQuery()
    emitter.emit('user', searchQuery.value)
  }
  if (activeItem.value === 'group') {
    initQuery()
    emitter.emit('group', searchQuery.value)
  }
  if (activeItem.value === 'server') {
    initQuery()
    emitter.emit('server', searchQuery.value)
  }
  if (activeItem.value === 'service') {
    initQuery()
    emitter.emit('service', searchQuery.value)
  }
}
const changeTab = async (name: string) => {
  if (searchQuery.value.service_id) {
    delete searchQuery.value.service_id
  }
  activeItem.value = name
  dateQuery.value = {
    year: {
      label: year,
      value: year
    },
    month: {
      label: '全年',
      labelEn: 'Annual',
      value: 0
    }
  }
  serviceId.value = {
    label: '全部服务',
    labelEn: 'All Services',
    value: ''
  }
  searchName.value = ''
  searchQuery.value.date_start = dateQuery.value.year.value + '-01-01'
  searchQuery.value.date_end = currentDate
  exportQuery.value.date_start = dateQuery.value.year.value + '-01-01'
  exportQuery.value.date_end = currentDate
  changeYear(dateQuery.value.year)
  name === 'service' ? isDisable.value = true : isDisable.value = false
  navigateToUrl(`/my/stats/statistic/list/cloud/${name}`)
}
// 导出当页数据
const exportFile = () => {
  const date = new Date()
  // name表示生成excel的文件名     tableName表示表格的id
  if (activeItem.value === 'user') {
    exportExcel(i18n.global.locale === 'zh' ? '用户用量列表-' + date.toLocaleTimeString() + '.xlsx' : 'User Usage List-' + date.toLocaleTimeString() + '.xlsx', '#userTable')
  } else if (activeItem.value === 'group') {
    exportExcel(i18n.global.locale === 'zh' ? '项目组用量列表-' + date.toLocaleTimeString() + '.xlsx' : 'Group Usage List-' + date.toLocaleTimeString() + '.xlsx', '#groupTable')
  } else if (activeItem.value === 'server') {
    exportExcel(i18n.global.locale === 'zh' ? '云主机用量列表-' + date.toLocaleTimeString() + '.xlsx' : 'Servers Usage List-' + date.toLocaleTimeString() + '.xlsx', '#serverTable')
  } else if (activeItem.value === 'service') {
    exportExcel(i18n.global.locale === 'zh' ? '服务用量列表-' + date.toLocaleTimeString() + '.xlsx' : 'service Usage List-' + date.toLocaleTimeString() + '.xlsx', '#serviceTable')
  }
}
// 导出全部数据
const exportAll = async () => {
  const date = new Date()
  if (activeItem.value === 'user') {
    const fileData = await stats.stats.metering.getAggregationUser({ query: exportQuery.value })
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '按用户计量计费聚合统计' + date.toLocaleTimeString() : 'Aggregate Statistics Of Metering By User-' + date.toLocaleTimeString())
  } else if (activeItem.value === 'group') {
    const fileData = await stats.stats.metering.getAggregationVo({ query: exportQuery.value })
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '按项目组计量计费聚合统计' + date.toLocaleTimeString() : 'Aggregate Statistics Of Metering By Group-' + date.toLocaleTimeString())
  } else if (activeItem.value === 'server') {
    const fileData = await stats.stats.metering.getAggregationServer({ query: exportQuery.value })
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '按云主机计量计费聚合统计' + date.toLocaleTimeString() : 'Aggregate Statistics Of Metering By Server-' + date.toLocaleTimeString())
  } else if (activeItem.value === 'service') {
    const fileData = await stats.stats.metering.getAggregationService({ query: exportQuery.value })
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '按服务计量计费聚合统计' + date.toLocaleTimeString() : 'Aggregate Statistics Of Metering By Service-' + date.toLocaleTimeString())
  }
}
onBeforeMount(async () => {
  initSelectYear()
  activeItem.value === 'service' ? isDisable.value = true : isDisable.value = false
})
</script>

<template>
  <div class="AggregationIndex">
    <div class="row q-mt-xl justify-between items-center">
      <div class="row col-7 items-center">
        <div class="col-2">
          <q-select outlined dense v-model="dateQuery.year" :options="yearOptions" :label="tc('pleaseSelect')" @update:model-value="changeYear" />
        </div>
        <div class="col-2 q-ml-md">
          <q-select outlined dense v-model="dateQuery.month" :options="monthOptions" :label="tc('pleaseSelect')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        </div>
        <div class="col-4 q-ml-md">
          <q-select outlined dense v-model="serviceId" :options="serviceOptions" @update:model-value="selectService" :disable="isDisable"
                    :label="tc('filterService')" class="col-8" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        </div>
        <div class="col-2 q-ml-md">
          <q-btn class="q-px-lg q-py-sm" color="primary" no-caps :label="tc('search')" @click="search"/>
        </div>
      </div>
      <div class="col-4 row justify-end">
        <q-btn class="q-py-sm" color="primary" no-caps :label="tc('exportCurrentPageData')" @click="exportFile()"/>
        <q-btn color="primary" class="q-ml-sm"  no-caps :label="tc('exportAllData')" @click="exportAll"/>
      </div>
    </div>
    <div class="row q-mt-md">
      <q-tabs
        v-model="activeItem"
        vertical
        align="justify"
        active-color="primary"
        active-bg-color="grey-3"
        style="width: 10%"
        @update:model-value="changeTab"
      >
        <q-tab no-caps name="server" class="text-weight-bold" :ripple="false">
          {{ tc('byServersUuid') }}
        </q-tab>
        <q-tab no-caps name="service"  class="text-weight-bold" :ripple="false">
          {{ tc('byServiceUnit') }}
        </q-tab>
        <q-tab no-caps name="group"  class="text-weight-bold" :ripple="false">
          {{ tc('byGroupId') }}
        </q-tab>
        <q-tab no-caps name="user"  class="text-weight-bold" :ripple="false">
          {{ tc('byUserId') }}
        </q-tab>
      </q-tabs>
      <div style="width: 90%">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.AggregationIndex {
}
</style>
