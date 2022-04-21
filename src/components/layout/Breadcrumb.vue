<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'

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
const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const breadList: any = ref([])

// const isHome = (route: any) => {
//   return route.name === 'home'
// }

const getBreadcrumb = () => {
  console.log(route)
  const matched = route.matched
  console.log(matched)
  // 如果不是首页
  // if (!isHome(matched[0])) {
  //   matched = [{ path: '/home', meta: { title: '首页' } }].concat(matched)
  // }
  breadList.value = matched.filter(item => item.name !== undefined)
}
onMounted(() => {
  getBreadcrumb()
})
watch(route, () => {
  getBreadcrumb()
}, { deep: true })

</script>

<template>
  <q-breadcrumbs class="text-brown q-py-sm q-px-lg">
    <template v-slot:separator>
      <q-icon
        size="2.5em"
        name="chevron_right"
        color="primary"
      />
    </template>
      <q-breadcrumbs-el v-for="(item, index) in breadList" :key="index">
        <div class="row items-center" @click="navigateToUrl(item.path)">
          <q-icon class="col-auto" size="sm" color="green" :name="item.meta.icon"></q-icon>
          <div class="col-auto text-dark text-subtitle1 text-bold">{{item.name}}</div>
        </div>
      </q-breadcrumbs-el>
  </q-breadcrumbs>
</template>

<style lang="scss" scoped>
.Breadcrumb {
}
</style>
