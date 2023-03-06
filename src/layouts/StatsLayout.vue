<script setup lang="ts">
import { computed } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import { i18n } from 'boot/i18n'

const store = useStore()
const { tc } = i18n.global
const activeItem = computed(() => store.items.currentPath[0])
const releaseTime = process.env.releaseTime
store.loadAllItems()
store.loadAllTables()
console.log(store.items)
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
                {{ tc('usageBilling') }}
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'consumption'"
              @click="activeItem = 'consumption'; navigateToUrl('/my/stats/consumption')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-columns" size="lg"/>
                <div class="active-text text-center">{{ tc('consumption') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'settlement'"
              @click="activeItem = 'settlement'; navigateToUrl('/my/stats/settlement')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-tasks" size="lg"/>
                <div class="active-text text-center">{{ tc('dailySettlement') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-if="store.items.fedRole === 'federal-admin' || store.items.vmsAdmin.length > 0"
              :active="activeItem === 'statistic'"
              @click="activeItem = 'statistic'; navigateToUrl('/my/stats/statistic')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="manage_accounts" size="lg"/>
                <div class="active-text text-center">{{ tc('manager') }}</div>
              </q-item-section>
            </q-item>

          </q-list>

          <div class="row justify-center q-pt-lg">
            <q-icon class="text-center" name="info" color="grey-5" size="xs">
              <q-tooltip class="bg-grey-3">
                <div class="text-grey text-caption text-center">{{ tc('releaseTime') }}</div>
                <div class="text-grey text-caption text-center">
                  {{ new Date(releaseTime).toLocaleString(i18n.global.locale) }}
                </div>
              </q-tooltip>
            </q-icon>
          </div>
        </q-scroll-area>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <q-scroll-area style="height: calc(100vh - 60px)">
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
</style>
