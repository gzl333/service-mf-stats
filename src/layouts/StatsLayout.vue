<script setup lang="ts">
import { computed } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
import Breadcrumb from '../components/layout/Breadcrumb.vue'
// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

const store = useStore()
// const router = useRouter()
// const route = useRoute()
const tc = i18n.global.tc
const activeItem = computed(() => store.items.currentPath[0])
const releaseTime = process.env.releaseTime
store.loadAllTables()
</script>

<template>
  <q-layout view="hHh LpR fFf" style="min-width: 1300px;">

    <q-drawer :model-value="true" style="padding-top: 60px;" :breakpoint="0" side="left" width="120" bordered>

      <div class="column full-height bg-grey-2">
        <q-scroll-area class="col non-selectable" visible>

          <q-list>

            <q-item>
              <q-item-section class="column items-center q-py-sm text-center text-weight-bold text-grey-8">
                {{ tc('用量账单') }}
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'home'"
              @click="activeItem = 'home'; navigateToUrl('/my/stats/home')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-home" size="lg"/>
                <div class="active-text text-center">{{ tc('首页') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'cloud' || activeItem === 'host'"
              @click="activeItem = 'cloud'; navigateToUrl(store.items?.fedRole === 'federal-admin' ? '/my/stats/cloud' : '/my/stats/host')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-cloud" size="lg"/>
                <div class="active-text text-center">{{ tc('云主机') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'service2'"
              @click="activeItem = 'service2'; navigateToUrl('/my/stats/service2')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-server" size="lg"/>
                <div class="active-text text-center">{{ tc('服务2') }}</div>
              </q-item-section>
            </q-item>

          </q-list>

          <div class="text-grey text-body2 text-center q-pt-xl">v0.0.1</div>
          <div class="text-grey text-body2 text-center">{{ new Date(releaseTime).toLocaleString() }}</div>
        </q-scroll-area>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
      <q-scroll-area style="height: calc(100vh - 60px)">
        <breadcrumb v-show="activeItem !== 'home'" v-cloak/>
        <router-view/>
      </q-scroll-area>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<style lang="scss" scoped>
.active-item {
  background-color: #DBF0FC; // $grey-4;

  .active-text {
    color: $primary;
  }
}
[v-cloak] {
  display: none !important;
}
</style>
