<script setup lang="ts">
import { useStore } from 'stores/store'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import api from 'src/api'
interface statementServerProps {
  id?: string,
  original_amount?: string,
  payable_amount?: string,
  trade_amount?: string,
  payment_status?: string,
  payment_history_id?: string,
  date?: string,
  creation_time?: string,
  user_id?: string,
  username?: string,
  vo_id?: string,
  vo_name?: string,
  owner_type?: string,
  service?: {
    id:string,
    name: string,
    name_en: string,
    service_type: string
  }
}
const store = useStore()
const route = useRoute()
const router = useRouter()

// const query2 : Ref = ref({ id: route.query.id })
const statementServerDetail = ref<statementServerProps>({ id: route.params.id as string })
const getDetailData = async () => {
  const storageData = await api.stats.statement.getStatementStorageDetail({
    path: {
      id: route.params.id as string
    }
  })
  Object.assign(statementServerDetail.value, storageData.data)
  console.log('statementServerDetail', statementServerDetail)
}
console.log(1)
onMounted(async () => {
  await getDetailData()
})
</script>

<template>
  <div class="StatisticsIndex">
   <div class="row col-6 text-h6 text-primary text-weight-bold" >
     <q-btn icon="arrow_back_ios" flat unelevated dense
            @click="router.back()"/>
     <span>日计量单详情 </span> <span class="q-ml-lg text-primary"> {{route.params.id}} </span>
   </div>
    <div class="column items-start content-fixed-width q-my-lg text-subtitle1">
      <div class="row justify-start content-fixed-width q-mb-md">
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey">服务单元</div>
          <div class="col-8">{{ statementServerDetail?.service?.name}}</div>
        </div>
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey">用户</div>
          <div class="col-8">{{statementServerDetail?.username}}</div>
        </div>
      </div>
      <div class="row justify-start content-fixed-width  q-mb-md">
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey">结算周期</div>
          <div class="col-8">{{statementServerDetail?.date + "  00:00 - 24:00"}}</div>
        </div>
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey">下单时间</div>
          <div class="col-8">{{new Date(statementServerDetail?.creation_time).toLocaleString()}}</div>
        </div>
      </div>
      <div class="row justify-start content-fixed-width  q-mb-md">
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey">日结单金额</div>
          <div class="col-8">{{statementServerDetail?.trade_amount}}</div>
        </div>
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey">支付状态</div>
          <div class="col-8">{{statementServerDetail?.payment_status}}</div>
        </div>
      </div>
      <div class="row justify-start content-fixed-width  q-mb-md">
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey">结算资源</div>
          <div class="col-8"></div>
        </div>
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey"></div>
          <div class="col-8">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.StatisticsIndex {
}
</style>
