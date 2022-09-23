<script setup lang="ts">
import { /* ref,  */computed, PropType } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore, GroupInterface } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'

import GroupRoleChip from 'components/consumption/GroupRoleChip.vue'

/* const props =  */
defineProps({
  groups: {
    type: Array as PropType<GroupInterface[]>,
    required: true
  },
  search: {
    type: String,
    required: false
  }
})
// const emits = defineEmits(['change', 'delete'])

const { tc } = i18n.global
const store = useStore()
// const route = useRoute()
// const router = useRouter()

// group分栏定义
const columns = computed(() => [
  {
    name: 'role',
    label: (() => tc('myRole'))(),
    field: 'role',
    align: 'center',
    style: 'padding: 15px 0px',
    headerStyle: 'padding: 0 5px'
  },
  {
    name: 'name',
    label: (() => tc('group'))(),
    field: 'name',
    align: 'center',
    classes: 'ellipsis',
    style: 'padding: 15px 0px; max-width: 200px;white-space: normal;',
    headerStyle: 'padding: 0 5px'
  },
  {
    name: 'company',
    label: (() => tc('org'))(),
    field: 'company',
    align: 'center',
    classes: 'ellipsis',
    style: 'padding: 15px 0px; max-width: 150px;white-space: normal;',
    headerStyle: 'padding: 0 5px'
  },
  {
    name: 'desc',
    label: (() => tc('remarks'))(),
    field: 'desc',
    align: 'center',
    classes: 'ellipsis',
    style: 'padding: 15px 0px; max-width: 150px;white-space: normal;',
    headerStyle: 'padding: 0 5px'
  },
  {
    name: 'server',
    label: (() => tc('server'))(),
    field: 'server',
    align: 'center',
    style: 'padding: 15px 0px',
    headerStyle: 'padding: 0 5px'
  },
  {
    name: 'operation',
    label: (() => tc('operation'))(),
    field: 'operation',
    align: 'center',
    style: 'padding: 15px 0px; height: 105px;', // 每一行被此处撑开，决定行高
    headerStyle: 'padding: 0 5px'
  }
])

// 搜索方法，可扩展成更模糊的
const searchMethod = (rows: GroupInterface[], terms: string): GroupInterface[] => rows.filter(group => group.id.toLowerCase().includes(terms) || group.name.toLowerCase().includes(terms) || group.description.toLowerCase().includes(terms) || group.company.toLowerCase().includes(terms))

</script>

<template>
  <div class="GroupTable">
    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="groups"
      :columns="columns"
      row-key="name"
      :loading="store.tables.groupTable.status === 'loading'"
      color="primary"
      :loading-label="tc('notifyLoading')"
      :no-data-label="tc('notifyNoGroup')"
      hide-pagination
      :pagination="{rowsPerPage: 0}"
      :filter="search"
      :filter-method="searchMethod"
      :no-results-label="tc('notifyNoResult')"
    >

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="role" :props="props">
            <GroupRoleChip class="non-selectable" :role="props.row.myRole"/>
          </q-td>

          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>

          <q-td key="company" :props="props">
            {{ props.row.company }}
          </q-td>

          <q-td key="desc" :props="props">
            {{ props.row.description }}
            <q-tooltip>
              {{ props.row.description }}
            </q-tooltip>
          </q-td>

          <q-td key="server" :props="props">
            <div flat padding="none" dense no-caps>
              {{ store.getGroupServersByGroupId(props.row.id).length }}
              {{ tc('servers') }}
            </div>
          </q-td>

          <q-td key="operation" :props="props">
            <q-btn icon="info" flat no-caps dense padding="none" color="primary" @click="navigateToUrl(`/my/stats/consumption/group/metering/${props.row.id}`)">
              {{ tc('checkDetail') }}
            </q-btn>
          </q-td>

        </q-tr>
      </template>

      <template v-slot:bottom>
        <!--            todo 批量操作-->
      </template>

    </q-table>

  </div>
</template>

<style lang="scss" scoped>
.GroupTable {
}
</style>
