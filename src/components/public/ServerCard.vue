<script setup lang="ts">
import { useStore } from 'stores/store'
import { i18n } from 'boot/i18n'

const props = defineProps({
  cardObj: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
const store = useStore()
const { tc } = i18n.global
</script>

<template>
  <div class="ServerCard">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="row">
          <div class="col-3 text-center">
            <div>UUID</div>
            <div class="text-subtitle1 q-mt-lg">{{ props.cardObj.serverId }}</div>
          </div>
          <div class="col-3 text-center">
            <div>{{ tc('serviceUnit') }}</div>
            <div class="text-subtitle1 q-mt-lg">{{ store.tables.serviceTable.byId[props.cardObj?.service]?.name }}</div>
          </div>
          <div class="col-2 text-center">
            <div>{{ tc(props.title) }}</div>
            <div class="text-subtitle1 q-mt-lg">{{ props.cardObj.name }}</div>
          </div>
          <div class="col-2 text-center">
            <div>{{ tc('initialConfiguration') }}</div>
            <div class="text-subtitle1 q-mt-lg">
              {{ props.cardObj.vcpus + ' ' + tc('core') + ' ' + props.cardObj.ram / 1024 + ' GB' }}
            </div>
          </div>
          <div class="col-2 text-center">
            <div>{{ tc('publicIp') }}</div>
            <div class="text-subtitle1 q-mt-lg">{{ props.cardObj.ipv4 }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
</style>
