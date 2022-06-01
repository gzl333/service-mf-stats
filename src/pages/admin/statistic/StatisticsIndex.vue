<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
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
  console.log(activeItem.value)
  navigateToUrl(`/my/stats/statistic/${name}`)
}
onBeforeUnmount(() => {
  sessionStorage.removeItem('tabStatus')
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
        indicator-color="blue-grey"
        class="shadow-2"
        style="width: 40%"
      >
        <q-tab name="cloud" @click="changeTab('cloud')" :class="activeItem === 'cloud' ? 'bg-blue-4' : 'bg-grey-4'">
          云主机
        </q-tab>
        <q-tab name="storage" @click="changeTab('storage')" :class="activeItem === 'storage' ? 'bg-blue-4' : 'bg-grey-4'">
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
