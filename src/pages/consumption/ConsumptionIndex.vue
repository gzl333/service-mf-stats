<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { navigateToUrl } from 'single-spa'
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
  navigateToUrl(`/my/stats/consumption/${name}`)
}
</script>

<template>
  <div class="ConsumptionIndex">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">{{ tc('云主机用量') }}</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="personal" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('personalServers')"
                   icon="las la-user" @click="changeTab('personal')">
            </q-tab>
            <q-tab no-caps name="group" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('groupServers')"
                   icon="las la-users" @click="changeTab('group')">
            </q-tab>
<!--            <q-tab no-caps name="storage" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('storage')"-->
<!--                   icon="las la-database" @click="changeTab('storage')">-->
<!--            </q-tab>-->
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
.ConsumptionIndex {
}
</style>
