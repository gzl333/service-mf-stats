<script setup lang="ts">
import { useStore } from 'stores/store'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import api from 'src/api'
// 获取的日计量单详情接口
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
    id?:string,
    name?: string,
    name_en?: string,
    service_type?: string
  },
  meterings?: [
    {
      id?: string,
      original_amount?: string,
      trade_amount?: string,
      daily_statement_id?: string,
      service_id?: string,
      server_id?: string,
      date?: string,
      creation_time?: string,
      user_id?: string,
      username?: string,
      vo_id?: string,
      vo_name?: string,
      owner_type?: string,
      cpu_hours?: number,
      ram_hours?: number,
      disk_hours?: number,
      public_ip_hours?: number,
      snapshot_hours?: number,
      upstream?: number,
      downstream?: number,
      pay_type?: string,
      bucket_name?: string,
      storage_bucket_id?: string,
      storage?: number,
      replication?: number,
      get_request?: number,
      put_request?: number
    }]
}

const store = useStore()
const route = useRoute()
const router = useRouter()
const statementServerDetail = ref<statementServerProps>({ id: route.params.id as string })
const tableRow = ref<[]>([])
// 获得日计量单详情 对象存储 云主机分开获取
const isRight = ref<string>('')
const getDetailData = async () => {
  let serverData :any // todo 类型还未定义
  let storageData :any // todo 类型还未定义
  await api.stats.statement.getStatementStorageDetail({
    path: {
      id: route.params.id as string
    }
  }).then((res) => {
    storageData = res.data
    isRight.value = 'storageSuccess'
    console.log(res)
    console.log(storageData)
  }).catch((error) => {
    isRight.value = 'storageFail'
    console.log(error)
  })
  if (isRight.value === 'storageFail') {
    await api.stats.statement.getStatementServerDetail({
      path: {
        id: route.params.id as string
      }
    }).then((res) => {
      serverData = res.data
    }).catch((error) => {
      console.log('err', error)
    })
  }
  if (isRight.value === 'storageSuccess') {
    Object.assign(statementServerDetail.value, storageData)
    tableRow.value = storageData.meterings
    console.log('statementServerDetail.value', statementServerDetail.value)
    console.log('tableRow.value', tableRow.value)
  } else {
    console.log('serverData', serverData)
    Object.assign(statementServerDetail.value, serverData)
    Object.assign(tableRow.value, serverData.meterings)
    console.log('statementServerDetail.value', statementServerDetail.value)
    console.log('tableRow.value', tableRow.value)
  }
}

const columnsStorage = [
  { name: 'id', align: 'center', label: '计量单号' },
  // { name: 'creation_time', label: '创建时间', align: 'center' },
  { name: 'storage', label: '数据存储量', align: 'center' },
  { name: 'downstream', label: '下行流量', align: 'center' },
  { name: 'get_request', label: 'get查询量', align: 'center' },
  { name: 'put_request', label: 'put上传量', align: 'center' },
  { name: 'replication', label: '跨域备份流出量', align: 'center' },
  { name: 'original_amount', label: '计费金额', align: 'center' },
  { name: 'trade_amount', label: '实际扣费金额', align: 'center' },
  { name: 'operate', label: '操作', align: 'center' }
]

const columnsServer = [
  { name: 'id', label: '计量单号', align: 'center' },
  // { name: 'creation_time', label: '创建时间', align: 'center' },
  { name: 'public_ip_hours', label: '公网ip', align: 'center' },
  { name: 'cpu_hours', label: 'vCPU', align: 'center' },
  { name: 'ram_hours', label: '内存', align: 'center' },
  { name: 'disk_hours', label: '本地硬盘', align: 'center' },
  { name: 'snapshot_hours', label: '快照', align: 'center' },
  { name: 'original_amount', label: '计费金额', align: 'center' },
  { name: 'trade_amount', label: '实际扣费金额', align: 'center' },
  { name: 'operate', label: '操作', align: 'center' }
]
// 展开数据详情
const OpenDetail = ref<boolean>(false)
const target = ref<boolean>(true)
const targetId = ref<string>('')
const SetOperate = (checkId: string) => {
  targetId.value = checkId
  OpenDetail.value = true
  target.value = false
  console.log('OpenDetail.value', OpenDetail.value)
}
const cancelOperate = () => {
  target.value = true
  OpenDetail.value = false
}

onMounted(async () => {
  await getDetailData()
})
interface serverProps {
  id?: string,
  name?: string,
  vcpus?: number,
  ram?: number,
  ipv4?: string,
  public_ip?: false,
  image?: string,
  creation_time?: string,
  remarks?: string,
  endpoint_url?: string,
  service?: {
    id?: string,
    name?: string,
    name_en?: string,
    service_type?: string
  },
  center_quota?: number,
  classification?: string,
  vo_id?: string,
  user?: {
    id?: string,
    username?: string,
  },
  lock?: string
}
async function getServerInformation (serverId: string) {
  const serverdata = ref<serverProps>({})
  await api.stats.statement.getStatementServerInformation({
    path: { id: serverId }
  }).then((res) => {
    serverdata.value = res.data.server.ipv4
    console.log(res)
    console.log(serverdata)
  })
  console.log("serverdata", serverdata.value.ipv4)
  return serverdata
}

</script>

<template>
  <div class="StatisticsIndex">
   <div class="row col-6 text-h6 text-primary text-weight-bold" >
     <q-btn icon="arrow_back_ios" flat unelevated dense
            @click="router.back()"/>
     <span>日计量单详情 </span> <span class="q-ml-lg text-primary"> {{route.params.id}} </span>
   </div>
    <div class="column items-start content-fixed-width q-mt-lg text-subtitle1">
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
          <div class="col-8">
          </div>
        </div>
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey"></div>
          <div class="col-8">
          </div>
        </div>
      </div>
      <div class="row justify-start content-fixed-width q-mb-md">
        <div class="col-1 row justify-start q-mr-lg">
        </div>
        <div class="col-10 row justify-start q-ml-lg">
      <q-table
        id="ServerUsageTable"
        flat
        :rows="tableRow"
        table-header-class="bg-grey-1 text-grey"
        :columns="columnsServer"
        row-key="name"
        color="primary"
        loading-label="网络请求中，请稍候..."
        no-data-label="暂无数据"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
        style="width: 973.75px;"
        v-if="isRight === 'storageFail'"
        v-model:expanded="expanded"
        virtual-scroll
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props" >
          <q-tr :props="props" :key="`m_${props.row.name}`">
            <q-td key="id" :props="props" class="text-subtitle1 text-center wrapper"   style="width:250px;" >
             <span  style="width: 100%;white-space:normal;word-break:break-all;word-wrap:break-word;">{{props.row.id}}</span>
            </q-td>
            <q-td key="public_ip_hours" :props="props">{{ props.row.public_ip_hours}}</q-td>
            <q-td key="cpu_hours" :props="props" >{{ props.row.cpu_hours}}</q-td>
            <q-td key="ram_hours" :props="props" >{{ props.row.ram_hours}}</q-td>
            <q-td key="disk_hours" :props="props">{{ props.row.disk_hours}}</q-td>
            <q-td key="snapshot_hours" :props="props">{{props.row.snapshot_hours}}</q-td>
            <q-td key="original_amount" :props="props">{{props.row.original_amount}} </q-td>
            <q-td key="trade_amount" :props="props">{{ props.row.trade_amount }} </q-td>
            <q-td key="operate" :props="props" class="text-subtitle1 text-center wrapper" >
              <q-btn  color="primary" @click="cancelOperate()" v-if=" !target &&   targetId === props.row.id" > 折叠 </q-btn>
              <q-btn  color="primary" @click="SetOperate(props.row.id)" v-else> 展开 </q-btn>
            </q-td>
          </q-tr>
          <q-tr :props="props"  class="bg-grey-3 justify-start q-virtual-scroll--with-prev" v-show="OpenDetail &&   targetId === props.row.id" >
            <q-td  colspan="100%" >
              <div class="row justify-start">
                <span class="col-2 q-pl-md"> 云主机详情</span>
                <span class="col-3"> IP地址： {{getServerInformation(props.row.server_id)}}</span>
                <span class="col-3"> 初始配置： {{new Date(props.row.creation_time).toLocaleString()}}</span>
                <span class="col-4"> 创建时间： {{new Date(props.row.creation_time).toLocaleString()}}</span>
              </div>
            </q-td>
          </q-tr>
        <div>
        </div>
        </template>
      </q-table>
          <q-table
            id="ServerUsageTable"
            flat
            :rows="tableRow"
            table-header-class="bg-grey-1 text-grey"
            :columns="columnsStorage"
            row-key="name"
            color="primary"
            loading-label="网络请求中，请稍候..."
            no-data-label="暂无数据"
            hide-pagination
            :pagination="{ rowsPerPage: 0 }"
            style="width: 973.75px;"
            v-if="isRight === 'storageSuccess'"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props" >
              <q-tr :props="props" >
                <q-td key="id" :props="props" class="text-subtitle1 text-center wrapper"   style="width: 250px;" >
                  <span  style="width: 100%;white-space:normal;word-break:break-all;word-wrap:break-word;">{{props.row.id}}</span>
                </q-td>
                <q-td key="creation_time" :props="props">{{new Date(props.row.creation_time).toLocaleString()}}</q-td>
                <q-td key="storage" :props="props">{{ props.row.storage}}</q-td>
                <q-td key="downstream" :props="props" >{{ props.row.downstream}}</q-td>
                <q-td key="get_request" :props="props" >{{props.row.get_request}}</q-td>
                <q-td key="put_request" :props="props">{{props.row.put_request}}</q-td>
                <q-td key="replication" :props="props">{{props.row.replication}}</q-td>
                <q-td key="original_amount" :props="props">{{props.row.original_amount}} </q-td>
                <q-td key="trade_amount" :props="props">{{ props.row.trade_amount }} </q-td>
                <q-td key="operate" :props="props" class="text-subtitle1 text-center wrapper" >
                  <q-btn  color="primary" @click="cancelOperate()" v-if=" !target &&   targetId === props.row.id" > 折叠 </q-btn>
                  <q-btn  color="primary" @click="SetOperate(props.row.id)" v-else> 展开 </q-btn>
                </q-td>
              </q-tr>
              <q-tr :props="props"  class="bg-grey-3 justify-start q-virtual-scroll--with-prev" v-show="OpenDetail &&   targetId === props.row.id" >
                <q-td  colspan="100%" >
                  <div class="row justify-start">
                    <span class="col-2 q-pl-md"> 对象存储桶详情</span>
                   <span class="col-4">存储桶id:
                     <span  style="width: 150px;white-space:normal;word-break:break-all;word-wrap:break-word;">
                       {{props.row.storage_bucket_id}}
                     </span>
                   </span>
                    <span class="col-3">
                      存储桶名称： {{props.row.bucket_name}}
                    </span>
                    <span class="col-3">
                      创建时间： {{new Date(props.row.creation_time).toLocaleString()}}
                    </span>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
      <div class="row justify-start content-fixed-width q-mt-lg q-mb-md">
        <div class="col-6 row justify-start">
          <div class="col-3 text-grey">支付记录编号</div>
          <div class="col-8" v-if="statementServerDetail.payment_history_id">
            {{statementServerDetail.payment_history_id}}
          </div>
          <div class="col-8" v-else>
           该日计量单暂无支付记录编号
          </div>
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
