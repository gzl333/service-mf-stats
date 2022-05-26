<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
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

onBeforeUnmount(() => {
  sessionStorage.removeItem('tabStatus')
})
</script>
<template>
  <div class="CloudIndex">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.CloudIndex {
}
</style>
