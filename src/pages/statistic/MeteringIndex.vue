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
  <div class="MeteringIndex">
    <div class="row justify-center">
      <div class="content-fixed-width">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.MeteringIndex {
}
</style>
