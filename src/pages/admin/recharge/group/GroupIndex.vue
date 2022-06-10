<script setup lang="ts">
import { computed, ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
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
// const tc = i18n.global.tc
const activeItem = ref(0)
const tab = ref('mails')
const groupTabs = computed(() => store.getGroupTabs)
</script>

<template>
  <div class="GroupIndex">
    <div class="q-px-lg q-py-lg row">
      <q-tabs
        v-model="activeItem"
        vertical
        align="justify"
        active-color="primary"
        active-bg-color="grey-3"
        style="width: 8.4%"
      >
        <q-tab no-caps :name="item.label" class="text-weight-bold" @click="changeTab(item.name)" :ripple="false" v-for="(item, index) in groupTabs" :key="index">
          {{item.name}}
        </q-tab>
      </q-tabs>
      <div class="col-10">
        <div class="row q-ml-xl">
          <div class="text-h6 text-weight-bold">账户余额</div>
          <div class="text-h6 q-ml-xl">{{ `0点` }}</div>
          <q-btn outline label="充值" class="q-px-lg q-ml-xl"/>
        </div>
        <div class="row justify-between items-center q-mt-lg q-ml-xl">
          <div class="row items-center">
            <div class="text-h6 text-weight-bold">科技云券</div>
            <q-tabs
              v-model="tab"
              narrow-indicator
              dense
              align="justify"
              active-color="primary"
              class="q-ml-xl"
            >
              <q-tab :ripple="false" name="mails" label="可用（0）" />
              <q-tab :ripple="false" name="alarms" label="即将到期（0）" />
              <q-tab :ripple="false" name="movies" label="已到期（0）" />
              <q-tab :ripple="false" name="done" label="已用完（0）" />
            </q-tabs>
          </div>
          <div class="row col-4 q-gutter-x-md items-center">
            <div class="text-subtitle1">科技云券兑换入口</div>
            <q-input dense outlined label="输入兑换码" class="col-5"/>
            <q-btn outline label="兑换" class="q-px-md"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.GroupIndex {
}
</style>
