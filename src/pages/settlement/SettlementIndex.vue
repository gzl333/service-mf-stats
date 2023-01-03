<script setup lang="ts">
import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
const store = useStore()
const activeItem = ref(store.items.currentPath[1])
const changeTab = async (name: string) => {
  activeItem.value = name
  navigateToUrl(`/my/stats/settlement/${name}`)
}
</script>

<template>
  <div class="PersonalIndex">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">日计量单</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="history" class="q-px-none q-py-md q-mr-md" :ripple="false" label="用户日计量单"
                   icon="las la-file-invoice-dollar" @click="changeTab('history')">
            </q-tab>
            <q-tab no-caps name="group" class="q-px-none q-py-md q-mr-md" :ripple="false" label="项目组日计量单"
                   icon="las la-file-invoice-dollar" @click="changeTab('group')">
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
