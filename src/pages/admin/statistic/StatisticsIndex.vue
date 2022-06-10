<script setup lang="ts">
import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
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

const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const activeItem = ref(store.items.currentPath[2]) // keep selection when reloading
const changeTab = async (name: string) => {
  activeItem.value = name
  if (name === 'cloud') {
    console.log(sessionStorage.getItem('tabStatus'))
    if (sessionStorage.getItem('tabStatus') != null) {
      console.log(11)
      const lastPath = sessionStorage.getItem('tabStatus')
      const routerPath = '/my/stats/statistic/list/cloud/' + lastPath
      navigateToUrl(routerPath)
    } else {
      console.log(222)
      navigateToUrl(`/my/stats/statistic/list/${name}`)
    }
  } else {
    navigateToUrl(`/my/stats/statistic/list/${name}`)
  }
}
</script>

<template>
  <div class="StatisticsIndex">
    <div class="q-mt-md">
    <q-tabs
      v-model="activeItem"
      inline-label
      :breakpoint="0"
      align="justify"
      indicator-color="primary"
      active-color="primary"
      style="width: 41%"
    >
      <q-tab no-caps name="cloud" class="q-px-none q-py-md q-mr-md text-weight-bold text-subtitle1" icon="las la-laptop"
             @click="changeTab('cloud')" :ripple="false">
        云主机
      </q-tab>
      <q-tab no-caps name="storage" class="q-px-none q-py-md q-mr-md text-weight-bold text-subtitle1"
             icon="las la-memory" @click="changeTab('storage')" :ripple="false">
        对象存储
      </q-tab>
    </q-tabs>
    <q-separator/>
    <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.StatisticsIndex {
}
</style>
