<script setup lang="ts">
// import { ref, computed } from "vue"
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})
// const emits = defineEmits(['change', 'delete'])
const { tc/* , locale  */ } = i18n.global
// const store = useStore()
// const route = useRoute()
// const router = useRouter()

</script>

<template>
  <div class="PayStatusChip">

    <q-chip v-if="props.status === 'unpaid'"
            square color="blue-grey" text-color="white" icon="las la-exclamation-circle">
      <div style=" width: 45px;text-align: center">
        {{ tc('待支付') }}
      </div>
    </q-chip>
    <q-chip v-else
            square color="light-green" text-color="white" icon="las la-check-circle">
      <div style=" width: 45px;text-align: center">
        {{ tc('已支付') }}
      </div>
    </q-chip>

  </div>
</template>

<style lang="scss" scoped>
.PayStatusChip {
}
</style>
