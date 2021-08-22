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
        <h1 class="text-h4">{{ status.name }}</h1>
        {{ status }}
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import { WateringStatus } from 'api-common'
import _ from 'lodash'
export default defineComponent({
  setup() {
    const status = ref(new WateringStatus())
    const ctx = useContext()
    const { $auth } = ctx
    // @ts-ignore
    ctx.onUnmounted = onUnmounted
    const socket = ctx.$nuxtSocket({
      auth: { token: ($auth.strategy as any).token.get() },
    } as any)
    onMounted(() => {
      socket.on('iot/watering/status', (data) => {
        Object.assign(status.value, data)
      })
    })

    return { status }
  },
})
</script>
