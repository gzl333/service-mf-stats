<script setup lang="ts">
import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'

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
const activeItem = ref(store.items.currentPath[2]) // keep selection when reloading
const changeTab = async (name: string) => {
  activeItem.value = name
  navigateToUrl(`/my/stats/statistic/list/${name}`)
}
</script>

<template>
  <div class="StatisticsIndex">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">{{ tc('manager') }}</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="cloud" class="q-px-none q-py-md q-mr-md" icon="las la-laptop" :label="tc('server')"
                   @click="changeTab('cloud')" :ripple="false">
            </q-tab>
            <q-tab no-caps name="storage" class="q-px-none q-py-md q-mr-md" :label="tc('storage')"
                   icon="las la-memory" @click="changeTab('storage')" :ripple="false">
            </q-tab>
          </q-tabs>
        </div>
      </div>
      <q-separator/>
      <div class="row justify-center">
        <router-view class="content-fixed-width"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.StatisticsIndex {
}
</style>
