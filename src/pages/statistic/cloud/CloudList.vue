<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import { exportExcel } from 'src/hooks/exportExcel'
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
// const tc = i18n.global.tc
const activeItem = ref(store.items.currentPath[3])
const isDisable = ref(false)
const myDate = new Date()
const year = myDate.getFullYear()
const month = myDate.getMonth() + 1
let monthNew: number | string = myDate.getMonth() + 1
let strDate: number | string = myDate.getDate()
const searchName = ref('')
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
const monthOptions: Ref = ref([])
const yearOptions: Ref = ref([])
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
const query: Ref = ref({
  page: 1,
  page_size: 10,
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true
})
const exportQuery: Ref = ref({
  date_start: year + '-' + '01-01',
  date_end: currentDate,
  'as-admin': true,
  download: true
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
const changeYear = (val: Record<string, number>) => {
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
const exportFile = () => {
  // name表示生成excel的文件名     tableName表示表格的id
  if (activeItem.value === 'user') {
    exportExcel('用户用量列表.xlsx', '#userTable')
  } else if (activeItem.value === 'group') {
    exportExcel('项目组用量列表.xlsx', '#groupTable')
  } else if (activeItem.value === 'server') {
    exportExcel('云主机用量列表.xlsx', '#serverTable')
  } else if (activeItem.value === 'service') {
    exportExcel('服务用量列表.xlsx', '#serviceTable')
  }
}
const exportAll = async () => {
  if (activeItem.value === 'user') {
    const fileData = await store.getUserHostFile(exportQuery.value)
    const link = document.createElement('a')
    const blob = new Blob(['\ufeff' + fileData.data], { type: 'text/csv,charset=UTF-8' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.download = fileData.headers['content-disposition']
    link.download = '按用户计量计费聚合统计'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else if (activeItem.value === 'group') {
    const fileData = await store.getGroupHostFile(exportQuery.value)
    const link = document.createElement('a')
    const blob = new Blob(['\ufeff' + fileData.data], { type: 'text/csv,charset=UTF-8' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.download = fileData.headers['content-disposition']
    link.download = '按项目组计量计费聚合统计'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else if (activeItem.value === 'server') {
    const fileData = await store.getServerHostFile(exportQuery.value)
    const link = document.createElement('a')
    const blob = new Blob(['\ufeff' + fileData.data], { type: 'text/csv,charset=UTF-8' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.download = fileData.headers['content-disposition']
    link.download = '按云主机计量计费聚合统计'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else if (activeItem.value === 'service') {
    const fileData = await store.getServiceHostFile(exportQuery.value)
    const link = document.createElement('a')
    const blob = new Blob(['\ufeff' + fileData.data], { type: 'text/csv,charset=UTF-8' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.download = fileData.headers['content-disposition']
    link.download = '按服务计量计费聚合统计'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
      value: 0
    }
  }
  searchName.value = ''
  query.value.date_start = searchQuery.value.year.value + '-01-01'
  query.value.date_end = currentDate
  exportQuery.value.date_start = searchQuery.value.year.value + '-01-01'
  exportQuery.value.date_end = currentDate
  changeYear(searchQuery.value.year)
  sessionStorage.setItem('tabStatus', name)
  if (name === 'service') {
    isDisable.value = true
  } else {
    isDisable.value = false
  }
  navigateToUrl(`/my/stats/statistic/list/cloud/${name}`)
}
onMounted(async () => {
  initSelectYear()
})
</script>

<template>
  <div class="CloudList">
    <div class="row q-mt-xl justify-between items-center">
      <div class="row col-6">
        <div class="col-2">
          <q-select outlined dense v-model="searchQuery.year" :options="yearOptions" label="请选择" @update:model-value="changeYear"/>
        </div>
        <div class="col-2 q-ml-md">
          <q-select outlined dense v-model="searchQuery.month" :options="monthOptions" label="请选择"/>
        </div>
        <div class="col-4 q-ml-md">
          <q-input outlined dense clearable :disable="isDisable" v-model="searchName" label="搜索服务"/>
        </div>
        <div class="col-2 q-ml-md">
          <q-btn outline label="搜索" class="q-px-lg" @click="search"/>
        </div>
      </div>
      <div class="col-3 q-gutter-x-md">
        <q-btn outline label="导出当页数据" @click="exportFile()"/>
        <q-btn outline label="导出全部数据" @click="exportAll"/>
      </div>
    </div>
    <div class="row q-mt-md">
      <q-tabs
        v-model="activeItem"
        vertical
        align="justify"
        active-color="primary"
        active-bg-color="grey-3"
        style="width: 8.4%"
      >
        <q-tab no-caps name="server" class="q-pl-none text-weight-bold" @click="changeTab('server')" :ripple="false">
          按云主机uuid
        </q-tab>
        <q-tab no-caps name="service"  class="q-pl-none text-weight-bold" @click="changeTab('service')" :ripple="false">
          按服务节点
        </q-tab>
        <q-tab no-caps name="group"  class="q-pl-none text-weight-bold" @click="changeTab('group')" :ripple="false">
          按项目组id
        </q-tab>
        <q-tab no-caps name="user"  class="q-pl-none text-weight-bold" @click="changeTab('user')" :ripple="false">
          按用户id
        </q-tab>
      </q-tabs>
      <div style="width: 90%">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.CloudList {
}
</style>
