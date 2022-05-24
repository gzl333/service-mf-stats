<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
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
const activeItem = ref('id')
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
    isDisable.value = false
    navigateToUrl('/my/stats/cloud/list/user')
  } else if (name === 'group') {
    isDisable.value = false
    navigateToUrl('/my/stats/cloud/list/user2')
  } else if (name === 'uuid') {
    isDisable.value = false
    navigateToUrl('/my/stats/cloud/list/user2')
  } else if (name === 'node') {
    isDisable.value = true
    navigateToUrl('/my/stats/cloud/list/user3')
  }
}
const search = async () => {
  if (activeItem.value === 'id') {
    initQuery()
  }
  if (activeItem.value === 'group') {
    initQuery()
  }
  if (activeItem.value === 'uuid') {
    initQuery()
  }
  if (activeItem.value === 'node') {
    initQuery()
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
})

</script>

<template>
  <div class="Search">
        <div class="row q-px-lg q-mt-md q-gutter-x-sm">
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
            <q-btn outline text-color="black" label="导出Excel" class="q-px-lg" @click="exportExcel('用量列表.xlsx')"/>
          </div>
        </div>
        <div class="q-px-lg q-mt-md">
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
        </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.Search {
}
</style>
