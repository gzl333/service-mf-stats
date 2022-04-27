<script setup lang="ts">
import { ref } from 'vue'
import NodeTable from 'components/admin/cloud/NodeTable.vue'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
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

// const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const dateFrom = ref('')
const dateTo = ref('')
const text = ref('')
const isLastMonth = ref(false)
const changeMonth = () => {
  isLastMonth.value = !isLastMonth.value
}
</script>

<template>
  <div class="NodeUsageList">
    <div class="row q-pa-lg q-gutter-x-md">
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
        <q-input square dense outlined v-model="text" label="请输入"/>
      </div>
      <div class="col-2">
        <q-btn outline color="primary" label="搜索" class="q-px-xl"/>
        <q-btn outline color="primary" label="导出" class="q-px-xl q-ml-sm"/>
      </div>
    </div>
    <node-table/>
  </div>
</template>

<style lang="scss" scoped>
.NodeUsageList {
}
</style>
