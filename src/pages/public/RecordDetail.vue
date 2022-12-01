<script setup lang="ts">
import { useStore } from 'stores/store'
import { useRoute, useRouter } from 'vue-router'
import { Ref, ref, onMounted } from 'vue'
import api from 'src/api'

const store = useStore()
const route = useRoute()
const router = useRouter()

const query2 : Ref = ref({ id: route.query.order_id })
const htmlData = ref({
  resource_type: '',
  instance_config: { vm_cpu: '', vm_ram: '', vm_systemdisk_size: '' }
})
const getDetailData = async () => {
  // const paymentData = await store.getpaymentdetail({ id: route.params.id as string })
  // const oderData = await store.getorderdetail(query2.value)
  const paymentData = await api.stats.paymentHistory.getPaymentDetail({
    query: {
      id: route.params.id as string
    }
  })
  const oderData = await api.stats.paymentOrder.getOrderDetail({
    query: {
      id: query2.value.id
    }
  })
  Object.assign(htmlData.value, paymentData.data)
  Object.assign(htmlData.value, oderData.data)
}

onMounted(async () => {
  await getDetailData()
})
</script>

<template>
  <div class="StatisticsIndex">
   <div class="row col-6 text-h6 text-primary text-weight-bold" >
     <q-btn icon="arrow_back_ios" flat unelevated dense
            @click="router.back()"/>
     <span  >支付记录  </span> <span class="q-ml-lg text-primary"> {{route.params.id}} </span>
   </div>
    <q-card class="q-mt-lg  no-shadow">
      <q-card-section>
    <div class="row text-subtitle1">
      <div class="col-4 row text-center"><i class="las la-hand-holding-usd q-mr-sm" style="font-size: 26px"></i><span>支付金额:</span><span class="q-ml-lg ">{{ htmlData.coupon_amount + "点" }}</span></div>
      <div class="col-4 row text-center"><span>支付类型:</span><span class="q-ml-lg ">{{ htmlData['pay_type']}}</span></div>
      <div class="col-4 row text-center"><span>支付方式:</span><span class="q-ml-lg ">{{ htmlData.payment_method === 'coupon' ? '代金卷支付' : '余额支付' }}</span></div>
    </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class="">
    <div class="row">
      <i class="lab la-wpforms q-mr-sm" style="font-size: 26px"></i>
      <span class="text-subtitle1 q-mr-none">支付资源:</span>
      <div class=" column q-ml-lg items-end">
        <div class="text-subtitle1 "> <span class="q-ml-lg">类型: &nbsp;</span></div>
<!--        <div class="text-h6 q-mt-lg"><span  class="q-ml-lg">配置：</span></div>-->
        <div class="text-subtitle1 q-mt-lg"><span  class="q-ml-lg">有效时间：</span></div>
        <div class="text-subtitle1 q-mt-lg"><span  class="q-ml-lg">所属项目组：</span></div>
        <div class="text-subtitle1 q-mt-lg"><span  class="q-ml-lg">服务节点： </span></div>
      </div>
      <div class="column q-ml-lx text-h6 q-mr-lg">
        <div class="text-subtitle1"><span class="q-ml-lg" >{{ htmlData.resource_type === 'vm' ? '云主机' : '' }}</span></div>
<!--        <div class=" q-mt-lg"><span class="q-ml-lg">{{htmlData.instance_config.vm_cpu + "核" }} {{ htmlData.instance_config.vm_ram + "GB" }} {{ htmlData.instance_config.vm_systemdisk_size + "GB" }}</span></div>-->
        <div class=" text-subtitle1 q-mt-lg"><span class="q-ml-lg ">{{ htmlData.subject }}</span></div>
        <div class=" text-subtitle1 q-mt-lg"><span class="q-ml-lg">{{ htmlData.owner_type }}</span></div>
        <div class="text-subtitle1 q-mt-lg"><span class="q-ml-lg">{{ htmlData.service_name }}</span></div>
      </div>
      <div class="justify-end q-ml-lg">
        <div class="text-subtitle1 text-center row q-ml-lg">
          <i class="las la-cogs q-mr-sm" style="font-size: 26px"></i>
          <span  class="text-center ">配置： </span></div> </div>
      <div class=" row column q-ml-md items-end text-subtitle1">
        <div class=" "> <span class="q-ml-lg">CPU: </span></div>
        <div class=" q-mt-lg"><span  class="q-ml-lg">内存:</span></div>
        <div class=" q-mt-lg"><span  class="q-ml-lg">硬盘容量</span></div>
      </div>
      <div class="column q-ml-lx text-subtitle1">
        <div class=""><span class="q-ml-lg" >{{htmlData.instance_config.vm_cpu+ "核" }}</span></div>
        <div class=" q-mt-lg"><span class="q-ml-lg ">{{ htmlData.instance_config.vm_ram/1024 + "GB" }}</span></div>
        <div class=" q-mt-lg"><span class="q-ml-lg"> {{ htmlData.instance_config.vm_systemdisk_size + "GB" }}</span></div>
      </div>
    </div>
      </q-card-section>
      <q-separator/>
      <q-card-section>
    <div class="row ">
      <div class=" text-subtitle1 col-6 text-center row"> <i class="las la-file-invoice-dollar q-mr-sm" style="font-size: 26px"></i><span class="q-mr-lg">关联订单:</span> <span class=" text-primary">{{htmlData.order_id }}</span></div>
    </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<style lang="scss" scoped>
.StatisticsIndex {
}
</style>
