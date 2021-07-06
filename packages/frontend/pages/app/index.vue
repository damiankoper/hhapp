<template>
  <v-row justify="center" align="center" fluid>
    <v-col></v-col>
  </v-row>
</template>

<script>
import { navigationStore } from '~/store'
export default {
  middleware() {
    navigationStore.setTitle('App')
  },
  head() {
    return {
      title: 'Dashboard',
    }
  },
}
</script>
