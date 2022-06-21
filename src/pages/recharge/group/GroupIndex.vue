<script setup lang="ts">
import { computed, ref, onMounted, Ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import dateFormat from 'src/utils'

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
const tab = ref('available')
const groupTabs = computed(() => store.getGroupTabs)
const availableCash: Ref = ref([])
const expiringCash: Ref = ref([])
const expiredCash: Ref = ref([])
const outCash: Ref = ref([])
const changeTab = async (label: string, voId: string) => {
  availableCash.value = []
  expiringCash.value = []
  expiredCash.value = []
  outCash.value = []
  activeItem.value = label
  const resData = await store.getGroupBalance(voId)
  balance.value = resData.data.balance
  sessionStorage.setItem('groupTabStatus', label)
  const cashCouponData = await store.getGroupCashCoupon(voId)
  getAvailableCash(cashCouponData.data.results)
  getExpiredCash(cashCouponData.data.results)
  getExpiringCash(cashCouponData.data.results)
  getOutCash(cashCouponData.data.results)
}
const getAvailableCash = (dataArr: []) => {
  const now = new Date()
  dataArr.forEach((item: Record<string, string>) => {
    const startTime = dateFormat(item.expiration_time)
    const end = new Date(startTime.replace(/-/g, '/'))
    if (item.balance !== '0.00' && now.getTime() < end.getTime()) {
      availableCash.value.push(item)
    }
  })
}
const getExpiringCash = (dataArr: []) => {
  const now = new Date()
  dataArr.forEach((item: Record<string, string>) => {
    const startTime = dateFormat(item.expiration_time)
    const end = new Date(startTime.replace(/-/g, '/'))
    const total = (end.getTime() - now.getTime()) / 1000
    const spacing = parseInt(String(total / (60 * 60)))
    if (item.balance !== '0.00' && spacing > 0 && spacing <= 24) {
      expiringCash.value.push(item)
    }
  })
}
const getExpiredCash = (dataArr: []) => {
  const now = new Date()
  dataArr.forEach((item: Record<string, string>) => {
    const startTime = dateFormat(item.expiration_time)
    const end = new Date(startTime.replace(/-/g, '/'))
    const total = (end.getTime() - now.getTime()) / 1000
    const spacing = parseInt(String(total / (60 * 60)))
    if (item.balance !== '0.00' && spacing < 0) {
      expiredCash.value.push(item)
    }
  })
}
const getOutCash = (dataArr: []) => {
  dataArr.forEach((item: Record<string, string>) => {
    if (item.balance === '0.00') {
      outCash.value.push(item)
    }
  })
}
onMounted(async () => {
  if (store.tables.groupTable.allIds.length === 0) {
    await store.loadGroupTable()
  }
  if (sessionStorage.getItem('groupTabStatus') != null) {
    console.log(sessionStorage.getItem('groupTabStatus'))
    const index: any = sessionStorage.getItem('groupTabStatus') || ''
    activeItem.value = sessionStorage.getItem('groupTabStatus') || ''
    const resData = await store.getGroupBalance(store.tables.groupTable.allIds[index])
    balance.value = resData.data.balance
    const cashCouponData = await store.getGroupCashCoupon(store.tables.groupTable.allIds[index])
    getAvailableCash(cashCouponData.data.results)
    getExpiredCash(cashCouponData.data.results)
    getExpiringCash(cashCouponData.data.results)
    getOutCash(cashCouponData.data.results)
  } else {
    const resData = await store.getGroupBalance(store.tables.groupTable.allIds[0])
    balance.value = resData.data.balance
    const cashCouponData = await store.getGroupCashCoupon(store.tables.groupTable.allIds[0])
    getAvailableCash(cashCouponData.data.results)
    getExpiredCash(cashCouponData.data.results)
    getExpiringCash(cashCouponData.data.results)
    getOutCash(cashCouponData.data.results)
  }
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
        <q-tab no-caps :name="item.label" class="text-weight-bold" @click="changeTab(item.label, item.voId)"
               :ripple="false" v-for="(item, index) in groupTabs" :key="index">
          {{ item.name }}
        </q-tab>
      </q-tabs>
      <div class="col-10 q-ml-xl">
        <div class="row items-center">
          <div class="text-subtitle1 text-weight-bold">账户余额</div>
          <div class="text-subtitle1 text-weight-bold">{{ `${balance}点` }}</div>
<!--          <q-btn outline label="充值" class="q-ml-xl"/>-->
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
                <div>{{ `可用（${availableCash.length}）` }}</div>
              </q-tab>
              <q-tab :ripple="false" name="expiring">
                <div>{{ `即将到期（${expiringCash.length}）` }}</div>
              </q-tab>
              <q-tab :ripple="false" name="expired">
                <div>{{ `已到期（${expiredCash.length}）` }}</div>
              </q-tab>
              <q-tab :ripple="false" name="out">
                <div>{{ `已用完（${outCash.length}）` }}</div>
              </q-tab>
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
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="available">
        <div class="row justify-between q-mt-xl" v-if="availableCash.length !== 0">
          <div class="col-5 q-mt-lg" v-for="(item, index) in availableCash" :key="index">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-center">
                  {{ store.tables.serviceTable.byId[item.service.id]?.name }}
                </div>
              </q-card-section>
              <q-card-section class="text-center text-subtitle1">
                <span class="text-weight-bold">{{ item.face_value }}</span>
                <span>{{ `(剩余${item.balance}点)` }}</span>
              </q-card-section>
              <q-separator inset/>
              <q-card-section>
                <div class="text-subtitle1 text-center">
                  {{ `${dateFormat(item.effective_time)} ~ ${dateFormat(item.expiration_time)}` }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="q-mt-xl q-pt-xl text-h6 text-weight-bold row justify-center" v-else>
          <div>暂无科技云券</div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="expiring">
        <div class="row justify-between q-mt-xl" v-if="expiringCash.length !== 0">
          <div class="col-5 q-mt-lg" v-for="(item, index) in expiringCash" :key="index">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-center">
                  {{ store.tables.serviceTable.byId[item.service.id]?.name }}
                </div>
              </q-card-section>
              <q-card-section class="text-center text-subtitle1">
                <span class="text-weight-bold">{{ item.face_value }}</span>
                <span>{{ `(剩余${item.balance}点)` }}</span>
              </q-card-section>
              <q-separator inset/>
              <q-card-section>
                <div class="text-subtitle1 text-center">
                  {{ `${dateFormat(item.effective_time)} ~ ${dateFormat(item.expiration_time)}` }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="q-mt-xl q-pt-xl text-h6 text-weight-bold row justify-center" v-else>
          <div>暂无科技云券</div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="expired">
        <div class="row justify-between q-mt-xl" v-if="expiredCash.length !== 0">
          <div class="col-5" v-for="(item, index) in expiredCash" :key="index">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-center">
                  {{ store.tables.serviceTable.byId[item.service.id]?.name }}
                </div>
              </q-card-section>
              <q-card-section class="text-center text-subtitle1">
                <span class="text-weight-bold">{{ item.face_value }}</span>
                <span>{{ `(剩余${item.balance}点)` }}</span>
              </q-card-section>
              <q-separator inset/>
              <q-card-section>
                <div class="text-subtitle1 text-center">
                  {{ `${dateFormat(item.effective_time)} ~ ${dateFormat(item.expiration_time)}` }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="q-mt-xl q-pt-xl text-h6 text-weight-bold row justify-center" v-else>
          <div>暂无科技云券</div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="out">
        <div class="row justify-between q-mt-xl" v-if="outCash.length !== 0">
          <div class="col-5 q-mt-lg" v-for="(item, index) in outCash" :key="index">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-center">
                  {{ store.tables.serviceTable.byId[item.service.id]?.name }}
                </div>
              </q-card-section>
              <q-card-section class="text-center text-subtitle1">
                <span class="text-weight-bold">{{ item.face_value }}</span>
                <span>{{ `(剩余${item.balance}点)` }}</span>
              </q-card-section>
              <q-separator inset/>
              <q-card-section>
                <div class="text-subtitle1 text-center">
                  {{ `${dateFormat(item.effective_time)} ~ ${dateFormat(item.expiration_time)}` }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="q-mt-xl q-pt-xl text-h6 text-weight-bold row justify-center" v-else>
          <div>暂无科技云券</div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style lang="scss" scoped>
.GroupIndex {
}
</style>
