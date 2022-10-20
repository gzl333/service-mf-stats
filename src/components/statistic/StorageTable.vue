<script setup lang="ts">
import { computed } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'

const props = defineProps({
  storageTableRow: {
    type: Array,
    required: false
  },
  isLoading: {
    type: Boolean,
    required: true
  }
})

// const emits = defineEmits(['change', 'delete'])

const store = useStore()
// const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global

const serverColumns = computed(() => [
  { name: 'date', label: (() => tc('billingDate'))(), align: 'center' },
  { name: 'username', label: (() => tc('user'))(), align: 'center' },
  { name: 'storage_bucket_id', label: (() => tc('storageBucketId'))(), align: 'center' },
  { name: 'bucket_name', label: (() => tc('bucketName'))(), align: 'center' },
  { name: 'service_id', label: (() => tc('service'))(), align: 'center' },
  // { name: 'daily_statement_id', label: (() => tc('daily_statement_id'))(), align: 'center' },
  { name: 'storage', label: (() => tc('storageDuration'))(), align: 'center' },
  { name: 'original_amount', label: (() => tc('totalBillingAmount'))(), align: 'center' },
  { name: 'trade_amount', label: (() => tc('actualDeductionAmount'))(), align: 'center' }

])
</script>

<template>
  <div class="StorageTable">
    <q-table
      flat
      id="StorageMeteringTable"
      card-class="no-padding"
      table-header-class="bg-grey-1 text-grey"
      :loading="props.isLoading"
      :rows="props.storageTableRow"
      :columns="serverColumns"
      row-key="name"
      color="primary"
      :loading-label="tc('notifyLoading')"
      :no-data-label="tc('noData')"
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td class="no-padding" key="date" :props="props">{{ props.row.date }}</q-td>
          <q-td class="no-padding" key="username" :props="props">{{ props.row.username }}</q-td>
          <q-td class="no-padding" key="storage_bucket_id" :props="props">{{ props.row.storage_bucket_id }}</q-td>
          <q-td class="no-padding" key="bucket_name" :props="props">{{ props.row.bucket_name }}</q-td>
          <q-td class="no-padding" key="service_id" :props="props">{{ store.tables.serviceTable.byId[props.row.service_id]?.name }}</q-td>
          <q-td class="no-padding" key="storage" :props="props">{{ props.row.storage }}</q-td>
          <q-td class="no-padding" key="original_amount" :props="props">{{ props.row.original_amount }}</q-td>
          <q-td class="no-padding" key="trade_amount" :props="props">{{ props.row.trade_amount }}</q-td>
          <!--          <q-td class="no-padding" key="daily_statement_id" :props="props">{{ props.row.daily_statement_id }}</q-td>-->
        </q-tr>
      </template>
    </q-table>
    <q-separator/>
  </div>
</template>

<style lang="scss" scoped>
.StorageList {
}
</style>
