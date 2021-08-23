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
          :src="require('~/assets/undefined.jpg')"
          position="0 -10px"
        />
      </v-col>
      <v-col>
        <v-toolbar height="48" elevation="4">
          <v-toolbar-title>
            [Undefined] {{ status.displayName }}</v-toolbar-title
          >
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
        <v-container style="min-height: 100px"> </v-container>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { IDevice } from 'api-common'
import { DateTime } from 'luxon'
export default defineComponent({
  props: {
    status: {
      type: Object as PropType<IDevice>,
      required: true,
    },
  },
  setup(props) {
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
    return { connected, lastStatusString }
  },
})
</script>
