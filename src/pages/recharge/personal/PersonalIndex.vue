<script setup lang="ts">
import { computed, ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import dateFormat from 'src/utils'
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
const tab = ref('available')
const cachArrs = computed(() => store.getCashByTime())
console.log(cachArrs)
</script>

<template>
  <div class="PersonalIndex">
    <div>
      <div class="row items-center">
        <div class="text-subtitle1 text-weight-bold">个人账户余额</div>
        <div class="text-subtitle1 text-weight-bold q-ml-md">{{ `${store.tables.balanceTable.byId?.balance}点` }}</div>
        <q-btn outline label="充值" class="q-ml-xl"/>
      </div>
      <div class="row justify-between items-center q-mt-lg">
        <div class="row items-center">
          <div class="text-subtitle1 text-weight-bold">科技云券</div>
          <q-tabs
            v-model="tab"
            narrow-indicator
            dense
            align="center"
            active-color="primary"
            class="q-ml-lg"
          >
            <q-tab :ripple="false" name="available">
              <div>{{`可用（${cachArrs.length}）`}}</div>
            </q-tab>
            <q-tab :ripple="false" name="wait" label="即将到期（0）" />
            <q-tab :ripple="false" name="cancelled" label="已到期（0）" />
            <q-tab :ripple="false" name="deleted" label="已用完（0）" />
          </q-tabs>
        </div>
        <div class="row col-4 q-gutter-x-md items-center">
          <div class="text-subtitle1">科技云券兑换</div>
          <q-input dense outlined label="输入兑换码" class="col-5"/>
          <q-btn outline label="兑换"/>
        </div>
      </div>
      <div class="row justify-between q-mt-xl">
        <div class="col-5 q-mt-lg" v-for="(item, index) in cachArrs" :key="index">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6 text-weight-bold text-center">{{store.tables.serviceTable.byId[item.service]?.name}}</div>
            </q-card-section>
            <q-card-section class="text-center text-subtitle1">
              <span class="text-weight-bold">{{ item.face_value }}</span>
              <span>{{ `(剩余${item.balance}点)` }}</span>
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <div class="text-subtitle1 text-center">
              {{`${dateFormat(item.effective_time)} ~ ${dateFormat(item.expiration_time)}`}}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
<!--      <div class="q-mt-xl q-pt-xl text-h6 text-weight-bold row justify-center">-->
<!--        <div>暂无科技云券</div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PersonalIndex {
}
</style>
