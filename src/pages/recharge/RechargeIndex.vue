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
// const { tc } = i18n.global

const activeItem = ref(store.items.currentPath[1]) // keep selection when reloading
const changeTab = async (name: string) => {
  activeItem.value = name
  navigateToUrl(`/my/stats/recharge/${name}`)
}
</script>

<template>
  <div class="RechargeIndex">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">账户与充值</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="personal" class="q-px-none q-py-md q-mr-md" :ripple="false" label="个人账户"
                   icon="las la-user-circle" @click="changeTab('personal')">
            </q-tab>
            <q-tab no-caps name="group" class="q-px-none q-py-md q-mr-md" :ripple="false" label="项目组账户"
                   icon="las la-people-carry" @click="changeTab('group')">
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
.RechargeIndex {
}
</style>
