<script setup lang="ts">
import { i18n } from 'boot/i18n'

const props = defineProps({
  role: {
    type: String,
    required: true
  }
})
const { tc/* , locale  */ } = i18n.global
</script>

<template>
  <div class="GroupRoleChip">

    <q-chip v-if="props.role === 'owner'"
            square color="light-green" text-color="white" icon="mdi-account-star">
      <div style=" width: 45px;text-align: center">
        {{ tc('owner') }}
      </div>
    </q-chip>

    <q-chip v-if="props.role === 'leader'"
            square color="teal" text-color="white" icon="mdi-account-tie">
      <div style=" width: 45px;text-align: center">
        {{ tc('admin') }}
      </div>
    </q-chip>

    <q-chip v-if="props.role === 'member'"
            square color="blue-grey" text-color="white" icon="mdi-account">
      <div style=" width: 45px;text-align: center">
        {{ tc('member') }}
      </div>
    </q-chip>

  </div>
</template>

<style lang="scss" scoped>
.GroupRoleChip {
}
.chip {
  width: 100px;
  //text-align: center;
}
</style>
