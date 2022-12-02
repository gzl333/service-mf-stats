<script setup lang="ts">
import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
const store = useStore()
const activeItem = ref(store.items.currentPath[1])
const changeTab = async (name: string) => {
  activeItem.value = name
  navigateToUrl(`/my/stats/payment/${name}`)
}
</script>

<template>
  <div class="PersonalIndex">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">钱包</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="wallet" class="q-px-none q-py-md q-mr-md" :ripple="false" label="我的钱包"
                   icon="las la-wallet" @click="changeTab('wallet')">
            </q-tab>
            <q-tab no-caps name="history" class="q-px-none q-py-md q-mr-md" :ripple="false" label="支付记录"
                   icon="las la-file-invoice-dollar" @click="changeTab('history')">
            </q-tab>
            <q-tab no-caps name="admin" class="q-px-none q-py-md q-mr-md" :ripple="false" label="管理员"
                   icon="las la-user-cog" @click="changeTab('admin')">
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
