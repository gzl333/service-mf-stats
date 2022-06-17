<script setup lang="ts">
import { computed, ref, onMounted, Ref } from 'vue'
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
const activeItem: Ref = ref('0')
const balance = ref('')
const tab = ref('mails')
const groupTabs = computed(() => store.getGroupTabs)
const changeTab = async (label: string, voId: string) => {
  activeItem.value = label
  const resData = await store.getGroupBalance(voId)
  balance.value = resData.data.balance
  sessionStorage.setItem('groupTabStatus', label)
}
onMounted(async () => {
  if (store.tables.groupTable.allIds.length === 0) {
    await store.loadGroupTable()
  }
  if (sessionStorage.getItem('groupTabStatus') != null) {
    activeItem.value = sessionStorage.getItem('groupTabStatus') || ''
  }
  const resData = await store.getGroupBalance(store.tables.groupTable.allIds[store.tables.groupTable.allIds.length - 1])
  balance.value = resData.data.balance
})
</script>

<template>
  <div class="GroupIndex">
    <div class="row">
      <q-tabs
        v-model="activeItem"
        vertical
        align="justify"
        active-color="primary"
        active-bg-color="grey-3"
      >
        <q-tab no-caps :name="item.label" class="text-weight-bold" @click="changeTab(item.label, item.voId)" :ripple="false" v-for="(item, index) in groupTabs" :key="index">
          {{item.name}}
        </q-tab>
      </q-tabs>
      <div class="col-10">
        <div class="row q-ml-md items-center">
          <div class="text-subtitle1 text-weight-bold">账户余额</div>
          <div class="text-subtitle1 text-weight-bold q-ml-lg">{{ `${balance}点` }}</div>
          <q-btn outline label="充值" class="q-ml-xl"/>
        </div>
        <div class="row justify-between items-center q-mt-lg q-ml-md">
          <div class="row items-center">
            <div class="text-subtitle1 text-weight-bold">科技云券</div>
            <q-tabs
              v-model="tab"
              narrow-indicator
              dense
              align="justify"
              active-color="primary"
              class="q-ml-md"
            >
              <q-tab :ripple="false" name="mails" label="可用（0）" />
              <q-tab :ripple="false" name="alarms" label="即将到期（0）" />
              <q-tab :ripple="false" name="movies" label="已到期（0）" />
              <q-tab :ripple="false" name="done" label="已用完（0）" />
            </q-tabs>
          </div>
          <div class="row q-gutter-x-md items-center">
            <div class="text-subtitle1">科技云券兑换</div>
            <q-input dense outlined label="输入兑换码" class="q-ml-md"/>
            <q-btn outline label="兑换" class="q-ml-md"/>
          </div>
        </div>
      </div>
    </div>
    <div class="q-mt-xl q-pt-xl text-h6 text-weight-bold row justify-center">
      <div>暂无科技云券</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.GroupIndex {
}
</style>
