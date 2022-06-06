<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
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

// const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const activeItem = ref('user')
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
  if (searchName.value !== '' && searchName.value !== null) {
    query.value.service_id = searchName.value
  } else {
    delete query.value.service_id
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
  sessionStorage.setItem('tabStatus', name)
  if (name === 'service') {
    isDisable.value = true
  } else {
    isDisable.value = false
  }
  navigateToUrl(`/my/stats/statistic/list/cloud/${name}`)
}
onMounted(async () => {
  if (sessionStorage.getItem('tabStatus') != null) {
    activeItem.value = sessionStorage.getItem('tabStatus') || ''
  }
  initSelectYear()
})
</script>

<template>
  <div class="CloudList">
    <div class="row q-px-sm q-mt-md q-gutter-x-sm">
      <div class="col-1">
        <q-select outlined dense v-model="searchQuery.year" :options="yearOptions" label="请选择" @update:model-value="changeYear"/>
      </div>
      <div class="col-1">
        <q-select outlined dense v-model="searchQuery.month" :options="monthOptions" label="请选择"/>
      </div>
      <div class="col-2">
        <q-input outlined dense clearable :disable="isDisable" v-model="searchName" label="请输入"/>
      </div>
      <div class="col-3 row q-gutter-x-xs">
        <q-btn outline text-color="black" label="搜索" class="q-px-xl" @click="search"/>
        <q-btn outline text-color="black" label="导出Excel" class="q-px-lg" @click="exportFile()"/>
      </div>
    </div>
    <div class="row q-px-sm q-mt-md">
      <q-tabs
          v-model="activeItem"
          vertical
          indicator-color="blue-grey"
          class=""
          style="width: 10%"
        >
          <q-tab name="user" @click="changeTab('user')" :class="activeItem === 'user' ? 'bg-blue-5' : ''">
            按用户id显示
          </q-tab>
          <q-tab name="group" @click="changeTab('group')" :class="activeItem === 'group' ? 'bg-blue-5' : ''">
            按项目组id显示
          </q-tab>
          <q-tab name="server" @click="changeTab('server')" :class="activeItem === 'server' ? 'bg-blue-5' : ''">
            按云主机uuid显示
          </q-tab>
          <q-tab name="service" @click="changeTab('service')" :class="activeItem === 'service' ? 'bg-blue-5' : ''">
            按服务节点显示
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
