<script setup lang="ts">
import { computed, ref, onMounted, Ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import { dateFormat } from 'src/hooks/processTime'

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
const groupId = ref('')
const groupTabActive = ref('available')
const groupTabs = computed(() => store.getGroupTabs)
const groupBalance = computed(() => store.getGroupBalanceByGroupId(groupId.value))
const availableCoupon = computed(() => store.getGroupAvailableCouponByGroupId(groupId.value))
const expiringCoupon = computed(() => store.getGroupExpiringCouponByGroupId(groupId.value))
const expiredCoupon = computed(() => store.getGroupExpiredCouponByGroupId(groupId.value))
const outCoupon = computed(() => store.getGroupOutCouponByGroupId(groupId.value))
console.log(availableCoupon)
const changeTab = async (label: string, voId: string) => {
  activeItem.value = label
  groupId.value = voId
  groupTabActive.value = 'available'
}
onMounted(async () => {
  if (store.tables.groupTable.allIds.length === 0) {
    await store.loadGroupTable()
  }
  groupId.value = groupTabs.value[0].voId
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
          <div class="text-subtitle1 text-weight-bold q-ml-lg">{{ groupBalance }}点</div>
          <!--          <q-btn outline label="充值" class="q-ml-xl"/>-->
        </div>
        <div class="row justify-between items-center q-mt-lg">
          <div class="row items-center">
            <div class="text-subtitle1 text-weight-bold">科技云券</div>
            <q-tabs
              v-model="groupTabActive"
              narrow-indicator
              dense
              align="center"
              active-color="primary"
              class="q-ml-md"
            >
              <q-tab :ripple="false" name="available">
                <div>{{ `可用（${availableCoupon.length}）` }}</div>
              </q-tab>
              <q-tab :ripple="false" name="expiring">
                <div>{{ `即将到期（${expiringCoupon.length}）` }}</div>
              </q-tab>
              <q-tab :ripple="false" name="expired">
                <div>{{ `已到期（${expiredCoupon.length}）` }}</div>
              </q-tab>
              <q-tab :ripple="false" name="out">
                <div>{{ `已用完（${outCoupon.length}）` }}</div>
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
    <q-tab-panels v-model="groupTabActive" animated>
      <q-tab-panel name="available" class="no-scroll">
        <div class="row justify-between q-mt-xl" v-if="availableCoupon.length !== 0">
          <div class="col-5 q-mt-lg" v-for="(item, index) in availableCoupon" :key="index">
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
        <div class="row justify-between q-mt-xl" v-if="expiringCoupon.length !== 0">
          <div class="col-5 q-mt-lg" v-for="(item, index) in expiringCoupon" :key="index">
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
        <div class="row justify-between q-mt-xl" v-if="expiredCoupon.length !== 0">
          <div class="col-5" v-for="(item, index) in expiredCoupon" :key="index">
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
        <div class="row justify-between q-mt-xl" v-if="outCoupon.length !== 0">
          <div class="col-5 q-mt-lg" v-for="(item, index) in outCoupon" :key="index">
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
.GroupIndex {
}
</style>
