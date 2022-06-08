<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
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
const activeItem = ref('cloud')
const changeTab = async (name: string) => {
  activeItem.value = name
  sessionStorage.setItem('titleTabStatus', name)
  if (name === 'cloud') {
    if (sessionStorage.getItem('tabStatus') != null) {
      const lastPath = sessionStorage.getItem('tabStatus')
      const routerPath = '/my/stats/statistic/list/cloud/' + lastPath
      navigateToUrl(routerPath)
    } else {
      navigateToUrl(`/my/stats/statistic/list/${name}`)
    }
  } else {
    navigateToUrl(`/my/stats/statistic/list/${name}`)
  }
}
onMounted(async () => {
  if (sessionStorage.getItem('titleTabStatus') != null) {
    activeItem.value = sessionStorage.getItem('titleTabStatus') || ''
  }
})
</script>

<template>
  <div class="StatisticsIndex">
    <div class="q-px-sm">
      <q-tabs
        v-model="activeItem"
        inline-label
        :breakpoint="0"
        align="justify"
        indicator-color="primary"
        active-color="primary"
        style="width: 37.5%"
      >
        <q-tab no-caps name="cloud" class="q-px-none q-py-md q-mr-md text-weight-bold text-subtitle1" icon="las la-laptop" @click="changeTab('cloud')" :ripple="false">
          云主机
        </q-tab>
        <q-tab no-caps name="storage" class="q-px-none q-py-md q-mr-md text-weight-bold text-subtitle1" icon="las la-memory" @click="changeTab('storage')" :ripple="false">
          对象存储
        </q-tab>
      </q-tabs>
      <q-separator/>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.StatisticsIndex {
}
</style>
