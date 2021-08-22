<template>
  <v-row>
    <v-col v-for="status in statuses" :key="status.id" :cols="12" :lg="6">
      <component
        :is="mapComponent(status.type)"
        :status="status"
        @action="emitAction"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import Vue from 'vue'
import { DeviceType, IDevice } from '~/../api-common/lib'
import UndefinedDevice from '~/components/iot/UndefinedDevice.vue'
import WateringCan from '~/components/iot/WateringCan.vue'
import { navigationStore } from '~/store'

export default defineComponent({
  components: { WateringCan },
  middleware() {
    navigationStore.setTitle('iot')
  },
  setup() {
    const statuses = ref<IDevice[]>([])

    const ctx = useContext()
    const { $auth } = ctx
    // @ts-ignore
    ctx.onUnmounted = onUnmounted
    const socket = ctx.$nuxtSocket({
      auth: { token: ($auth.strategy as any).token.get() },
      autoConnect: false,
    } as any)

    socket.on('iot/device/status', (data: IDevice) => {
      const i = statuses.value?.findIndex((s) => s.id === data.id)
      if (i > -1) Vue.set(statuses.value as Object, i, data)
      else statuses.value.push(data)
    })

    socket.connect()
    onMounted(() => {})

    return {
      statuses,
      mapComponent(type: DeviceType) {
        switch (type) {
          case DeviceType.WATERING_CAN:
            return WateringCan
          default:
            return UndefinedDevice
        }
      },
      emitAction(payload: { event: string; data?: any }) {
        socket.emit(payload.event, payload.data)
      },
    }
  },
})
</script>
