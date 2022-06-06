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
  navigateToUrl(`/my/stats/statistic/list/${name}`)
  sessionStorage.setItem('titleTabStatus', name)
}
onMounted(async () => {
  if (sessionStorage.getItem('titleTabStatus') != null) {
    activeItem.value = sessionStorage.getItem('titleTabStatus') || ''
  }
})
</script>

<template>
  <div class="StatisticsIndex">
    <div class="q-px-sm q-mt-md">
      <q-tabs
        v-model="activeItem"
        inline-label
        :breakpoint="0"
        align="justify"
        active-color="white"
        active-bg-color="blue-8"
        indicator-color="blue-grey"
        style="width: 40%"
      >
        <q-tab name="cloud" @click="changeTab('cloud')" :style="activeItem === 'cloud' ? '' : 'border: 1px solid grey'">
          云主机
        </q-tab>
        <q-tab name="storage" @click="changeTab('storage')" :style="activeItem === 'storage' ? '' : 'border: 1px solid grey'">
          对象存储
        </q-tab>
      </q-tabs>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.StatisticsIndex {
}
</style>
