<script setup lang="ts">
// import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
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

const store = useStore()

// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
</script>

<template>
  <div class="Home">
    <div class="q-py-md q-px-xl row items-center">
      <q-separator vertical inset color="blue" size="0.3rem" style="height: 22px"/>
      <div class="text-h5 text-weight-bold q-ml-sm">用量记账</div>
    </div>
    <div>
      <div class="text-h6 q-py-md q-px-xl text-weight-bold">用量计费</div>
      <div class="q-pt-lg q-pb-xl q-px-xl row q-gutter-md">
        <div class="col-2" @click="navigateToUrl(store.items?.fedRole === 'federal-admin' ? '/my/stats/cloud' : '/my/stats/cloud/uuUsage/159')">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="las la-laptop-code" color="orange" size="md"/>
                <div class="text-subtitle1 text-black">云主机</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="las la-cloud-upload-alt" color="orange" size="md"/>
                <div class="text-subtitle1 text-black">对象存储</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="las la-save" color="orange" size="md"/>
                <div class="text-subtitle1 text-black">云硬盘</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="las la-file-medical-alt" color="orange" size="md"/>
                <div class="text-subtitle1 text-black">快照</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div>
      <div class="text-h6 q-py-md q-px-xl text-weight-bold">账单管理</div>
      <div class="q-pt-lg q-pb-xl q-px-xl row items-start q-gutter-md">
        <div class="col-2" v-cloak v-if="store.items?.fedRole === 'federal-admin'">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="payment" color="green-5" size="md"/>
                <div class="text-subtitle1 text-black">账单管理</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2" v-cloak v-if="store.items?.fedRole === 'ordinary'">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="personal_injury" color="green-5" size="md"/>
                <div class="text-subtitle1 text-black">个人帐单</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2" v-cloak v-if="store.items?.fedRole === 'ordinary'">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="groups" color="green-5" size="md"/>
                <div class="text-subtitle1 text-black">项目组账单</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div>
      <div class="text-h6 q-py-md q-px-xl text-weight-bold">账户管理</div>
      <div class="q-pt-lg q-px-xl row items-start q-gutter-md">
        <div class="col-2" v-cloak>
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="group" color="blue-5" size="md"/>
                <div class="text-subtitle1 text-black">账户管理</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2" v-cloak v-if="store.items?.fedRole === 'federal-admin'">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="shopping_bag" color="blue-5" size="md"/>
                <div class="text-subtitle1 text-black">账户充值记录</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2" v-cloak v-if="store.items?.fedRole === 'federal-admin'">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="las la-clipboard" color="blue-5" size="md"/>
                <div class="text-subtitle1 text-black">科技云券发放记录</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-2" v-cloak v-if="store.items?.fedRole === 'ordinary'">
          <q-card
            class="my-card text-white q-py-md"
            style="background-color: #FFF0F3"
          >
            <q-card-section>
              <div class="row items-center justify-center q-gutter-x-sm">
                <q-icon name="las la-exchange-alt" color="blue-5" size="md"/>
                <div class="text-subtitle1 text-black">科技云券兑换入口</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Home {
  [v-cloak] {
    display: none !important;
  }
  .my-card{
    width: 100%;
    max-width: 250px
  }
}
</style>
