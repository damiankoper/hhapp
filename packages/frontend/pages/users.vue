<template>
  <v-row justify="center" align="center" fluid>
    <v-col><datatable /></v-col>
  </v-row>
</template>

<script>
import Datatable from '~/components/datatable/Datatable.vue'
import { navigationStore } from '~/store'
const title = 'Users'
export default {
  components: { Datatable },
  head() {
    return {
      title,
    }
  },
  middleware() {
    navigationStore.setTitle(title)
  },
}
</script>
