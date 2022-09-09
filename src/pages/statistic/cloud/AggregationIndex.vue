<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useStore, DateInterface } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
import { exportExcel, exportAllData } from 'src/hooks/exportExcel'
import emitter from 'boot/mitt'
import { navigateToUrl } from 'single-spa'
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
const activeItem = ref(store.items.currentPath[3])
const isDisable = ref(false)
const myDate = new Date()
const year = myDate.getFullYear()
// 该变量用于作比较判断
const month = myDate.getMonth() + 1
let currentMonth: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const monthArray = ['January', 'february', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const searchName = ref('')
const searchQuery = ref({
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
const query = ref<Record<string, string | number | boolean>>({
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
  searchQuery.value.month = {
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
  query.value.page = 1
  let dateStart = ''
  let dateEnd = ''
  if (searchQuery.value.year.value === year) {
    if (searchQuery.value.month.value === 0) {
      dateStart = year + '-' + '01-01'
      dateEnd = currentDate
    } else if (searchQuery.value.month.value === month) {
      dateStart = year + '-' + currentMonth + '-' + '01'
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
  exportQuery.value.date_start = dateStart
  exportQuery.value.date_end = dateEnd
  if (searchName.value !== '' && searchName.value !== null) {
    query.value.service_id = searchName.value
    exportQuery.value.service_id = searchName.value
  } else {
    delete query.value.service_id
    delete exportQuery.value.service_id
  }
}
const search = async () => {
  if (activeItem.value === 'user') {
    initQuery()
    emitter.emit('user', query.value)
  }
  if (activeItem.value === 'group') {
    initQuery()
    emitter.emit('group', query.value)
  }
  if (activeItem.value === 'server') {
    initQuery()
    emitter.emit('server', query.value)
  }
  if (activeItem.value === 'service') {
    initQuery()
    emitter.emit('service', query.value)
  }
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
    const fileData = await store.getUserMetering(exportQuery.value)
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '按用户计量计费聚合统计' + date.toLocaleTimeString() : 'Aggregate Statistics Of Metering By User-' + date.toLocaleTimeString())
  } else if (activeItem.value === 'group') {
    const fileData = await store.getGroupMetering(exportQuery.value)
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '按项目组计量计费聚合统计' + date.toLocaleTimeString() : 'Aggregate Statistics Of Metering By Group-' + date.toLocaleTimeString())
  } else if (activeItem.value === 'server') {
    const fileData = await store.getServerMetering(exportQuery.value)
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '按云主机计量计费聚合统计' + date.toLocaleTimeString() : 'Aggregate Statistics Of Metering By Server-' + date.toLocaleTimeString())
  } else if (activeItem.value === 'service') {
    const fileData = await store.getServiceMetering(exportQuery.value)
    exportAllData(fileData.data, i18n.global.locale === 'zh' ? '按服务计量计费聚合统计' + date.toLocaleTimeString() : 'Aggregate Statistics Of Metering By Service-' + date.toLocaleTimeString())
  }
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
      labelEn: 'Annual',
      value: 0
    }
  }
  searchName.value = ''
  query.value.date_start = searchQuery.value.year.value + '-01-01'
  query.value.date_end = currentDate
  exportQuery.value.date_start = searchQuery.value.year.value + '-01-01'
  exportQuery.value.date_end = currentDate
  changeYear(searchQuery.value.year)
  if (name === 'service') {
    isDisable.value = true
  } else {
    isDisable.value = false
  }
  navigateToUrl(`/my/stats/statistic/list/cloud/${name}`)
}
onBeforeMount(async () => {
  initSelectYear()
})
</script>

<template>
  <div class="AggregationIndex">
    <div class="row q-mt-xl justify-between items-center">
      <div class="row col-7 items-center">
        <div class="col-2">
          <q-select outlined dense v-model="searchQuery.year" :options="yearOptions" :label="tc('请选择')" @update:model-value="changeYear" />
        </div>
        <div class="col-2 q-ml-md">
          <q-select outlined dense v-model="searchQuery.month" :options="monthOptions" :label="tc('请选择')" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'"/>
        </div>
        <div class="col-4 q-ml-md">
          <q-input outlined dense clearable :disable="isDisable" v-model="searchName" :label="tc('搜索服务')"/>
        </div>
        <div class="col-2 q-ml-md">
          <q-btn outline no-caps :label="tc('搜索')" class="q-px-lg" @click="search"/>
        </div>
      </div>
      <div class="col-4 row justify-end">
        <q-btn outline no-caps :label="tc('导出当页数据')" @click="exportFile()"/>
        <q-btn class="q-ml-sm" outline no-caps :label="tc('导出全部数据')" @click="exportAll"/>
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
      >
        <q-tab no-caps name="server" class="text-weight-bold" @click="changeTab('server')" :ripple="false">
          {{ tc('按云主机uuid') }}
        </q-tab>
        <q-tab no-caps name="service"  class="text-weight-bold" @click="changeTab('service')" :ripple="false">
          {{ tc('按服务单元') }}
        </q-tab>
        <q-tab no-caps name="group"  class="text-weight-bold" @click="changeTab('group')" :ripple="false">
          {{ tc('按项目组id') }}
        </q-tab>
        <q-tab no-caps name="user"  class="text-weight-bold" @click="changeTab('user')" :ripple="false">
          {{ tc('按用户id') }}
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
