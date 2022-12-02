<script setup lang="ts">
// import { ref } from 'vue'
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
// const { tc } = i18n.global
</script>

<template>
  <div class="walletIndex">
    <div class="row justify-start">
      <div class="col-3">
        <q-btn-group class="no-shadow" spread>
          <q-btn color="grey-1" class="text-black no-shadow" label="我的账户" icon="lar la-user-circle" />
          <q-btn color="grey-1" class="text-black no-shadow" label="代金券" icon="las la-ticket-alt" />
        </q-btn-group>
      </div>
  </div>
    this is walletIndex
  </div>
</template>

<style lang="scss" scoped>
.SettlementIndex {
}
</style>
