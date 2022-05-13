<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UUTable from 'components/admin/cloud/UUTable.vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
import { useRoute } from 'vue-router'
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
const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const dateFrom = ref('')
const dateTo = ref('')
const isLastMonth = ref(false)
const topRow: any = ref([])
const bottomRow: any = ref([])
const query: any = ref({
  server_id: '',
  'as-admin': true
})
const changeMonth = () => {
  isLastMonth.value = !isLastMonth.value
}
onMounted(async () => {
  let obj: any = {}
  let objTwo: any = {}
  query.value.server_id = route.params.uuId
  const data = await store.getMachineDetail(query.value)
  for (const elem of data.data.results) {
    obj = {}
    objTwo = {}
    obj.server_id = elem.server_id
    obj.service_id = elem.service_id
    obj.pay_type = elem.pay_type
    obj.payment_status = elem.payment_status
    obj.owner_type = elem.owner_type
    topRow.value.push(obj)
    objTwo.creation_time = elem.creation_time
    objTwo.public_ip_hours = elem.public_ip_hours
    objTwo.cpu_hours = elem.cpu_hours
    objTwo.ram_hours = elem.ram_hours
    objTwo.disk_hours = elem.disk_hours
    objTwo.original_amount = elem.original_amount
    objTwo.trade_amount = elem.trade_amount
    bottomRow.value.push(objTwo)
  }
})
</script>

<template>
  <div class="UUUsageList">
    <div class="row q-px-lg q-pt-lg q-pb-xs">
      <div class="col-2">
        <q-btn-group>
          <q-btn :color="isLastMonth ? 'white' : 'blue-5'" label="本月" class="text-subtitle1 q-px-xl text-black"
                 @click="changeMonth"/>
          <q-btn :color="isLastMonth ? 'blue-4' : 'white'" label="上月" class="text-subtitle1 q-px-xl text-black"
                 @click="changeMonth"/>
        </q-btn-group>
      </div>
      <div class="col-4 row items-baseline">
        <div class="col-5">
          <q-input filled dense v-model="dateFrom" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateFrom">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-1 text-center">至</div>
        <div class="col-5">
          <q-input filled dense v-model="dateTo" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateTo">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="col-2">
        <q-btn outline color="primary" label="搜索" class="q-px-xl"/>
        <q-btn outline color="primary" label="导出" class="q-px-xl q-ml-sm"/>
      </div>
    </div>
    <u-u-table :topRow="topRow" :bottomRow="bottomRow"/>
  </div>
</template>

<style lang="scss" scoped>
.UUUsageList {
}
</style>
