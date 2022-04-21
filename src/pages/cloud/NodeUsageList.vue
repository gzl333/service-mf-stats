<script setup lang="ts">
import { ref } from 'vue'
import NodeTable from '../../components/cloud/NodeTable.vue'
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
const date = ref('2019/02/01')
const text = ref('')
</script>

<template>
  <div class="NodeUsageList">
    <div class="row q-pa-lg q-gutter-sm">
      <div class="q-mt-md">
        <q-btn-group flat>
          <q-btn outline color="primary" label="本月" class="text-subtitle1 q-px-xl"/>
          <q-btn outline color="primary" label="上月" class="text-subtitle1 q-px-xl"/>
        </q-btn-group>
      </div>
      <div class="col-2">
        <q-input filled v-model="date" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-2">
        <q-input square outlined v-model="text" label="Square outlined"/>
      </div>
      <div class="col-2 q-mt-md">
        <q-btn outline color="primary" label="搜索" class="q-px-xl"/>
        <q-btn outline color="primary" label="导出" class="q-px-xl q-ml-md"/>
      </div>
    </div>
    <node-table/>
  </div>
</template>

<style lang="scss" scoped>
.NodeUsageList {
}
</style>
