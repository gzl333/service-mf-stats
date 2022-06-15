<script setup lang="ts">
import { ref } from 'vue'
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
const tab = ref('mails')
</script>

<template>
  <div class="PersonalIndex">
    <div class="q-mt-xl">
      <div class="row">
        <div class="text-h6 text-weight-bold">个人账户余额</div>
        <div class="text-h6 q-ml-md">{{ `${store.tables.balanceTable.byId?.balance}点` }}</div>
        <q-btn outline label="充值" class="q-px-lg q-ml-xl"/>
      </div>
      <div class="row justify-between items-center q-mt-lg">
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
          <div class="text-subtitle1">科技云券兑换</div>
          <q-input dense outlined label="输入兑换码" class="col-5"/>
          <q-btn outline label="兑换" class="q-px-md"/>
        </div>
      </div>
      <div class="q-mt-xl q-pt-xl text-h6 text-weight-bold row justify-center">
        <div>暂无科技云券</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PersonalIndex {
}
</style>
