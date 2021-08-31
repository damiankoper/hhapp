<template>
  <div style="position: relative" class="pt-8 mt-8">
    <v-slide-y-transition group class="row" leave-absolute>
      <v-col v-for="status in statuses" :key="status.id" :cols="12" :lg="6">
        <component
          :is="mapComponent(status.type)"
          :status="status"
          @action="emitAction"
        />
      </v-col>
      <v-row
        v-if="statuses.length == 0 && !awaitingStatus"
        key="nodata"
        no-gutters
        justify="center"
        class="mt-4"
      >
        <v-col cols="auto">
          <v-img src="/box.svg" aspect-ratio="1" max-width="100" />
        </v-col>
        <v-col cols="12" class="text-center">
          <div class="text-h4">No devices found!</div>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </div>
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

  setup(_, { root }) {
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

    const awaitingStatus = ref(true)
    onMounted(() => {
      root.$nuxt.$loading.start()
      socket.on('connect', () => {
        setTimeout(() => {
          awaitingStatus.value = false
          root.$nuxt.$loading.finish()
        }, 300)
      })
    })

    socket.connect()

    return {
      statuses,
      awaitingStatus,
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
