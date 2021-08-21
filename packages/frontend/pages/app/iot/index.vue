<template>
  <v-row>
    <v-col :cols="12" :md="6">
      <watering-can />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import WateringCan from '~/components/iot/WateringCan.vue'

export default defineComponent({
  components: { WateringCan },
  setup() {
    return {}
  },
})
</script>

<style scoped lang="scss"></style>
