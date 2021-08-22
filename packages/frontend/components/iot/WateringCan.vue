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
      <v-col class="grey lighten-4">
        <v-toolbar height="48" elevation="4">
          <v-toolbar-title> {{ status.displayName }}</v-toolbar-title>
          <v-spacer />
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-sheet
                rounded
                :color="on ? 'green' : 'red'"
                class="pa-1"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="1.5em" color="white">
                  {{ on ? 'mdi-lightbulb-on' : 'mdi-lightbulb-off' }}
                </v-icon>
              </v-sheet>
            </template>
            <b>Connected!</b> Last update: <br />
            {{ lastStatusTime }}
          </v-tooltip>
        </v-toolbar>
        <v-container>
          <v-row class="font-weight-bold">
            <v-col cols="auto">
              <v-btn
                v-ripple
                color="white"
                height="100"
                width="100"
                elevation="4"
                @click="emitAction"
              >
                <v-icon size="6em" :color="status.enabled ? 'green' : 'red'">
                  mdi-power
                </v-icon>
                <br />
              </v-btn>
            </v-col>
            <v-col>
              <v-row dense>
                <v-col :cols="12">
                  <v-sheet
                    rounded
                    :color="status.pompOn ? 'green' : 'red'"
                    class="pa-2 mr-1"
                    style="display: inline-block"
                  >
                    <v-icon color="white">
                      {{
                        status.pompOn ? 'mdi-lightbulb-on' : 'mdi-lightbulb-off'
                      }}
                    </v-icon>
                  </v-sheet>
                  Pomp on/off
                </v-col>
                <v-col :cols="12">
                  <v-sheet
                    rounded
                    :color="status.pompOn ? 'green' : 'red'"
                    class="pa-2 mr-1"
                    style="display: inline-block"
                  >
                    <v-icon color="white">
                      {{
                        status.pompOn ? 'mdi-lightbulb-on' : 'mdi-lightbulb-off'
                      }}
                    </v-icon>
                  </v-sheet>
                  Pomp on/off
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
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
    const on = computed(() => {
      const timestamp = DateTime.fromSeconds(props.status.timestamp / 1000)
      return timestamp.plus({ minutes: 1 }) > DateTime.now()
    })
    const lastStatusTime = computed(() => {
      const timestamp = DateTime.fromSeconds(props.status.timestamp / 1000)
      return timestamp.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
    })
    return {
      on,
      lastStatusTime,
      emitAction() {
        emit('action', {
          event: `iot/${DeviceType.WATERING_CAN}/action`,
        })
      },
    }
  },
})
</script>
