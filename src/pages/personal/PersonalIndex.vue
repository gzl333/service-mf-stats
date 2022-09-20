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
const { tc } = i18n.global
// const route = useRoute()
// const router = useRouter()
const activeItem = ref(store.items.currentPath[1])
const changeTab = (name: string) => {
  activeItem.value = name
  navigateToUrl(`/my/stats/personal/${name}`)
}
</script>

<template>
  <div class="PersonalIndex">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">{{ tc('pages.personal.PersonalIndex.personal_servers') }}</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="current" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('pages.personal.PersonalIndex.current_month_data')"
                   icon="las la-digital-tachograph" @click="changeTab('current')">
            </q-tab>
            <q-tab no-caps name="last" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('pages.personal.PersonalIndex.last_month_data')"
                   icon="las la-calendar" @click="changeTab('last')">
            </q-tab>
            <q-tab no-caps name="history" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('pages.personal.PersonalIndex.history_data')"
                   icon="las la-history" @click="changeTab('history')">
            </q-tab>
          </q-tabs>
        </div>
      </div>
      <q-separator/>
      <div class="row justify-center">
        <router-view class="content-fixed-width" :key="$route.fullPath"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PersonalIndex {
}
</style>
