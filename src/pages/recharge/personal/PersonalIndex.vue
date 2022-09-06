<script setup lang="ts">
import { computed, ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import { dateFormat } from 'src/hooks/processTime'
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
// const { tc } = i18n.global
const tab = ref('available')
const availableCashCoupon = computed(() => store.getPersonalAvailableCoupon())
const expiredCashCoupon = computed(() => store.getPersonalExpiredCoupon())
const expiringCashCoupon = computed(() => store.getPersonalExpiringCoupon())
const outCashCoupon = computed(() => store.getPersonalOutCoupon())
</script>

<template>
  <div class="PersonalIndex">
    <div class="row items-center">
      <div class="text-subtitle1 text-weight-bold">个人账户余额</div>
      <div class="text-subtitle1 text-weight-bold q-ml-md">{{ `${store.items.personalBalance?.balance}点` }}</div>
<!--      <q-btn outline label="充值" class="q-ml-xl"/>-->
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
            <div>{{ `可用（${availableCashCoupon.length}）` }}</div>
          </q-tab>
          <q-tab :ripple="false" name="expiring">
            <div>{{ `即将到期（${expiringCashCoupon.length}）` }}</div>
          </q-tab>
          <q-tab :ripple="false" name="expired">
            <div>{{ `已到期（${expiredCashCoupon.length}）` }}</div>
          </q-tab>
          <q-tab :ripple="false" name="out">
            <div>{{ `已用完（${outCashCoupon.length}）` }}</div>
          </q-tab>
        </q-tabs>
      </div>
      <div class="row col-4 q-gutter-x-md items-center justify-end">
        <div class="text-subtitle1">科技云券兑换</div>
        <q-input dense outlined label="输入兑换码" class="col-5"/>
        <q-btn outline label="兑换"/>
      </div>
    </div>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="available" class="no-scroll">
        <div class="row justify-between q-mt-xl" v-if="availableCashCoupon.length !== 0">
          <div class="col-5 q-mt-lg" v-for="(item, index) in availableCashCoupon" :key="index">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-center">
                  {{ store.tables.serviceTable.byId[item.service]?.name }}
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
      <q-tab-panel name="expiring" class="no-scroll">
        <div class="row justify-between q-mt-xl" v-if="expiringCashCoupon.length !== 0">
          <div class="col-5 q-mt-lg" v-for="(item, index) in expiringCashCoupon" :key="index">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-center">
                  {{ store.tables.serviceTable.byId[item.service]?.name }}
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
      <q-tab-panel name="expired" class="no-scroll">
        <div class="row justify-between q-mt-xl" v-if="expiredCashCoupon.length !== 0">
          <div class="col-5" v-for="(item, index) in expiredCashCoupon" :key="index">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-center">
                  {{ store.tables.serviceTable.byId[item.service]?.name }}
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
      <q-tab-panel name="out" class="no-scroll">
        <div class="row justify-between q-mt-xl" v-if="outCashCoupon.length !== 0">
          <div class="col-5 q-mt-lg" v-for="(item, index) in outCashCoupon" :key="index">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold text-center">
                  {{ store.tables.serviceTable.byId[item.service]?.name }}
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
.PersonalIndex {
}
</style>
