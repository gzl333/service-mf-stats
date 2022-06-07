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
console.log(store.tables)
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
              :active="activeItem === 'personal'"
              @click="activeItem = 'personal'; navigateToUrl('/my/stats/personal')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-user" size="lg"/>
                <div class="active-text text-center">{{ tc('个人云主机') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'group'"
              @click="activeItem = 'group'; navigateToUrl('/my/stats/group')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-user-friends" size="lg"/>
                <div class="active-text text-center">{{ tc('项目组云主机') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'storage'"
              @click="activeItem = 'storage'; navigateToUrl('/my/stats/storage')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-object-ungroup" size="lg"/>
                <div class="active-text text-center">{{ tc('对象存储') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-if="store.items.fedRole === 'federal-admin' && store.items.vmsAdmin.length > 0"
              :active="activeItem === 'recharge'"
              @click="activeItem = 'recharge'; navigateToUrl('/my/stats/recharge')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-check-circle" size="lg"/>
                <div class="active-text text-center">{{ tc('账户与充值') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-if="store.items.fedRole === 'federal-admin' && store.items.vmsAdmin.length > 0"
              :active="activeItem === 'statistic'"
              @click="activeItem = 'statistic'; navigateToUrl('/my/stats/statistic')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-server" size="lg"/>
                <div class="active-text text-center">{{ tc('用量管理统计') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-if="store.items.fedRole === 'federal-admin' && store.items.vmsAdmin.length > 0"
              :active="activeItem === 'account'"
              @click="activeItem = 'account'; navigateToUrl('/my/stats/account')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-tasks" size="lg"/>
                <div class="active-text text-center">{{ tc('账户管理') }}</div>
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
