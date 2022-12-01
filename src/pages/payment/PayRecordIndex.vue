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
          <div class="text-h6 q-pt-lg q-px-none">支付记录</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="month" class="q-px-none q-py-md q-mr-md" :ripple="false" label="云主机"
                   icon="las la-laptop" @click="changeTab('history')">
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
