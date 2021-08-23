<template>
  <v-card elevation="2" style="overflow: hidden">
    <v-row no-gutters>
      <v-col
        v-if="$vuetify.breakpoint.smAndUp"
        :cols="12"
        :sm="3"
        style="position: relative"
      >
        <v-img
          class="elevation-4"
          style="position: absolute"
          :src="require('~/assets/watering-can.jpg')"
        />
      </v-col>
      <v-col>
        <v-toolbar height="48" elevation="4">
          <v-toolbar-title> {{ status.displayName }}</v-toolbar-title>
          <v-spacer />
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-sheet
                rounded
                :color="connected ? 'green' : 'red'"
                class="pa-1"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="1.5em" color="white">
                  {{ connected ? 'mdi-lightbulb-on' : 'mdi-lightbulb-off' }}
                </v-icon>
              </v-sheet>
            </template>
            <b>Connected!</b> Last update: <br />
            {{ lastStatusString }}
          </v-tooltip>
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-sheet
                rounded
                color="grey"
                class="pa-1 ml-2"
                style="display: inline-block"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon color="white"> mdi-home-search </v-icon>
              </v-sheet>
            </template>
            <b>ID:</b> {{ status.id }} <br />
            <b>MAC:</b> {{ status.mac }} <br />
            <b>Type:</b> {{ status.type }}
          </v-tooltip>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col cols="auto">
              <v-btn height="100" width="100" elevation="4" @click="emitAction">
                <v-icon size="6em" :color="status.enabled ? 'green' : 'red'">
                  mdi-power
                </v-icon>
                <br />
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-sheet
                rounded
                class="text-center d-flex flex-column justify-center"
                color="white"
                height="100"
                width="100"
                elevation="4"
              >
                <v-slide-y-transition group leave-absolute>
                  <v-icon
                    key="1"
                    x-large
                    :color="status.pompOn ? 'green' : 'red'"
                  >
                    {{
                      status.pompOn ? 'mdi-lightbulb-on' : 'mdi-lightbulb-off'
                    }}
                  </v-icon>
                  <div v-if="!disabled" key="2" class="mt-1">
                    {{ enabledDurationFormat }}
                  </div>
                  <div v-if="disabled" key="3" class="mt-1">Pomp off</div>
                </v-slide-y-transition>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
} from '@nuxtjs/composition-api'
import { DeviceType, IWateringStatus } from 'api-common'
import { DateTime } from 'luxon'
export default defineComponent({
  props: {
    status: {
      type: Object as PropType<IWateringStatus>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const lastStatus = computed(() => {
      return DateTime.fromSeconds(props.status.timestamp / 1000)
    })
    const connected = computed(() => {
      const timestamp = DateTime.fromSeconds(props.status.timestamp / 1000)
      return timestamp.plus({ minutes: 1 }) > DateTime.now()
    })
    const lastStatusString = computed(() => {
      return lastStatus.value.toLocaleString(
        DateTime.DATETIME_FULL_WITH_SECONDS
      )
    })

    const enabledTime = ref(DateTime.now())
    const enabledDuration = computed(() =>
      lastStatus.value.diff(enabledTime.value)
    )
    return {
      connected,
      lastStatusString,
      enabledDuration,
      enabledDurationFormat: computed(() => {
        return enabledDuration.value.toFormat('mm:ss')
      }),
      disabled: computed(
        () => !props.status.enabled || enabledDuration.value.as('seconds') < 0
      ),
      emitAction() {
        enabledTime.value = DateTime.now()
        emit('action', {
          event: `iot/${DeviceType.WATERING_CAN}/action`,
        })
      },
    }
  },
})
</script>
