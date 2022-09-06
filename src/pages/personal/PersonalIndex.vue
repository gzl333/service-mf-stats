<script setup lang="ts">
import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
// import { navigateToUrl } from 'single-spa'
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
const changeTab = async (name: string) => {
  activeItem.value = name
  navigateToUrl(`/my/stats/personal/${name}`)
}
</script>

<template>
  <div class="PersonalIndex">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">{{ tc('个人云主机') }}</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="month" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('本月数据')"
                   icon="las la-digital-tachograph" @click="changeTab('month')">
            </q-tab>
            <q-tab no-caps name="last" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('上月数据')"
                   icon="las la-calendar" @click="changeTab('last')">
            </q-tab>
            <q-tab no-caps name="history" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('历史数据')"
                   icon="las la-history" @click="changeTab('history')">
            </q-tab>
          </q-tabs>
        </div>
      </div>
      <q-separator/>
      <div class="row justify-center q-pt-xl">
        <router-view class="content-fixed-width"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PersonalIndex {
}
</style>
