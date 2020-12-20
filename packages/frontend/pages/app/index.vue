<template>
  <v-row justify="center" align="center" fluid>
    <v-col></v-col>
  </v-row>
</template>

<script>
import { navigationStore } from '~/store'
export default {
  head() {
    return {
      title: 'Dashboard',
    }
  },
  middleware() {
    navigationStore.setTitle('App')
  },
}
</script>
