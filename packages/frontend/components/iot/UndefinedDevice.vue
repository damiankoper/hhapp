<template>
  <v-card elevation="2" style="overflow: hidden">
    <v-row no-gutters>
      <v-col class="" :cols="3">
        <v-img
          class="elevation-4"
          :src="require('~/assets/watering-can.jpg')"
          aspect-ratio="1"
        />
      </v-col>
      <v-col class="pa-4">
        <h1 class="text-h4">Undefined device</h1>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  setup() {
    return { status }
  },
})
</script>
