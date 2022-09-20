<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
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
const { tc } = i18n.global
const activeItem = ref(store.items.currentPath[1])
const changeTab = (name: string) => {
  activeItem.value = name
  navigateToUrl('/my/stats/group')
}
</script>

<template>
  <div class="GroupIndex">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">{{ tc('pages.group.GroupIndex.group_servers') }}</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="current" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('pages.group.GroupIndex.group_list')" icon="las la-digital-tachograph"  @click="changeTab">
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
.GroupIndex {
}
</style>
